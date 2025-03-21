import connectDB from "../../../lib/db";
// import SubCategory from "../../../models/admin/SubCategoryModel";
import { NextResponse } from "next/server";
import Category from "../../../models/admin/CategoryModel"; // Import Category model first
import SubCategory from "../../../models/admin/SubCategoryModel";



export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("id");
        let subcategories;

        if (categoryId) {
            // Fetch subcategories for a specific category
            subcategories = await SubCategory.find({ category: categoryId }).populate("category");
        } else {
            // Fetch all subcategories if no categoryId is provided
            subcategories = await SubCategory.find().populate("category");
        }

        // if (!categoryId) {
        //     return NextResponse.json({ message: "Category ID is required" }, { status: 400 });
        // }

        // const subcategories = await SubCategory.find({ category: categoryId });

        return NextResponse.json(subcategories, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}









