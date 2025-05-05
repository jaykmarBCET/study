import { NextRequest, NextResponse } from "next/server";
import { Auth } from "../../../authentication/Auth";
import { PlayList } from "../../../models/playlist.model";
import { Videos } from "../../../models/Video.model";
import { grabVideo } from "../../../utils/grabList";
import { dbConnect } from "../../../utils/dbConnect";

dbConnect();

const extractPlaylistId = (url: string) => {
  const parsedUrl = new URL(url);
  if (parsedUrl.hostname === "www.youtube.com" || parsedUrl.hostname === "youtube.com") {
    return parsedUrl.searchParams.get("list") || "";
  } else if (parsedUrl.hostname === "youtu.be") {
    return parsedUrl.pathname.split("/")[1] || "";
  }
  return "";
};

export const POST = async (req: NextRequest) => {
  try {
    const { playlistUrl }: { playlistUrl: string } = await req.json();
    if (!playlistUrl) {
      return NextResponse.json({ message: "Playlist URL is required" }, { status: 400 });
    }

    const listId = extractPlaylistId(playlistUrl);
    if (!listId) {
      return NextResponse.json({ message: "Playlist ID not found in URL" }, { status: 400 });
    }
   
    const authentication = await Auth(req);
    if (authentication.message) {
      return NextResponse.json(authentication, { status: 400 });
    }


    const user = authentication?.user;
    
    const existPlayList = await PlayList.findOne({ listId, userId: user._id });
    
    if (existPlayList) {
      return NextResponse.json({ message: "Already created this playlist" }, { status: 400 });
    }

    const grabvideo = await grabVideo(listId);

    const playlistData = {
      userId: user._id,
      listId: grabvideo.id,
      title: grabvideo.title,
      TotalItems: grabvideo.estimatedItemCount,
      thumbnails: grabvideo.thumbnails[0].url,
      author: grabvideo.author.name,
    };

    const playlist = await PlayList.create(playlistData);

    if (!playlist) {
      return NextResponse.json({ message: "Failed to create playlist" }, { status: 500 });
    }

    try {
        
        let video = await Videos.findOne({ listId });
        

        if (!video) {
            const items = [...grabvideo.items]
            
          const response = await Videos.create({ listId: grabvideo.id, items: items });
          video = await Videos.findById(response._id);
        }
        return NextResponse.json({ playlist, video }, { status: 200 });
    } catch (error) {
        return NextResponse.json({message:'database problem'},{status:500})
    }

  } catch (error) {
    console.error("Error:", error); 
    return NextResponse.json({ message: "Server problem", error: error.message }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const authentication = await Auth(req);
    if (authentication?.message) {
      return NextResponse.json(authentication, { status: 400 });
    }

    const user = authentication?.user;
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const allPlayList = await PlayList.find({ userId: user._id });
    if (!allPlayList || allPlayList.length === 0) {
      return NextResponse.json({ message: "No playlists found" }, { status: 200 });
    }

    return NextResponse.json({ playlist: allPlayList }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Server problem", error: error.message }, { status: 500 });
  }
};
