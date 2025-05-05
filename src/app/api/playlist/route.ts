import { NextRequest, NextResponse } from "next/server";
import { Auth } from "../../../authentication/Auth";
import { PlayList } from "../../../models/playlist.model";
import { Videos } from "../../../models/Video.model";
import { grabVideo } from "../../../utils/grabList";
import { dbConnect } from "../../../utils/dbConnect";

dbConnect();

interface AuthResponse {
  user?: { _id: string; [key: string]: any };
  message?: string;
}

interface PlaylistRequestBody {
  playlistUrl: string;
}

const extractPlaylistId = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get("list") || "";
  } catch {
    return "";
  }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { playlistUrl }: PlaylistRequestBody = await req.json();

    if (!playlistUrl) {
      return NextResponse.json({ message: "Playlist URL is required" }, { status: 400 });
    }

    const listId = extractPlaylistId(playlistUrl);
    if (!listId) {
      return NextResponse.json({ message: "Playlist ID not found in URL" }, { status: 400 });
    }

    const auth: AuthResponse = await Auth(req);
    if (auth.message || !auth.user) {
      return NextResponse.json(auth, { status: 401 });
    }

    const userId = auth.user._id;

    const existingPlaylist = await PlayList.findOne({ listId, userId });
    if (existingPlaylist) {
      return NextResponse.json({ message: "Playlist already exists" }, { status: 409 });
    }

    const grab = await grabVideo(listId);

    if ("message" in grab) {
      return NextResponse.json({ message: "Failed to fetch playlist", error: grab.error }, { status: 500 });
    }

    const playlistData = {
      userId,
      listId: grab.id,
      title: grab.title,
      TotalItems: grab.estimatedItemCount,
      thumbnails: grab.thumbnails?.[0]?.url || "",
      author: grab.author?.name || "Unknown",
    };

    const playlist = await PlayList.create(playlistData);
    if (!playlist) {
      return NextResponse.json({ message: "Failed to create playlist" }, { status: 500 });
    }

    let video = await Videos.findOne({ listId });

    if (!video) {
      const items = [...grab.items];
      video = await Videos.create({ listId: grab.id, items });
    }

    return NextResponse.json({ playlist, video }, { status: 201 });

  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const auth: AuthResponse = await Auth(req);
    if (auth.message || !auth.user) {
      return NextResponse.json(auth, { status: 401 });
    }

    const allPlaylists = await PlayList.find({ userId: auth.user._id });
    if (!allPlaylists.length) {
      return NextResponse.json({ message: "No playlists found" }, { status: 200 });
    }

    return NextResponse.json({ playlist: allPlaylists }, { status: 200 });
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
};
