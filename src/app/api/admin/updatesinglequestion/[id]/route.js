

import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Question from "../../../../models/admin/QuestionModel";

export async function PUT(req) {
    await connectDB();

    try {
        const { _id, ...updateData } = await req.json(); // Corrected destructuring
        console.log(updateData);
        console.log(_id);



        if (!_id) {
            return NextResponse.json({ success: false, message: "Question ID is required." }, { status: 400 });
        }

        const question = await Question.findById(_id);

        if (!question) {
            return NextResponse.json({ success: false, message: "Question not found." }, { status: 404 });
        }

        // Update the question fields dynamically
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
        return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
    }
}

// export async function PUT(req) {
//     await connectDB();

//     try {
//         const { id, ...updateData } = await req.json();
// console.log(updateData);

//         if (!id) {
//             return NextResponse.json({ success: false, message: "Question ID is required." }, { status: 400 });
//         }

//         const question = await Question.findById(id);

//         if (!question) {
//             return NextResponse.json({ success: false, message: "Question not found." }, { status: 404 });
//         }

//         // Update the question with provided fields
//         Object.keys(updateData).forEach((key) => {
//             if (updateData[key] !== undefined) {
//                 question[key] = updateData[key];
//             }
//         });

//         question.updatedAt = new Date();

//         await question.save();

//         return NextResponse.json({ success: true, message: "Question updated successfully.", question }, { status: 200 });
//     } catch (error) {
//         console.error("Error updating question:", error);
//         return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
//     }
// }
