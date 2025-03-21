
// import mongoose from "mongoose";

// const QuestionSchema = new mongoose.Schema({
//     subCategory: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "SubCategory",
//         required: true,
//     },
//     questionText: {
//         type: String,
//         required: true,
//     },
//     questionType: {
//         type: String,
//         enum: ["mcq", "direct"],
//         required: true,
//     },
//     options: {
//         type: [String], // Stores MCQ options
//         required: function () {
//             return this.questionType === "mcq";
//         },
//     },
//     correctOptionIndex: {
//         type: Number, // ✅ Stores index of the correct MCQ option
//         required: function () {
//             return this.questionType === "mcq";
//         },
//     },
//     directAnswer: {
//         type: String, // ✅ Stores correct answer for direct type
//         default: null,
//     },
// });

// export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);



import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
    },
    questionText: {
        type: String,
        required: true,
    },
    questionType: {
        type: String,
        enum: ["mcq", "direct"],
        required: true,
    },
    options: {
        type: [String],
        required: function () {
            return this.questionType === "mcq";
        },
    },
    correctOptionIndex: {
        type: Number,
        required: function () {
            return this.questionType === "mcq";
        },
    },
    directAnswer: {
        type: String,
        default: null,
    },
    answerExplanation: {
        type: String, // Explanation for the correct answer
        default: null,
    },
});

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
