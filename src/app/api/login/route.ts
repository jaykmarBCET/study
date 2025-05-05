import { NextRequest, NextResponse } from "next/server";
import { User } from "../../../models/User.model";
import bcrypt from "bcrypt";
import { GenerateToken } from "../../../utils/GenerateToken";
import { dbConnect } from "../../../utils/dbConnect";
import { IUser } from "../../../utils/type"; 

dbConnect();

interface LoginRequestBody {
  email: string;
  password: string;
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body: LoginRequestBody = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    console.log("Querying user with email:", email);
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Incorrect password" }, { status: 400 });
    }

    const token = String(GenerateToken(user._id.toString()))

    const newUser = await User.findById(user._id).select("-password").lean();

    const response = NextResponse.json({
      message: "Successfully logged in",
      user: newUser,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
