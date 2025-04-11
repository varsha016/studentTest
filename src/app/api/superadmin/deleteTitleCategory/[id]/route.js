// /pages/api/admin/deleteTitleCategory/[id].js
// import authenticate from '../../../../lib/auth/auth';
// import { authenticate } from "../../../../../lib/auth/auth";

import { authenticate } from '../../../../lib/auth/auth';
import dbConnect from '../../../../lib/db';
import TitleCategory from '../../../../models/admin//TitleCategoryModel';


export async function DELETE(req, { params }) {
    await dbConnect();

    try {
        await authenticate(req); // validate auth token

        const { id } = await params;

        if (!id) {
            return new Response(JSON.stringify({ error: "ID is required" }), {
                status: 400,
            });
        }

        const deleted = await TitleCategory.findByIdAndDelete(id);

        if (!deleted) {
            return new Response(JSON.stringify({ error: "Title Category not found" }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify({ message: "Title Category deleted successfully" }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error deleting title category:", error);
        return new Response(JSON.stringify({ error: "Failed to delete title category" }), {
            status: 500,
        });
    }
}

