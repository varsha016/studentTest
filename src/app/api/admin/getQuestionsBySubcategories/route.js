import connectDB from "../../../lib/db";
import Questions from "../../../models/admin/QuestionModel";

export async function POST(req) {
    try {
        await connectDB();
        const { subcategoryIds } = await req.json();

        const questions = await Questions.find({
            subcategoryId: { $in: subcategoryIds },
        });

        return new Response(JSON.stringify(questions), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error", error }), {
            status: 500,
        });
    }
}
