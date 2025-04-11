

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "../../../../lib/db";
import Question from "../../../../models/admin/QuestionModel";


import { authenticate } from "../../../../lib/auth/auth"; // ✅ Make sure this path is correct








export async function PUT(req, { params }) {
    try {
        await connectDB();

        const operator = await authenticate(req);
        if (!operator) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const updatedData = await req.json();

        const existingQuestion = await Question.findById(id);

        if (!existingQuestion) {
            return NextResponse.json({
                success: false,
                message: "Question not found."
            }, { status: 404 });
        }

        // Optional: enforce status logic if needed
        if (existingQuestion.status !== "draft") {
            return NextResponse.json({
                success: false,
                message: "Only draft questions can be updated."
            }, { status: 403 });
        }

        // ✅ Now update full question data
        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: "Question updated successfully.",
            question: updatedQuestion
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating question:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error"
        }, { status: 500 });
    }
}



// export async function PUT(req, { params }) {
//     try {
//         await connectDB();

//         // const { id } = context.params; // ✅ Correct way in App Router
//         const { id } = await params;
//         const { status } = await req.json();

//         if (status !== "Draft") {
//             return new Response(JSON.stringify({
//                 success: false,
//                 message: "You can only update status to 'Draft'."
//             }), { status: 403 });
//         }

//         const updatedQuestion = await Question.findByIdAndUpdate(
//             id,
//             { status: "Draft" },
//             { new: true }
//         );

//         if (!updatedQuestion) {
//             return new Response(JSON.stringify({
//                 success: false,
//                 message: "Question not found."
//             }), { status: 404 });
//         }

//         return new Response(JSON.stringify({
//             success: true,
//             message: "Question updated to Draft.",
//             question: updatedQuestion
//         }), { status: 200 });

//     } catch (error) {
//         console.error("Error updating question:", error);
//         return new Response(JSON.stringify({
//             success: false,
//             message: "Internal Server Error"
//         }), { status: 500 });
//     }
// }




