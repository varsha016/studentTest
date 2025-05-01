import connectDB from "../../../lib/db";
import User from "../../../models/user/UserModel";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();

    const { username, password } = await req.json();

    try {
        // Check if the user exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: existingUser._id, username: existingUser.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return NextResponse.json(
            {
                message: "Login successful",
                user: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    lastName: existingUser.lastName,
                    username: existingUser.username,
                },
                userToken: token,
            },
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

