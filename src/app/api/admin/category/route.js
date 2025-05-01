

import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import TitleCategory from "../../../models/admin/TitleCategoryModel";
import Category from "../../../models/admin/CategoryModel";
import Permission from "../../../models/admin/Permission";
import { authenticate } from "../../../lib/auth/auth";
export async function POST(req) {
    try {
        await connectDB();

        const { titleCategory, name } = await req.json();
        const { operator } = await authenticate(req);
        console.log(operator._id, 'operator ID');

        // ✅ Check permission
        const permission = await Permission.findById(operator.permissionId);
        if (!permission || !permission.updateCategory) {
            return NextResponse.json({ message: "Forbidden: You don't have permission to update categories" }, { status: 403 });
        }

        // ✅ Validate
        if (!titleCategory || !name) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
        }

        // ✅ Check if TitleCategory exists
        const titleCategoryExists = await TitleCategory.findById(titleCategory);
        if (!titleCategoryExists) {
            return new Response(JSON.stringify({ message: "TitleCategory not found" }), { status: 404 });
        }

        // ✅ Check if Category already exists
        const existingCategory = await Category.findOne({ titleCategory, name });
        if (existingCategory) {
            return new Response(JSON.stringify({ message: "Category already exists in this TitleCategory" }), { status: 400 });
        }

        // ✅ ➡️ Create new Category and assign `createdBy`
        const newCategory = new Category({
            titleCategory,
            name,
            createdBy: operator._id, // 👉 THIS LINE IS IMPORTANT
        });

        await newCategory.save();

        return new Response(JSON.stringify({ message: "Category added successfully", category: newCategory }), { status: 201 });


        return new Response(JSON.stringify({ message: "Category added successfully", category: newCategory }), { status: 201 });
    } catch (error) {
        console.error("Error adding category:", error);
        return new Response(JSON.stringify({ message: error.message }), { status: error.message.includes("Unauthorized") || error.message.includes("Forbidden") ? 403 : 500 });
    }
}