import { NextRequest, NextResponse } from "next/server";
import { Auth } from "../../../authentication/Auth";
import { PlayList } from "../../../models/playlist.model";
import { Videos } from "../../../models/Video.model";
import { grabVideo } from "../../../utils/grabList";
import { dbConnect } from "../../../utils/dbConnect";
import { Result } from "ytpl";

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
    const listParam = parsedUrl.searchParams.get("list");
    if (listParam) return listParam;
  } catch {
    return "";
  }
  return "";
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

    const authentication: AuthResponse = await Auth(req);
    if (authentication.message) {
      return NextResponse.json(authentication, { status: 400 });
    }
    console.log(authentication)

    const user = authentication.user!;
    const existPlayList = await PlayList.findOne({ listId, userId: user._id });

    if (existPlayList) {
      return NextResponse.json({ message: "Already created this playlist" }, { status: 400 });
    }

    const grab: Result = await grabVideo(listId);

    const playlistData = {
      userId: user._id,
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

    try {
      let video = await Videos.findOne({ listId });

      if (!video) {
        const items = [...grab.items];
        const response = await Videos.create({ listId: grab.id, items });
        video = await Videos.findById(response._id);
      }

      return NextResponse.json({ playlist, video }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ message: "Database problem", error: err.message }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Server problem", error: error.message }, { status: 500 });
  }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const authentication: AuthResponse = await Auth(req);
    if (authentication.message) {
      return NextResponse.json(authentication, { status: 400 });
    }

    const user = authentication.user;
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const allPlayList = await PlayList.find({ userId: user._id });

    if (!allPlayList?.length) {
      return NextResponse.json({ message: "No playlists found" }, { status: 200 });
    }

    return NextResponse.json({ playlist: allPlayList }, { status: 200 });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Server problem", error: error.message }, { status: 500 });
  }
};
