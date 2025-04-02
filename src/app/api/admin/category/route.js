

import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Category from "../../../models/admin/CategoryModel";
import Permission from "../../../models/admin/Permission";
import { authenticate } from "../../../lib/auth/auth";
export async function POST(req) {
    try {
        await connectDB();

        // Authenticate and check permissions
        await authenticate(req);
        const { operator } = await authenticate(req);

        // Check update permission
        const permission = await Permission.findById(operator.permissionId);
        if (!permission || !permission.updateCategory) {
            return NextResponse.json({ message: "Forbidden: You don't have permission to update categories" }, { status: 403 });
        }

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
        return new Response(JSON.stringify({ message: error.message }), { status: error.message.includes("Unauthorized") || error.message.includes("Forbidden") ? 403 : 500 });
    }
}