
import { NextResponse } from 'next/server';
import Operator from '../../../models/admin/OperatorModel';
import Permission from '../../../models/admin/Permission';
import connectDB from "../../../lib/db";

export async function PUT(req) {
    console.log(req, 'req');

    await connectDB();
    const { operatorId, name, email, password, permissions } = await req.json();
    console.log(operatorId, name, email, password, permissions, "operatorId");

    try {
        const operator = await Operator.findById(operatorId);
        if (!operator) return NextResponse.json({ message: 'Operator not found' }, { status: 404 });

        if (name) operator.name = name;
        if (email) operator.email = email;
        if (password) operator.password = password; // (Optionally hash here if needed)

        await Permission.findOneAndUpdate({ operatorId }, permissions);
        await operator.save();

        return NextResponse.json({ message: 'Operator updated successfully' });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// export async function PUT(req) {
//     console.log(req, 'req');

//     await connectDB();
//     const { operatorId, name, email, password, permissions } = await req.json();
//     console.log(operatorId, name, email, password, permissions, "operatorId");

//     try {
//         const admin = await Admin.findOne({ 'operators._id': operatorId });
//         if (!admin) return NextResponse.json({ message: 'Operator not found' }, { status: 404 });

//         const operator = admin.operators.id(operatorId);
//         if (name) operator.name = name;
//         if (email) operator.email = email;
//         if (password) operator.password = password;

//         await Permission.findOneAndUpdate({ operatorId }, permissions);
//         await admin.save();

//         return NextResponse.json({ message: 'Operator updated successfully' });
//     } catch (error) {
//         return NextResponse.json({ message: error.message }, { status: 500 });
//     }
// }


