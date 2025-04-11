// import connectDB from "../../../lib/db";
// import Questions from "../../../models/admin/QuestionModel";

// export async function POST(req) {
//     try {
//         await connectDB();
//         const { subcategoryIds } = await req.json();

//         const questions = await Questions.find({
//             subcategoryId: { $in: subcategoryIds },
//         });

//         return new Response(JSON.stringify(questions), { status: 200 });
//     } catch (error) {
//         return new Response(JSON.stringify({ message: "Error", error }), {
//             status: 500,
//         });
//     }
// }





import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Question from '../../../models/admin/QuestionModel';
import mongoose from 'mongoose';



export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const { subcategoryIds } = body;

        if (!subcategoryIds || subcategoryIds.length === 0) {
            return new Response(JSON.stringify([]), { status: 200 });
        }

        const objectIds = subcategoryIds.map(id => new mongoose.Types.ObjectId(id));

        const questions = await Question.find({
            subCategory: { $in: objectIds }
        });

        return new Response(JSON.stringify(questions), { status: 200 });
    } catch (error) {
        console.error('Error in getQuestionsBySubcategories:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
