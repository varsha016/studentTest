import connectDB from "../../../lib/db";
import User from "../../../models/user/UserModel";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();

    const { name, lastName, username, password, contactNumber } = await req.json();

    try {
        // Check if username or contact number already exists
        const existingUser = await User.findOne({ $or: [{ username }, { contactNumber }] });
        if (existingUser) {
            return NextResponse.json(
                { message: "Username or contact number already exists" },
                { status: 400 }
            );
        }

        // Validate required fields
        if (!name || !lastName || !username || !password || !contactNumber) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Create a new user without hashing the password
        const newUser = await User.create({
            name,
            lastName,
            username,
            password, // Save the password as plain text (not recommended for production)
            contactNumber,
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    lastName: newUser.lastName,
                    username: newUser.username,
                },
                userToken: token,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { message: "Something went wrong", error: err.message },
            { status: 500 }
        );
    }
}