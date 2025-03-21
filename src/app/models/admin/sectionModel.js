import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true }, // Reference to SubCategory
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Reference to Category
    name: { type: String, required: true, unique: true }, // Section name
    questionLimit: { type: Number, required: true }, // User-defined question limit
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], // List of question references
}, { timestamps: true });

export default mongoose.models.Section || mongoose.model("Section", sectionSchema);
