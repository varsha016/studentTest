import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";

export async function PUT(req) {
    try {
        await connectDB();
        const {
            id,
            subCategory,
            questionText,
            questionType,
            options,
            correctOptionIndex,
            directAnswer,
            answerExplanation,
        } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: "Question ID is required" }, { status: 400 });
        }

        const question = await Question.findById(id);
        if (!question) {
            return NextResponse.json({ success: false, message: "Question not found" }, { status: 404 });
        }

        // Update fields
        if (subCategory) question.subCategory = subCategory;
        if (questionText) question.questionText = questionText;
        if (questionType) question.questionType = questionType;
        if (answerExplanation) question.answerExplanation = answerExplanation;

        // Update based on question type
        if (questionType === "mcq") {
            if (!options || !Array.isArray(options) || options.length === 0) {
                return NextResponse.json({ success: false, message: "MCQ questions must have valid options" }, { status: 400 });
            }
            if (correctOptionIndex === undefined || correctOptionIndex < 0 || correctOptionIndex >= options.length) {
                return NextResponse.json({ success: false, message: "Invalid correctOptionIndex" }, { status: 400 });
            }
            question.options = options;
            question.correctOptionIndex = correctOptionIndex;
            question.directAnswer = null; // Clear direct answer for MCQ
        } else if (questionType === "direct") {
            if (!directAnswer || directAnswer.trim() === "") {
                return NextResponse.json({ success: false, message: "Direct answer is required for direct questions" }, { status: 400 });
            }
            question.directAnswer = directAnswer;
            question.options = [];
            question.correctOptionIndex = null; // Clear MCQ options for direct questions
        }

        await question.save();
        return NextResponse.json({ success: true, message: "Question updated successfully", data: question }, { status: 200 });
    } catch (error) {
        console.error("🔥 Error updating question:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
