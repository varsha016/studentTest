import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Section from "../../../models/admin/sectionModel";
import Category from "../../../models/admin/CategoryModel"; // Import Category model first
import SubCategory from "../../../models/admin/SubCategoryModel";
import Question from "../../../models/admin/QuestionModel";
export async function GET(request) {
    try {
        await connectDB();

        // Extract subcategoryId from query parameters
        // const { searchParams } = new URL(req.url);
        // const { searchParams } = new URL(request.url);
        // const subcategoryId = searchParams.get("subcategoryId");
        // console.log(subcategoryId, 'subcategoryId');


        // if (!subcategoryId) {
        //     return NextResponse.json(
        //         { message: "subcategoryId is required" },
        //         { status: 400 }
        //     );
        // }
        // Fetch all sections and populate the subCategory field.
        // You can further populate nested references if needed.
        const sections = await Section.find()
            .populate({
                path: "subCategory", // Populate the subCategory field in Section
                select: "name",      // Return only the name field from SubCategory
                populate: {          // Optionally, also populate the category reference within SubCategory
                    path: "category",
                    select: "name"
                }
            })
            .populate("questions"); // Optionally populate questions (if you want the full question details)

        return NextResponse.json({ sections }, { status: 200 });
    } catch (error) {
        console.error("Error fetching sections:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
