import { NextResponse, NextRequest } from "next/server";
import { Videos } from "../../../../models/Video.model";
import { PlayList } from "../../../../models/playlist.model";
import { Auth } from "../../../../authentication/Auth";

export const GET = async (req: NextRequest) => {
    try {
        const listId = req.nextUrl.searchParams.get("listId");
        
        if (!listId) {
            return NextResponse.json({ message: "listId is required" }, { status: 400 });
        }
        console.log("one two")

        const authentication = await Auth(req);
        if (!authentication?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = authentication?.user;
        

        const playlist = await PlayList.findOne({ listId, userId: user._id }).lean();
        
        if (!playlist) {
            return NextResponse.json({ message: "Playlist not found" }, { status: 404 });
        }

        const videos = await Videos.findOne({ listId: playlist.listId }).lean();
        

        return NextResponse.json({ playlist, videos }, { status: 200 });

    } catch (error) {
        console.error("Error fetching playlist:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
};
