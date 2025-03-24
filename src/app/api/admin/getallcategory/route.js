

import connectDB from "../../../lib/db";
import Category from "../../../models/admin/CategoryModel";
import TitleCategory from "../../../models/admin/TitleCategoryModel";

export async function GET(req) {
    try {
        await connectDB(); // Connect to MongoDB

        const url = new URL(req.url);
        const titleCategory = url.searchParams.get("titleCategory");

        let categories;

        if (titleCategory) {
            categories = await Category.find({ titleCategory }).populate("titleCategory", "title");
        } else {
            categories = await Category.find().populate("titleCategory", "title");
        }

        return new Response(JSON.stringify({ categories }), { status: 200 });
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
}
