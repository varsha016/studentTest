
import { NextResponse } from 'next/server';
import Question from "../../../models/admin/QuestionModel";
import connectDB from "../../../lib/db";




connectDB();

export async function PUT(req) {
    try {
        const { questionIds } = await req.json();

        if (!Array.isArray(questionIds) || questionIds.length === 0) {
            return NextResponse.json({ message: "Invalid question IDs" }, { status: 400 });
        }

        await Question.updateMany(
            { _id: { $in: questionIds } },
            { status: "approved" }
        );

        return NextResponse.json({ message: "Questions approved successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

