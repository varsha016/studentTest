import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";
connectDB();

export async function GET() {
    try {
        const approvedQuestions = await Question.find({ status: "approved" });

        return NextResponse.json({ questions: approvedQuestions }, { status: 200 });
    } catch (error) {
        console.error("Error fetching approved questions:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}