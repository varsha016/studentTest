import TestAttempt from "../../../../models/user/testAttemptModel";
import connectDB from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    await connectDB();

    // Correctly extract the ID from the request URL
    const id = params?.id;

    if (!id) {
        return NextResponse.json({ success: false, message: "Invalid attempt ID" }, { status: 400 });
    }

    try {
        const attempt = await TestAttempt.findByIdAndDelete(id);

        if (!attempt) {
            return NextResponse.json({ success: false, message: "Attempt not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Attempt deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting attempt:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
