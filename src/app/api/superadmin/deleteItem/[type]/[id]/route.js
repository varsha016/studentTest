import { authenticate } from '../../../../../lib/auth/auth';
import dbConnect from '../../../../../lib/db';
import TitleCategory from '../../../../../models/admin/TitleCategoryModel';
import Category from '../../../../../models/admin/CategoryModel';
import SubCategory from '../../../../../models/admin/SubCategoryModel';
import Question from '../../../../../models/admin/QuestionModel';


const modelMap = {
    TitleCategory,
    Category,
    SubCategory,
    Question,
};

export async function DELETE(req, { params }) {
    await dbConnect();
    const { type, id } = await params;
    const Model = modelMap[type];

    if (!Model) {
        return new Response(JSON.stringify({ error: 'Invalid type provided' }), { status: 400 });
    }

    try {
        await authenticate(req);
        await Model.findByIdAndDelete(id);
        return new Response(JSON.stringify({ message: `${type} deleted successfully` }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: `Failed to delete ${type}` }), { status: 500 });
    }
}
