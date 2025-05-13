import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import JWT from 'jsonwebtoken'

export const GET = async (req: NextRequest) => {
  const query = req.nextUrl.searchParams.get("query");

  if (!query) {
    return NextResponse.json({ message: "Query parameter is required" }, { status: 400 });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    if (!apiUrl) {
      console.error("Missing NEXT_PUBLIC_BACKEND_API_URL in environment");
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }
    
    const { data } = await axios.get(`${apiUrl}`, {
      params: { query },
    });
    console.log(data)

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching from backend:", error.message || error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
