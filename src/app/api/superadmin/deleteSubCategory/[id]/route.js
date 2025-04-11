// /pages/api/admin/deleteSubCategory/[id].js

import dbConnect from '../../../../lib/db';
import SubCategory from '../../../../models/admin/SubCategoryModel';

import { authenticate } from "../../../../lib/auth/auth";


export async function DELETE(req, { params }) {
    await dbConnect();

    try {
        await authenticate(req); // validate auth token

        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({ error: "ID is required" }), {
                status: 400,
            });
        }

        const deleted = await SubCategory.findByIdAndDelete(id);

        if (!deleted) {
            return new Response(JSON.stringify({ error: "SubCategory not found" }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify({ message: "SubCategory deleted successfully" }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error deleting SubCategory:", error);
        return new Response(JSON.stringify({ error: "Failed to delete SubCategory" }), {
            status: 500,
        });
    }
}

