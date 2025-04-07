import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";

// import { authenticate } from "../../../lib/auth";

export async function GET(req) {
    await connectDB();
    // const admin = await authenticate(req);


    // Optional auth check
    // if (!admin) {
    //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // ✅ Correct way to get query params in App Router
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    if (!["draft", "pending", "approved", "rejected"].includes(status)) {
        return NextResponse.json({ message: "Invalid status." }, { status: 400 });
    }

    try {
        const questions = await Question.find({ status });
        return NextResponse.json(questions, { status: 200 });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ message: "Error fetching questions." }, { status: 500 });
    }
}
