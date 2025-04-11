// /pages/api/admin/deleteCategory/[id].js

// import { authenticate } from "../../../../lib/auth/auth";
// import dbConnect from '../../../../lib/db';
// import Category from '../../../../models/admin/CategoryModel';
// export default async function handler(req, res) {
//     await dbConnect();

//     await authenticate(req);
//     const { id } = req.query;
//     if (req.method === 'DELETE') {
//         try {
//             await Category.findByIdAndDelete(id);
//             res.status(200).json({ message: 'Category deleted successfully' });
//         } catch (error) {
//             res.status(500).json({ error: 'Failed to delete Category' });
//         }
//     } else {
//         res.status(405).end();
//     }
// }


// File: /app/api/admin/deleteCategory/[id]/route.js

import { authenticate } from "../../../../lib/auth/auth";
import dbConnect from '../../../../lib/db';
import Category from '../../../../models/admin/CategoryModel';

export async function DELETE(req, { params }) {
    await dbConnect();

    try {
        await authenticate(req); // token check

        const { id } = await params;

        if (!id) {
            return new Response(JSON.stringify({ error: "Category ID is required" }), {
                status: 400,
            });
        }

        const deleted = await Category.findByIdAndDelete(id);

        if (!deleted) {
            return new Response(JSON.stringify({ error: "Category not found" }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify({ message: "Category deleted successfully" }), {
            status: 200,
        });
    } catch (error) {
        console.error("Delete error:", error);
        return new Response(JSON.stringify({ error: "Failed to delete category" }), {
            status: 500,
        });
    }
}
