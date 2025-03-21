import connectDB from "../../../lib/db";
import TitleCategory from "../../../models/admin/TitleCategoryModel";

export async function POST(req) {
    try {
        await connectDB();
        const { title } = await req.json();

        if (!title) {
            return new Response(JSON.stringify({ message: "Title is required" }), { status: 400 });
        }

        const newTitleCategory = await TitleCategory.create({ title });

        return new Response(JSON.stringify({
            message: "Title category added successfully",
            data: newTitleCategory
        }), { status: 201 });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
}
