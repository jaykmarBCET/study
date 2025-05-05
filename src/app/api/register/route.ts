import { NextResponse, NextRequest } from "next/server";
import { User } from "../../../models/User.model"
import { GenerateToken } from "../../../utils/GenerateToken";
import { dbConnect } from "../../../utils/dbConnect";
import bcrypt from "bcrypt";

export interface UserSchemaInterface {
  name: string;
  email: string;
  password: string;
}

 dbConnect();

export const POST = async (req: NextRequest) => {
  try {
   

    const { name, email, password }: UserSchemaInterface = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return NextResponse.json({ message: "Already have an account" }, { status: 400 });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, name, password: hashPassword });

    if (!newUser) {
      return NextResponse.json({ message: "Server issue" }, { status: 500 });
    }

    const token = await GenerateToken(newUser._id);
    const user = await User.findById(newUser._id).select("-password");

    const response = NextResponse.json({ message: "Account created", user }, { status: 201 });

    
    response.cookies.set("token", token, { httpOnly: true, secure: true });

    return response;
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
