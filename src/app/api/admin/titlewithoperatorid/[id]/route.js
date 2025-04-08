
import connectDB from "../../../../lib/db";
import TitleCategory from "../../../../models/admin/TitleCategoryModel";

export async function GET(req, { params }) {
    try {
        await connectDB();

        // const { searchParams } = new URL(req.url);
        // const operatorId = searchParams.get("operatorId");
        const { id: operatorId } = await params;
        console.log(operatorId, 'operatorId@@@@@@@@@@@@@@@@');

        let titleCategories;

        if (operatorId) {
            titleCategories = await TitleCategory.find({ operatorId }); // assuming field name is `operatorId`
        } else {
            titleCategories = await TitleCategory.find({});
        }

        return new Response(JSON.stringify(titleCategories), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
}
