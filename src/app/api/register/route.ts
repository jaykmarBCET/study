import { NextRequest, NextResponse } from "next/server";
import { User } from "../../../models/User.model";
import { GenerateToken } from "../../../utils/GenerateToken";
import { dbConnect } from "../../../utils/dbConnect";
import bcrypt from "bcrypt";

// Connect to the database
dbConnect();

// Request body type
export interface UserSchemaInterface {
  name: string;
  email: string;
  password: string;
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body: UserSchemaInterface = await req.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return NextResponse.json({ message: "Already have an account" }, { status: 400 });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ email, name, password: hashPassword });
    if (!newUser) {
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    }

    // Generate JWT token
    const token = (await GenerateToken(newUser._id)) as string;

    // Fetch user without password for response
    const user = await User.findById(newUser._id).select("-password");

    // Create and configure response
    const response = NextResponse.json(
      { message: "Account created successfully", user },
      { status: 201 }
    );

    // Set cookie securely
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
};
