import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Question from "../../../../models/admin/QuestionModel";
import { authenticate } from "../../../../lib/auth/auth";

// GET /api/superadmin/get-question/:id
export async function GET(req, { params }) {
    await connectDB();

    const admin = await authenticate(req);
    if (!admin) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    try {
        const question = await Question.findById(id);
        if (!question) {
            return NextResponse.json({ message: "Question not found" }, { status: 404 });
        }

        return NextResponse.json(question, { status: 200 });
    } catch (error) {
        console.error("Error fetching question:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
