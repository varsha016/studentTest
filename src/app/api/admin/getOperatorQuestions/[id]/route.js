


import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Question from "../../../../models/admin/QuestionModel";
import Operator from "../../../../models/admin/OperatorModel";
import { authenticate } from "../../../../lib/auth/auth";
import mongoose from "mongoose";
export async function GET(req, { params }) {
    try {
        await connectDB();

        // Directly access params.id without awaiting it
        const operatorId = params.id;
        console.log("Operator ID:", operatorId);

        if (!operatorId) {
            return NextResponse.json({ message: "Operator ID is required" }, { status: 400 });
        }

        // Find the operator directly in the Operator model
        const operator = await Operator.findById(operatorId);

        console.log('Operator:', operator);

        if (!operator) {
            return NextResponse.json({ message: "Operator not found" }, { status: 404 });
        }

        // Fetch questions created by this operator
        const questions = await Question.find({
            createdBy: new mongoose.Types.ObjectId(operatorId),
        });

        console.log('Fetched Questions:', questions);

        if (questions.length === 0) {
            return NextResponse.json({ message: "No questions found for this operator" }, { status: 404 });
        }

        return NextResponse.json({ questions }, { status: 200 });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}



// export async function GET(req, { params }) {
//     try {
//         await connectDB();

//         // Authenticate the operator
//         const operator = await authenticate(req);

//         // Extract the operatorId from params
//         const { id: operatorId } = await params;
//         console.log("Operator ID:", operatorId);

//         if (!operatorId) {
//             return NextResponse.json({ message: "Operator ID is required" }, { status: 400 });
//         }

//         // Check if the operator exists in the Admin collection's operators array
//         const admin = await Admin.findOne({
//             "operators._id": new mongoose.Types.ObjectId(operatorId),  // Check operatorId inside the operators array
//         });

//         console.log('Admin Document:', admin); // Log the admin document

//         if (!admin) {
//             return NextResponse.json({ message: "Operator not found" }, { status: 404 });
//         }

//         // Fetch questions created by this operator (filtering by createdBy field)
//         const questions = await Question.find({
//             createdBy: new mongoose.Types.ObjectId(operatorId),
//             // status: "draft", // Optionally filter by status if needed
//         });

//         console.log('Fetched Questions:', questions); // Log fetched questions

//         if (questions.length === 0) {
//             return NextResponse.json({ message: "No questions found for this operator" }, { status: 404 });
//         }

//         return NextResponse.json({ questions }, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching questions:", error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }
