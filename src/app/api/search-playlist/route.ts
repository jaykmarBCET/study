import { NextRequest, NextResponse } from "next/server";
import { grabVideo } from "../../../utils/grabList"; // Adjust the path if needed

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    // Validate input
    if (!body.listId || typeof body.listId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing listId in request body" },
        { status: 400 }
      );
    }

    const response = await grabVideo(body.listId);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in /api/grab-video:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
