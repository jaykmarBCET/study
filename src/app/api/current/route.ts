import { NextResponse, NextRequest } from "next/server";
import { Auth } from "../../../authentication/Auth";
import { dbConnect } from "../../../utils/dbConnect";

dbConnect();

export const GET = async (req: NextRequest) => {
    const authentication = await Auth(req);

    if (authentication?.message) {
        return NextResponse.json(authentication, { status: 400 });
    }

    if (!authentication?.user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user =authentication.user;
    

    return NextResponse.json(user, { status: 200 });
};
