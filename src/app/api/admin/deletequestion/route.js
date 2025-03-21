import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";
import Option from "../../../models/admin/OptionModel";

export async function DELETE(req) {
    try {
        await connectDB();
        const { questionId } = await req.json();

        if (!questionId) {
            return new Response(JSON.stringify({ message: "Question ID is required" }), { status: 400 });
        }

        const existingQuestion = await Question.findById(questionId);
        if (!existingQuestion) {
            return new Response(JSON.stringify({ message: "Question not found" }), { status: 404 });
        }

        // ✅ Delete associated options if it's an MCQ
        if (existingQuestion.options.length > 0) {
            await Option.deleteMany({ _id: { $in: existingQuestion.options } });
        }

        await Question.findByIdAndDelete(questionId);

        return new Response(JSON.stringify({ message: "Question deleted successfully" }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
}
