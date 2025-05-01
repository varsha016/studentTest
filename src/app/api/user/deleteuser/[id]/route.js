import connectDB from "../../../../lib/db";
import User from "../../../../models/user/UserModel";
import { NextResponse } from "next/server";
// Delete User by ID
export async function DELETE(req, { params }) {
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

        await User.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "User deleted successfully" },
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