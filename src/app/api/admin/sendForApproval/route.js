


import { authenticate } from "../../../lib/auth/auth";
import { NextResponse } from "next/server";
import Question from "../../../models/admin/QuestionModel";
import connectDB from "../../../lib/db";









export async function POST(req) {
    try {
        await connectDB();

        const { questionIds } = await req.json();

        if (!questionIds || questionIds.length === 0) {
            return new Response(JSON.stringify({ message: "No questions selected." }), { status: 400 });
        }

        // Update only the selected questions from "draft" to "pending"
        await Question.updateMany(
            { _id: { $in: questionIds } }, // Only update selected questions
            { $set: { status: "pending" } }
        );

        return new Response(JSON.stringify({ message: "Selected questions updated to pending successfully." }), { status: 200 });
    } catch (error) {
        console.error("Error updating questions:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
