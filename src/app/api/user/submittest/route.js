// import TestAttempt from "../../../models/user/testAttemptModel";
// import Question from "../../../models/admin/QuestionModel";
// import connectDB from "../../../lib/db";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// export async function POST(req) {
//     try {
//         await connectDB();

//         const { testAttemptId, responses } = await req.json();
//         console.log("Received Data:", { testAttemptId, responses });

//         if (!testAttemptId || !responses || !Array.isArray(responses)) {
//             return NextResponse.json({ message: "Invalid test submission data" }, { status: 400 });
//         }

//         if (!mongoose.Types.ObjectId.isValid(testAttemptId)) {
//             return NextResponse.json({ message: "Invalid testAttemptId" }, { status: 400 });
//         }

//         const testAttempt = await TestAttempt.findById(testAttemptId);
//         if (!testAttempt) {
//             console.log("❌ Test Attempt Not Found");
//             return NextResponse.json({ message: "Test attempt not found" }, { status: 404 });
//         }

//         let score = 0;
//         for (let response of responses) {
//             const question = await Question.findById(response.questionId);
//             if (!question) continue;

//             const isCorrect = question.correctAnswer === response.answer;
//             if (isCorrect) score += 1;

//             const existingResponse = testAttempt.responses.find((r) => r.questionId.toString() === response.questionId);
//             if (existingResponse) {
//                 existingResponse.answer = response.answer;
//                 existingResponse.isCorrect = isCorrect;
//             } else {
//                 testAttempt.responses.push({ questionId: response.questionId, answer: response.answer, isCorrect });
//             }
//         }

//         testAttempt.score = score;
//         testAttempt.completedAt = new Date();

//         testAttempt.markModified("responses");
//         await testAttempt.save();

//         console.log("✅ Test submitted successfully:", testAttempt);
//         return NextResponse.json({ message: "Test submitted successfully", score, testAttempt }, { status: 200 });
//     } catch (error) {
//         console.error("🔥 Error in /api/user/submittest:", error);
//         return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
//     }
// }


import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import TestAttempt from "../../../models/user/testAttemptModel";
import Question from "../../../models/admin/QuestionModel";

export async function POST(req) {
    try {
        await connectDB();
        const { userId, sectionId, responses } = await req.json();

        if (!userId || !sectionId || !responses || !Array.isArray(responses)) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        let score = 0;
        const processedResponses = [];

        for (const response of responses) {
            const question = await Question.findById(response.questionId);
            if (!question) continue;

            let isCorrect = false;
            if (question.questionType === "mcq") {
                isCorrect = question.correctOptionIndex === Number(response.answer);
            } else if (question.questionType === "direct") {
                isCorrect = question.directAnswer.trim().toLowerCase() === response.answer.trim().toLowerCase();
            }

            processedResponses.push({
                questionId: question._id,
                // questionText: question.questionText,
                questionText: response.questionText || question.questionText,
                answer: response.answer,
                isCorrect,
            });

            if (isCorrect) score += 1;
        }
        console.log(processedResponses, "processedResponses");

        const testAttempt = await TestAttempt.create({
            userId,
            sectionId,
            responses: processedResponses,
            score,
            completedAt: new Date(),
        });

        return NextResponse.json({ success: true, message: "Test submitted successfully!", data: testAttempt }, { status: 201 });
    } catch (error) {
        console.error("🔥 Error submitting test:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
