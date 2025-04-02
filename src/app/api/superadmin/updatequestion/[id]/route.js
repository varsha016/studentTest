import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";

export async function PUT(req, { params }) {
    await connectDB();

    try {
        const { id } = params;
        const updateData = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: "Question ID is required." }, { status: 400 });
        }

        const question = await Question.findById(id);

        if (!question) {
            return NextResponse.json({ success: false, message: "Question not found." }, { status: 404 });
        }

        // Update question with provided fields
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] !== undefined) {
                question[key] = updateData[key];
            }
        });

        question.updatedAt = new Date();
        await question.save();

        return NextResponse.json({ success: true, message: "Question updated successfully.", question }, { status: 200 });
    } catch (error) {
        console.error("Error updating question:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
