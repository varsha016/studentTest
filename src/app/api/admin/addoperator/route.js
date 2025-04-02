import Admin from '../../../models/admin/adminModel';
import Permission from '../../../models/admin/Permission';

import connectDB from "../../../lib/db";



export async function POST(req) {
    await connectDB();
    const { name, email, password, permissions } = await req.json();

    try {
        const existingAdmin = await Admin.findOne({});
        if (!existingAdmin) {
            return Response.json({ message: 'Admin not found' }, { status: 404 });
        }

        // Create Operator first without operatorId in Permission
        const newOperator = { name, email, password };
        existingAdmin.operators.push(newOperator);
        await existingAdmin.save();

        const operatorId = existingAdmin.operators.slice(-1)[0]._id;

        // Create Permission and link it with operatorId
        const newPermission = new Permission({ operatorId, ...permissions });
        await newPermission.save();

        // Update operator with permissionId
        existingAdmin.operators[existingAdmin.operators.length - 1].permissionId = newPermission._id;
        await existingAdmin.save();

        return Response.json({ message: 'Operator added successfully' }, { status: 201 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}


// export async function POST(req) {
//     await connectDB();
//     const { name, email, password, permissions } = await req.json();

//     try {
//         const existingAdmin = await Admin.findOne({});
//         if (!existingAdmin) return Response.json({ message: 'Admin not found' }, { status: 404 });

//         const newPermission = new Permission({ operatorId: null, ...permissions });
//         await newPermission.save();

//         const newOperator = { name, email, password, permissionId: newPermission._id };
//         existingAdmin.operators.push(newOperator);
//         await existingAdmin.save();

//         newPermission.operatorId = existingAdmin.operators.slice(-1)[0]._id;
//         await newPermission.save();

//         return Response.json({ message: 'Operator added successfully' }, { status: 201 });
//     } catch (error) {
//         return Response.json({ message: error.message }, { status: 500 });
//     }
// }