import Admin from '../../../models/admin/adminModel';
import Permission from '../../../models/admin/Permission';

import connectDB from "../../../lib/db";


export async function DELETE(req) {
    await connectDB();
    const { operatorId } = await req.json();

    try {
        const admin = await Admin.findOneAndUpdate(
            {},
            { $pull: { operators: { _id: operatorId } } },
            { new: true }
        );

        if (!admin) return Response.json({ message: 'Operator not found' }, { status: 404 });

        await Permission.findOneAndDelete({ operatorId });
        return Response.json({ message: 'Operator deleted successfully' });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
