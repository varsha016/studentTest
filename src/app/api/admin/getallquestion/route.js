

import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";

export async function GET() {
    try {
        await connectDB();

        // Fetch all questions from the database
        const questions = await Question.find({});

        return NextResponse.json({ success: true, data: questions }, { status: 200 });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch questions" }, { status: 500 });
    }
}


// import { NextResponse } from "next/server";
// import connectDB from "../../../lib/db";
// import Question from "../../../models/admin/QuestionModel";

// export async function GET() {
//     try {
//         await connectDB();

//         // Fetch all questions and populate subcategory details
//         const questions = await Question.find({})
//             .populate("subCategory", "name") // Only fetch subcategory name
//             .select("-__v"); // Exclude version field

//         return NextResponse.json({ success: true, data: questions }, { status: 200 });
//     } catch (error) {
//         console.error("🔥 Error fetching questions:", error);
//         return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//     }
// }
