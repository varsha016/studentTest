

import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import SubCategory from "../../../models/admin/SubCategoryModel";

export async function POST(req) {
    try {
        await connectDB();
        const { category, name } = await req.json();

        if (!category || !name) {
            return NextResponse.json({ message: "Category and name are required" }, { status: 400 });
        }

        // Check if subcategory already exists
        const existingSubCategory = await SubCategory.findOne({ category, name });
        if (existingSubCategory) {
            return NextResponse.json({ message: "Subcategory already exists" }, { status: 400 });
        }

        const newSubCategory = await SubCategory.create({ category, name });

        return NextResponse.json({
            message: "Subcategory added successfully",
            data: newSubCategory
        }, { status: 201 });

    } catch (error) {
        console.error("🚨 Error adding subcategory:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
