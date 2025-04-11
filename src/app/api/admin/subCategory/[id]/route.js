import connectDB from "../../../../lib/db";
import SubCategory from "../../../../models/admin/SubCategoryModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    const subcategory = await SubCategory.findById(id).populate("category");
    
    if (!subcategory) {
      return NextResponse.json(
        { message: "Subcategory not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(subcategory, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { category, name } = await req.json();

    // Validate input
    if (!category || !name) {
      return NextResponse.json(
        { message: "Category and name are required" },
        { status: 400 }
      );
    }

    const updatedSubcategory = await SubCategory.findByIdAndUpdate(
      id,
      { category, name },
      { new: true }
    );

    if (!updatedSubcategory) {
      return NextResponse.json(
        { message: "Subcategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSubcategory, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedSubcategory = await SubCategory.findByIdAndDelete(id);

    if (!deletedSubcategory) {
      return NextResponse.json(
        { message: "Subcategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Subcategory deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
