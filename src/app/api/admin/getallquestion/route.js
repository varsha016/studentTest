


import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const createdBy = searchParams.get("createdBy");

        const filter = createdBy ? { createdBy } : {};
        const questions = await Question.find(filter)
            .populate("subCategory")
            .populate("createdBy")
            .populate("updatedBy");

        return NextResponse.json({ success: true, data: questions }, { status: 200 });
    } catch (error) {
        console.error("🔥 Error fetching questions:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
