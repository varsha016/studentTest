import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Question from "../../../../models/admin/QuestionModel";




export async function PUT(req, { params }) {
    try {
        await connectDB();

        const { id } = params; // ✅ Fix parameter extraction
        const { status, rejectionReason } = await req.json();

        if (!id || !["approved", "rejected"].includes(status)) {
            return NextResponse.json({ success: false, message: "Invalid input data" }, { status: 400 });
        }

        const question = await Question.findById(id);

        if (!question) {
            return NextResponse.json({ success: false, message: "Question not found" }, { status: 404 });
        }

        question.status = status;
        question.rejectionReason = status === "rejected" ? rejectionReason : null;

        await question.save();

        return NextResponse.json({ success: true, message: `Question ${status} successfully!` }, { status: 200 });
    } catch (error) {
        console.error("🔥 Error updating question status:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
