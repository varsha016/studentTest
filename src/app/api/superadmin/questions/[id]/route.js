import { NextResponse } from 'next/server';
import Question from "../../../../models/admin/QuestionModel";
import connectDB from "../../../../lib/db";

// Approve a Question - PATCH Request
export async function PATCH(req, { params }) {
    await connectDB();
    const { id } = params;

    try {
        const question = await Question.findByIdAndUpdate(
            id,
            { status: "approved" },
            { new: true }
        );

        if (!question) {
            return new Response(JSON.stringify({ message: "Question not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Question approved successfully", question }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// Reject a Question - DELETE Request
export async function DELETE(req, { params }) {
    await dbConnect();
    const { id } = params;
    const { rejectionReason } = await req.json();

    if (!rejectionReason) {
        return new Response(JSON.stringify({ message: "Rejection reason is required" }), { status: 400 });
    }

    try {
        const question = await Question.findByIdAndUpdate(
            id,
            { status: "rejected", rejectionReason },
            { new: true }
        );

        if (!question) {
            return new Response(JSON.stringify({ message: "Question not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Question rejected successfully", question }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
