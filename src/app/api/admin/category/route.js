
import connectDB from "../../../lib/db";
import Category from "../../../models/admin/CategoryModel";
import TitleCategory from "../../../models/admin/TitleCategoryModel";

export async function POST(req) {
    try {
        await connectDB();
        const { titleCategory, name } = await req.json();

        // Validate inputs
        if (!titleCategory || !name) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
        }

        // Check if TitleCategory exists
        const titleCategoryExists = await TitleCategory.findById(titleCategory);
        if (!titleCategoryExists) {
            return new Response(JSON.stringify({ message: "TitleCategory not found" }), { status: 404 });
        }

        // Check if Category already exists under this TitleCategory
        const existingCategory = await Category.findOne({ titleCategory, name });
        if (existingCategory) {
            return new Response(JSON.stringify({ message: "Category already exists in this TitleCategory" }), { status: 400 });
        }

        // Create new Category
        const newCategory = new Category({ titleCategory, name });
        await newCategory.save();

        return new Response(JSON.stringify({ message: "Category added successfully", category: newCategory }), { status: 201 });
    } catch (error) {
        console.error("Error adding category:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
}
