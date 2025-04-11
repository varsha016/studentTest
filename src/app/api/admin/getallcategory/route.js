import connectDB from "../../../lib/db";
import Category from "../../../models/admin/CategoryModel";
import TitleCategory from "../../../models/admin/TitleCategoryModel";
import { NextResponse } from "next/server";

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

        // Ensure we return a proper array
        return NextResponse.json({
            success: true,
            data: Array.isArray(categories) ? categories : []
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message
        }, { status: 500 });
    }
}
