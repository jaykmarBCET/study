import { User } from "../models/User.model";
import { dbConnect } from "../utils/dbConnect";
import { NextRequest } from "next/server";
import JWT from "jsonwebtoken";

dbConnect();

const Auth = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value || req.headers.get("authorization");

    if (!token) {
      return { status: "failed", message: "No token provided" };
    }

    const decoded = JWT.verify(token, process.env.JWT_SECURE_KEY as string);

    if (!decoded || typeof decoded !== "object") {
      return { status: "failed", message: "Expired or invalid token" };
    }
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return { status: "failed", message: "User not found" };
    }
    req.user = user;
    return { status: "ok", user };
  } catch (error) {
    return { status: "failed", message: "Authentication failed", error: error.message };
  }
};

export { Auth };
