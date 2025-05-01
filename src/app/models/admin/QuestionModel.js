// import mongoose from "mongoose";
// const questionSchema = new mongoose.Schema({
//     subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },

//     questionText: { type: String, required: true },
//     questionType: { type: String, enum: ["mcq", "direct"], required: true },
//     options: { type: [String], required: function () { return this.questionType === "mcq"; } },
//     correctOptionIndex: { type: Number, required: function () { return this.questionType === "mcq"; } },
//     directAnswer: { type: String, default: null },
//     answerExplanation: { type: String, default: null },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin.operators", required: true },
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin.operators" },
//     approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin.operators", default: null },

//     status: {
//         type: String, enum: ["draft", "pending", "approved", "rejected"], default: "draft"
//     },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date },
//     rejectionReason: { type: String, default: null },
// });

// export default mongoose.models.Question || mongoose.model("Question", questionSchema);




import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    // Reference to the subcategory
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },

    // Reference to the category
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

    // The question text
    questionText: { type: String, required: true },

    // Type of question (MCQ, direct, true/false)
    questionType: {
        type: String,
        enum: ["mcq", "direct", "truefalse"],
        required: true,
    },

    // Options for MCQ
    options: {
        type: [String],
        required: function () { return this.questionType === "mcq"; },
    },

    // Correct option index for MCQ
    correctOptionIndex: {
        type: Number,
        required: function () { return this.questionType === "mcq"; },
    },

    // Answer for direct type
    directAnswer: {
        type: String,
        default: null,
        required: function () { return this.questionType === "direct"; },
    },

    // Answer for true/false
    correctAnswer: {
        type: String,
        required: true,
    },

    // Optional explanation
    answerExplanation: { type: String, default: null },

    // Creator (Admin or Operator)
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Operator", // Change to 'Operator' if created by Operator instead
        required: true,
    },

    // Last updated by (Admin or Operator)
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Operator",
        default: null,
    },

    // Approved by (Admin or Operator)
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Operator",
        default: null,
    },

    // Status
    status: {
        type: String,
        enum: ["draft", "pending", "approved", "rejected"],
        default: "draft",
    },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },

    // Rejection reason
    rejectionReason: { type: String, default: null },
});

export default mongoose.models.Question || mongoose.model("Question", questionSchema);

