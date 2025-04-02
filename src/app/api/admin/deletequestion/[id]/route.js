

import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Question from "../../../../models/admin/QuestionModel";

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ success: false, message: "Missing question ID" }, { status: 400 });
        }

        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return NextResponse.json({ success: false, message: "Question not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Question deleted successfully!" });
    } catch (error) {
        console.error("🔥 Error deleting question:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
