import connectDB from "../../../lib/db";
import User from "../../../models/user/UserModel";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();

    try {
        const users = await User.find({}, "-password"); // Exclude passwords for security
        return NextResponse.json({ users }, { status: 200 });
    } catch (err) {
        console.error("Error fetching users:", err);
        return NextResponse.json({ message: "Something went wrong", error: err.message }, { status: 500 });
    }
}
