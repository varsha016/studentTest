import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import TestAttempt from "../../../models/user/testAttemptModel";
import Question from "../../../models/admin/QuestionModel";
import Section from "../../../models/admin/sectionModel";


// import { NextResponse } from "next/server";
// import connectDB from "../../../lib/db";
// import TestAttempt from "../../../models/user/testAttemptModel";
import mongoose from "mongoose";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ success: false, message: "Invalid or missing User ID" }, { status: 400 });
        }

        const attempts = await TestAttempt.find({ userId })
            .populate("responses.questionId", "questionText")
            .populate("sectionId", "name");

        return NextResponse.json({ success: true, data: attempts }, { status: 200 });
    } catch (error) {
        console.error("🔥 Error fetching results:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}


// export async function GET(req) {
//     try {
//         await connectDB();
//         const { searchParams } = new URL(req.url);
//         const userId = searchParams.get("userId");

//         if (!userId) {
//             return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
//         }

//         const attempts = await TestAttempt.find({ userId })
//             .populate("responses.questionId", "questionText")
//             .populate("sectionId", "name");

//         return NextResponse.json({ success: true, data: attempts }, { status: 200 });
//     } catch (error) {
//         console.error("🔥 Error fetching results:", error);
//         return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//     }
// }
