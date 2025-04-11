import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import SubCategory from "../../../models/admin/SubCategoryModel";

export async function POST(req) {
  try {
    await connectDB();
    const { category, name } = await req.json();

    // Validate input
    if (!category || !name) {
      return NextResponse.json(
        { message: "Category and name are required" },
        { status: 400 }
      );
    }

    // Check if subcategory already exists
    const existingSubcategory = await SubCategory.findOne({ name, category });
    if (existingSubcategory) {
      return NextResponse.json(
        { message: "Subcategory already exists" },
        { status: 409 }
      );
    }

    const newSubcategory = new SubCategory({ category, name });
    await newSubcategory.save();

    return NextResponse.json(
      { message: "Subcategory created successfully", data: newSubcategory },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
