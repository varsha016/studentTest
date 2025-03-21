import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";
import Option from "../../../models/admin/OptionModel";

export async function PUT(req) {
    try {
        await connectDB();
        const { questionId, subCategory, questionText, options, directAnswer, } = await req.json();

        if (!questionId) {
            return new Response(JSON.stringify({ message: "Question ID is required" }), { status: 400 });
        }

        const existingQuestion = await Question.findById(questionId);
        if (!existingQuestion) {
            return new Response(JSON.stringify({ message: "Question not found" }), { status: 404 });
        }

        let updatedQuestionData = {
            subCategory,
            questionText,

            options: [],
            directAnswer: ""
        };

        if (options && options.length === 4) {
            // ✅ Update options for MCQ
            await Option.deleteMany({ _id: { $in: existingQuestion.options } });
            const optionDocs = await Option.insertMany(options);
            updatedQuestionData.options = optionDocs.map(opt => opt._id);
        } else if (directAnswer && directAnswer.trim() !== "") {
            // ✅ Update direct answer
            updatedQuestionData.directAnswer = directAnswer;
        } else {
            return new Response(JSON.stringify({ message: "Provide either 4 options or a direct answer" }), { status: 400 });
        }

        const updatedQuestion = await Question.findByIdAndUpdate(questionId, updatedQuestionData, { new: true });

        return new Response(JSON.stringify({
            message: "Question updated successfully",
            data: updatedQuestion
        }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
}
