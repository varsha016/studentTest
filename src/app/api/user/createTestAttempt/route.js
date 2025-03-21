import TestAttempt from "../../../models/user/testAttemptModel";
import connectDB from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const { userId, sectionId } = await req.json();
        console.log("🟢 Creating Test Attempt for:", { userId, sectionId });

        if (!userId || !sectionId) {
            return NextResponse.json({ message: "User ID and Section ID are required" }, { status: 400 });
        }

        // Create a new test attempt
        const newTestAttempt = new TestAttempt({
            userId,
            sectionId,
            responses: [],
            score: 0,
            completedAt: null
        });

        await newTestAttempt.save();
        console.log("✅ Test Attempt Created:", newTestAttempt);

        return NextResponse.json({ message: "Test attempt created", testAttemptId: newTestAttempt._id }, { status: 201 });
    } catch (error) {
        console.error("🔥 Error in /api/user/createTestAttempt:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
