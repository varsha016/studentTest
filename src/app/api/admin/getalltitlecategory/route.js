import connectDB from "../../../lib/db";
import TitleCategory from "../../../models/admin/TitleCategoryModel";

export async function GET() {
    try {
        await connectDB();
        const titleCategories = await TitleCategory.find({});
        return new Response(JSON.stringify(titleCategories), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
}


