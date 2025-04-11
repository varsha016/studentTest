



import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";
import Permission from "../../../models/admin/Permission";
import SubCategory from "../../../models/admin/SubCategoryModel"; // ✅ import this
import { authenticate } from "../../../lib/auth/auth";

export async function POST(req) {
    try {
        await connectDB();

        // Authenticate the user
        const { operator } = await authenticate(req);
        console.log("Authenticated Operator:", operator);

        if (!operator) {
            return NextResponse.json({ message: "Unauthorized: Operator not found" }, { status: 401 });
        }
        console.log("Operator:", operator);

        if (!operator.operators || operator.operators.length === 0) {
            return NextResponse.json({ message: "Unauthorized: No operators found" }, { status: 401 });
        }

        // Find an operator with permission
        const authorizedOperator = await Promise.all(
            operator.operators.map(async (op) => {
                if (!op.permissionId) return null; // Skip if no permissionId
                const permission = await Permission.findById(op.permissionId);
                if (permission?.addQuestion) {
                    return { operator: op, permission };
                }
                return null;
            })
        );

        // Filter valid operators with permission
        const validOperator = authorizedOperator.find((op) => op !== null);

        if (!validOperator) {
            return NextResponse.json({ message: "Forbidden: No operators with permission to add questions" }, { status: 403 });
        }


        const { operator: selectedOperator } = validOperator;

        // Proceed with creating the question
        const {
            subCategory,
            questionText,
            questionType,
            options,
            correctOptionIndex,
            directAnswer,
            answerExplanation,
        } = await req.json();


        if (!subCategory || !questionText || !questionType) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (
            questionType === "mcq" &&
            (!Array.isArray(options) || options.length < 2 || correctOptionIndex === undefined || correctOptionIndex >= options.length)
        ) {
            return NextResponse.json({ message: "Invalid MCQ question data" }, { status: 400 });
        }

        const questionData = {
            subCategory,
            questionText,
            questionType,
            options: questionType === "mcq" ? options : [],
            correctOptionIndex: questionType === "mcq" ? correctOptionIndex : null,
            directAnswer: questionType === "direct" ? directAnswer : "",
            answerExplanation,
            createdBy: selectedOperator._id,
            status: "draft",
        };

        const newQuestion = await Question.create(questionData);
        return NextResponse.json({ message: "Question added successfully", data: newQuestion }, { status: 201 });


    } catch (error) {
        console.error("Error adding question:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}




