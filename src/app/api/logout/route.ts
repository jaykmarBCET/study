import { Auth } from "../../../authentication/Auth";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const authenticatedUser = await Auth(req);
        if (authenticatedUser?.message) {
            return NextResponse.json(authenticatedUser, { status: 400 });
        }

        const res = NextResponse.json(authenticatedUser, { status: 200 });

        res.cookies.set("token", "edfgcfxdsdfgrdhgfg", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return res;
    } catch (error) {
        console.error("Error in authentication:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
};
