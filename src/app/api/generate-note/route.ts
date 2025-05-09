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

    const prompt = `video: ${videoUrl}. Focus specifically on the aspects related to ${query}. write in small text as easy to understand make sure please one send answer not have any comment and commitment`;

    const response = await askGemini(prompt);
    return NextResponse.json({ text: response }, { status: 200 });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "Internal server issue" }, { status: 500 });
  }
};