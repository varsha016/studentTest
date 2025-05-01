import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";
import { authenticate } from "../../../lib/auth/auth";

export async function GET(req) {
    await connectDB();
    // const operator = await authenticate(req);

    // Optional auth check
    // if (!operator) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let filter = {};


    // If status is provided, validate and add to filter
    if (status) {
        if (!["draft", "pending", "approved", "rejected"].includes(status)) {
            return NextResponse.json({ message: "Invalid status." }, { status: 400 });
        }
        filter.status = status;
    }

    try {
        const questions = await Question.find(filter).populate("createdBy", "name");
        return NextResponse.json(questions, { status: 200 });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ message: "Error fetching questions." }, { status: 500 });
    }
}




// export const getQuestionsByStatus = async (req, res) => {
//     try {
//         const { status } = req.query; // e.g., /api/questions?status=approved

//         if (!["draft", "pending", "approved", "rejected"].includes(status)) {
//             return res.status(400).json({ message: "Invalid status provided." });
//         }

//         const questions = await Question.find({ status })
//             .populate("subCategory")
//             .populate("createdBy", "name")
//             .populate("updatedBy", "name")
//             .populate("approvedBy", "name");

//         res.status(200).json(questions);
//     } catch (err) {
//         console.error("Error fetching questions:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };


// export async function GET(req) {
//     try {
//         await connectDB();

//         const { searchParams } = new URL(req.url);
//         const createdBy = searchParams.get("createdBy");

//         const filter = createdBy ? { createdBy } : {};
//         const questions = await Question.find(filter)
//             .populate("subCategory")
//             .populate("createdBy")
//             .populate("updatedBy");

//         return NextResponse.json({ success: true, data: questions }, { status: 200 });
//     } catch (error) {
//         console.error("🔥 Error fetching questions:", error);
//         return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//     }
// }
