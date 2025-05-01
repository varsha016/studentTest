import connectDB from "../../../lib/db";
import User from "../../../models/user/UserModel";
import { NextResponse } from "next/server";

// Get All Users
export async function GET() {
    await connectDB();

    try {
        const users = await User.find(); // Fetch all users from the database

        if (!users || users.length === 0) {
            return NextResponse.json(
                { message: "No users found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Users retrieved successfully", users },
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

