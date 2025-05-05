import { NextRequest, NextResponse } from "next/server";
import { Videos } from "../../../../models/Video.model";
import { PlayList } from "../../../../models/playlist.model";
import { Auth } from "../../../../authentication/Auth";
import { IVideo, IPlaylist } from "../../../../utils/type";


interface AuthenticatedUser {
  _id: string;
  [key: string]: any;
}

interface AuthResponse {
  user?: AuthenticatedUser;
  message?: string;
}

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const listId = req.nextUrl.searchParams.get("listId");

    if (!listId) {
      return NextResponse.json({ message: "listId is required" }, { status: 400 });
    }

    const authentication: AuthResponse = await Auth(req);
    if (!authentication.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = authentication.user;

    const playlist = await PlayList.findOne({ listId, userId: user._id }).lean<IPlaylist>();
    if (!playlist) {
      return NextResponse.json({ message: "Playlist not found" }, { status: 404 });
    }

    const videos = await Videos.findOne({ listId }).lean<IVideo>();

    return NextResponse.json({ playlist, videos }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
};
