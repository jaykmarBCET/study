import { NextRequest, NextResponse } from "next/server";
import { Auth } from "../../../authentication/Auth";
import { askGemini } from '../../../utils/gemini';

interface BodyInfo {
  query: string;
  videoUrl: string;
}

export const POST = async (req: NextRequest) => {
  const user = await Auth(req);
  if (user.message) {
    return NextResponse.json({ message: "Unauthorized request" }, { status: 401 });
  }

  try {
    const body: BodyInfo | null = await req.json(); // Use req.json() to parse the body
    if (!body?.query || !body?.videoUrl) {
      return NextResponse.json({ message: "Query and videoUrl are required" }, { status: 400 });
    }


    const { query, videoUrl } = body;

    const prompt = `
      ## System Prompt
      You are an AI that summarizes videos in simple, easy-to-understand English. Avoid comments, disclaimers, or meta statements. Write concise, small text focusing only on the key points related to the given topic.

      ## User Prompt
      video: ${videoUrl}. Focus specifically on the aspects related to ${query}.
    `;

    const response = await askGemini(prompt);
    return NextResponse.json({ text: response }, { status: 200 });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "Internal server issue" }, { status: 500 });
  }
};