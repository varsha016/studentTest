


import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Question from "../../../../models/admin/QuestionModel";
import { authenticate } from "../../../../lib/auth/auth";
import mongoose from "mongoose";

export async function GET(req, context) {
    try {
        await connectDB();
        const operator = await authenticate(req);

        // const { id: operatorId } = context.params; // ✅ no `await` needed
        const { id: operatorId } = await context.params;


        console.log("Operator ID:", operatorId);

        if (!operatorId) {
            return NextResponse.json({ message: "Operator ID is required" }, { status: 400 });
        }

        const questions = await Question.find({
            createdBy: new mongoose.Types.ObjectId(operatorId),
            // status: "draft", // ✅ filter only draft questions
        });

        return NextResponse.json({ questions }, { status: 200 });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}