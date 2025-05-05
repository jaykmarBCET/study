import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import JWT from "jsonwebtoken";
export const GET = async (req: NextRequest) => {
  const query = req.nextUrl.searchParams.get("query");

  if (!query) {
    return NextResponse.json({ message: "query required" }, { status: 400 });
  }
  const token = JWT.sign({query},process.env.NEXT_PUBLIC_BACKEND_SECRET_KEY!,{expiresIn:'10s'})
  try {
    console.log( process.env.NEXT_PUBLIC_BACKEND_API_URL   )
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/search`, {
      params: { query:token },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching from backend:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
