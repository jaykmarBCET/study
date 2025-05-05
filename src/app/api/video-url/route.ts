import ytDlpExec from "yt-dlp-exec";
import { VideoUrl } from "../../../models/videoUrl.model";
import { NextResponse, NextRequest } from "next/server";
import { Auth } from "../../../authentication/Auth";

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get("id");
        
        if (!videoId) {
            return NextResponse.json({ message: "Video ID required" }, { status: 400 });
        }

        const user = await Auth(req);
        if (user?.message) {
            return NextResponse.json({ message: "Unauthorized request" }, { status: 401 });
        }

        const existVideo = await VideoUrl.findOne({ videoId });
        if (existVideo) {
            return NextResponse.json({ url: existVideo.url }, { status: 200 });
        }

        const resultUrl = await grabVideoMP4Url(videoId);
        if (!resultUrl) {
            return NextResponse.json({ message: "Server problem" }, { status: 500 });
        }

        await VideoUrl.create({ videoId, url: resultUrl });
        return NextResponse.json({ url: resultUrl }, { status: 200 });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ message: "Server issue", error }, { status: 500 });
    }
};

const grabVideoMP4Url = async (videoId: string) => {
    try {
        const output = await ytDlpExec(`https://www.youtube.com/watch?v=${videoId}`, {
            format: "best[ext=mp4]",
            getUrl: true,
        });

        return output?.trim() || null;
    } catch (error) {
        console.error("yt-dlp error:", error);
        return null;
    }
};
