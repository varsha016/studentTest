

import Operator from '../../../models/admin/OperatorModel';
import connectDB from "../../../lib/db";
import { NextResponse } from 'next/server';
import Permission from "../../../models/admin/Permission";

export async function GET() {
    await connectDB();

    try {
        // Directly find all operators and populate permissionId
        const operators = await Operator.find({}).populate('permissionId');

        if (!operators) {
            return NextResponse.json({ message: 'No operators found' }, { status: 404 });
        }

        return NextResponse.json(operators, { status: 200 });
    } catch (error) {
        console.error("Error fetching operators:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// export async function GET() {
//     await connectDB();

//     try {
//         const admin = await Admin.findOne({}).populate('operators.permissionId');
//         if (!admin) {
//             return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
//         }

//         return NextResponse.json(admin.operators, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ message: error.message }, { status: 500 });
//     }
// }
