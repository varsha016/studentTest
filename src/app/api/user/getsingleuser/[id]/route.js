import connectDB from "../../../lib/db";
import User from "../../../models/user/UserModel";
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
    await connectDB();

    const { id } = await params; // Extract user ID from the dynamic route

    try {
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "User retrieved successfully", user },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { message: "Something went wrong", error: err.message },
            { status: 500 }
        );
    }
}