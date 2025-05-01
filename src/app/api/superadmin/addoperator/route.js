


import bcrypt from 'bcryptjs';
import Operator from '../../../models/admin/OperatorModel';
import Permission from '../../../models/admin/Permission';
import connectDB from "../../../lib/db";


export async function POST(req) {
    await connectDB();

    const {
        name,
        lastName,
        contactNumber,
        email,
        password,
        permissions,
    } = await req.json();

    try {
        // ❌ No Admin model now, find Operator directly
        const existingOperator = await Operator.findOne({ email });
        if (existingOperator) {
            return Response.json(
                { message: 'Operator with this email already exists' },
                { status: 400 }
            );
        }

        // ➕ Create new operator (no bcrypt)
        const newOperator = new Operator({
            name,
            lastName: lastName || 'N/A',
            contactNumber: contactNumber || 'N/A',
            email,
            password, // Direct password without hashing
        });

        await newOperator.save();

        // 🛡️ Create permission
        const newPermission = new Permission({ operatorId: newOperator._id, ...permissions });
        await newPermission.save();

        // 🔗 Link permissionId to operator
        newOperator.permissionId = newPermission._id;
        await newOperator.save();

        return Response.json(
            { message: 'Operator added successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding operator:", error);
        return Response.json(
            { message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}

// export async function POST(req) {
//     await connectDB();

//     const {
//         name,
//         lastName,
//         contactNumber,
//         email,
//         password,
//         permissions,
//     } = await req.json();

//     try {
//         const existingAdmin = await Admin.findOne({});
//         if (!existingAdmin) {
//             return Response.json({ message: 'Admin not found' }, { status: 404 });
//         }

//         // ✅ Clean up old operators if they are missing required fields
//         existingAdmin.operators = existingAdmin.operators.map((op) => ({
//             ...op.toObject?.() || op,
//             lastName: op.lastName || 'N/A',
//             contactNumber: op.contactNumber || 'N/A',
//         }));

//         // ❌ Prevent duplicate email
//         const existingOperator = existingAdmin.operators.find(op => op.email === email);
//         if (existingOperator) {
//             return Response.json(
//                 { message: 'Operator with this email already exists' },
//                 { status: 400 }
//             );
//         }

//         // 🔐 Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // ➕ New operator
//         const newOperator = {
//             name,
//             lastName: lastName || 'N/A',
//             contactNumber: contactNumber || 'N/A',
//             email,
//             password: hashedPassword,
//         };

//         // 📌 Add operator and save
//         existingAdmin.operators.push(newOperator);
//         await existingAdmin.save();

//         // 🔍 Get the new operator's ID
//         const operatorId = existingAdmin.operators.at(-1)._id;

//         // 🛡️ Create permission
//         const newPermission = new Permission({ operatorId, ...permissions });
//         await newPermission.save();

//         // 🔗 Link permissionId to operator
//         const operatorToUpdate = existingAdmin.operators.id(operatorId);
//         if (operatorToUpdate) {
//             operatorToUpdate.permissionId = newPermission._id;
//         }

//         await existingAdmin.save();

//         return Response.json(
//             { message: 'Operator added successfully' },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.error("Error adding operator:", error);
//         return Response.json(
//             { message: 'Server error', error: error.message },
//             { status: 500 }
//         );
//     }
// }
