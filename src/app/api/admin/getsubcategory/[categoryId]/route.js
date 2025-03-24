


import connectDB from "../../../../lib/db";
import SubCategory from "../../../../models/admin/SubCategoryModel";

export async function GET(req, { params }) {
    try {
        await connectDB();

        // Extract categoryId from the dynamic route
        const { categoryId } = params;

        // Find subcategories matching the categoryId with category details
        const subCategories = await SubCategory.find({ category: categoryId })
            .populate({
                path: "category",
                select: "name titleCategory",
                populate: { path: "titleCategory", select: "name" } // If titleCategory is another reference
            });

        return new Response(JSON.stringify({ subCategories }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            message: "Internal Server Error",
            error: error.message
        }), { status: 500 });
    }
}
