import connectDB from "../../../lib/db";
import SubCategory from "../../../models/admin/SubCategoryModel";
import Category from "../../../models/admin/CategoryModel";
import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await connectDB();

//     const url = new URL(req.url);
//     const categoryId = url.searchParams.get("id");
//     const page = parseInt(url.searchParams.get("page")) || 1;
//     const limit = parseInt(url.searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     let query = {};
//     if (categoryId) {
//       query.category = categoryId;
//     }

//     const [subcategories, totalCount] = await Promise.all([
//       SubCategory.find(query).skip(skip).limit(limit).populate("category"),
//       SubCategory.countDocuments(query)
//     ]);

//     return NextResponse.json({
//       subcategories,
//       totalCount,
//       currentPage: page,
//       totalPages: Math.ceil(totalCount / limit)
//     }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Internal Server Error", error: error.message },
//       { status: 500 }
//     );
//   }
// }


export async function GET(req) {
  try {
    await connectDB();
    console.log("✅ Connected to DB");

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("id");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    let query = {};
    if (categoryId) {
      query.category = categoryId;
    }

    console.log("📦 Query:", query);

    if (pageParam && limitParam) {
      const page = parseInt(pageParam);
      const limit = parseInt(limitParam);
      const skip = (page - 1) * limit;

      console.log(`📄 Pagination: page=${page}, limit=${limit}, skip=${skip}`);

      const [subcategories, totalCount] = await Promise.all([
        SubCategory.find(query).skip(skip).limit(limit).populate("category"),
        SubCategory.countDocuments(query),
      ]);

      return NextResponse.json({
        subcategories,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      }, { status: 200 });
    }

    const subcategories = await SubCategory.find(query).populate("category");
    return NextResponse.json({ subcategories }, { status: 200 });

  } catch (error) {
    console.error("🔥 SubCategory API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
