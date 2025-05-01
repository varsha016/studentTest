import connectDB from "../../../../lib/db";
import User from "../../../../models/user/UserModel";
import { NextResponse } from "next/server";

// Update User by ID
export async function PUT(req, { params }) {
    await connectDB();

    const { id } = await params; // Extract user ID from the dynamic route
    const { name, lastName, username, contactNumber, password } = await req.json();

    try {
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Update user details
        if (name) user.name = name;
        if (lastName) user.lastName = lastName;
        if (username) user.username = username;
        if (password) user.password = password;
        if (contactNumber) user.contactNumber = contactNumber;

        await user.save();

        return NextResponse.json(
            { message: "User updated successfully", user },
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
