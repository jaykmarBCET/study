// Extend NextRequest to include `user`
import { NextRequest as OriginalNextRequest } from "next/server";

// Extend the `NextRequest` type to add the `user` property
interface ExtendedNextRequest extends OriginalNextRequest {
  user?: any; // You can specify the type for `user` based on your needs
}

import { User } from "../models/User.model";
import { dbConnect } from "../utils/dbConnect";
import JWT from "jsonwebtoken";

dbConnect();

const Auth = async (req: ExtendedNextRequest) => {  // Use ExtendedNextRequest here
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

    req.user = user; // Now this is valid as `user` is part of the extended request type
    return { status: "ok", user };
  } catch (error) {
    return { status: "failed", message: "Authentication failed", error: error };
  }
};

export { Auth };
