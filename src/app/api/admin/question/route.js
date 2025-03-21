

// import { NextResponse } from "next/server";
// import connectDB from "../../../lib/db";
// import Question from "../../../models/admin/QuestionModel";

// export async function POST(req) {
//     try {
//         await connectDB();
//         let { subCategory, questionText, questionType, options, correctOptionIndex, directAnswer } = await req.json();

//         // Validate required fields
//         if (!subCategory || !questionText || !questionType) {
//             return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
//         }

//         // Validate MCQ options & correctOptionIndex
//         if (questionType === "mcq") {
//             if (!options || !Array.isArray(options) || options.length === 0) {
//                 return NextResponse.json({ success: false, message: "MCQ questions must have options" }, { status: 400 });
//             }
//             if (correctOptionIndex === undefined || correctOptionIndex < 0 || correctOptionIndex >= options.length) {
//                 return NextResponse.json({ success: false, message: "Invalid correctOptionIndex" }, { status: 400 });
//             }
//             options = options.map(opt => String(opt).trim()); // Sanitize options
//         }

//         // Validate direct answer
//         if (questionType === "direct" && (!directAnswer || directAnswer.trim() === "")) {
//             return NextResponse.json({ success: false, message: "Direct answer is required" }, { status: 400 });
//         }

//         // Create new question
//         const newQuestion = await Question.create({
//             subCategory,
//             questionText,
//             questionType,
//             options: questionType === "mcq" ? options : [],
//             correctOptionIndex: questionType === "mcq" ? correctOptionIndex : null,
//             directAnswer: questionType === "direct" ? directAnswer : "",
//         });

//         return NextResponse.json({ success: true, message: "Question added successfully!", data: newQuestion }, { status: 201 });
//     } catch (error) {
//         console.error("🔥 Error adding question:", error);
//         return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//     }
// }



import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";

export async function POST(req) {
    try {
        await connectDB();
        let {
            subCategory,
            questionText,
            questionType,
            options,
            correctOptionIndex,
            directAnswer,
            answerExplanation,
        } = await req.json();

        // Validate required fields
        if (!subCategory || !questionText || !questionType) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Validate MCQ options & correctOptionIndex
        if (questionType === "mcq") {
            if (!options || !Array.isArray(options) || options.length === 0) {
                return NextResponse.json({ success: false, message: "MCQ questions must have options" }, { status: 400 });
            }
            if (correctOptionIndex === undefined || correctOptionIndex < 0 || correctOptionIndex >= options.length) {
                return NextResponse.json({ success: false, message: "Invalid correctOptionIndex" }, { status: 400 });
            }
            options = options.map(opt => String(opt).trim()); // Sanitize options
        }

        // Validate direct answer
        if (questionType === "direct" && (!directAnswer || directAnswer.trim() === "")) {
            return NextResponse.json({ success: false, message: "Direct answer is required" }, { status: 400 });
        }

        // Validate answer explanation
        if (!answerExplanation || answerExplanation.trim() === "") {
            return NextResponse.json({ success: false, message: "Answer explanation is required" }, { status: 400 });
        }

        // Create new question
        const newQuestion = await Question.create({
            subCategory,
            questionText,
            questionType,
            options: questionType === "mcq" ? options : [],
            correctOptionIndex: questionType === "mcq" ? correctOptionIndex : null,
            directAnswer: questionType === "direct" ? directAnswer : "",
            answerExplanation,
        });

        return NextResponse.json({ success: true, message: "Question added successfully!", data: newQuestion }, { status: 201 });
    } catch (error) {
        console.error("🔥 Error adding question:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
