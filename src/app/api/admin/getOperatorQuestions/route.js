
import { authenticate } from "../../../lib/auth/auth";
import { NextResponse } from "next/server";
import Question from "../../../models/admin/QuestionModel";
import connectDB from "../../../lib/db";

export async function GET(req) {
    try {
        await connectDB();

        // Fetch all questions that belong to the operator (if needed, filter by user)
        const questions = await Question.find({});

        return new Response(JSON.stringify({ questions }), { status: 200 });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
