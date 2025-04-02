

import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";
import Permission from "../../../models/admin/Permission";
import { authenticate } from "../../../lib/auth/auth";






export async function GET(req) {
    try {
        await connectDB();

        console.log("🚀 API HIT: /api/admin/questionstatus");

        const { operator, role } = await authenticate(req);  // 🔥 Destructure role

        console.log("✅ Authenticated Operator:", operator);
        console.log("✅ Operator Role:", role);

        if (role !== "admin") {  // 🔥 Now `role` is properly checked
            console.error("❌ Unauthorized: User is not an admin");
            return NextResponse.json({ message: "Unauthorized: Only admins can view pending questions" }, { status: 403 });
        }

        const status = req.nextUrl.searchParams.get("status");
        console.log(status, 'ssssssssssss');

        if (!status) {
            return NextResponse.json({ message: "Status is required" }, { status: 400 });
        }

        const validStatuses = ["pending", "approved", "rejected"];
        console.log("Valid Statuses:", validStatuses);

        if (!validStatuses.includes(status)) {
            return NextResponse.json({ message: "Invalid status" }, { status: 400 });
        }

        const questions = await Question.find({ status });

        if (!questions.length) {
            return NextResponse.json({ message: "No questions found" }, { status: 404 });
        }

        return NextResponse.json({ questions }, { status: 200 });

    } catch (error) {
        console.error("❌ Server Error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}



