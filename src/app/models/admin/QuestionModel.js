
import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ["mcq", "direct"], required: true },
    options: { type: [String], required: function () { return this.questionType === "mcq"; } },
    correctOptionIndex: { type: Number, required: function () { return this.questionType === "mcq"; } },
    directAnswer: { type: String, default: null },
    answerExplanation: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin.operators", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin.operators" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin.operators", default: null },

    status: {
        type: String, enum: ["draft", "pending", "approved", "rejected"], default: "draft"
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    rejectionReason: { type: String, default: null },
});



export default mongoose.models.Question || mongoose.model("Question", questionSchema);