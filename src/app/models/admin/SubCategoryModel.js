import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },  // Reference to Category
    name: { type: String, required: true, unique: true },  // e.g., "Quantum Mechanics", "Organic Chemistry"
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Operator", required: true },
});

export default mongoose.models.SubCategory || mongoose.model("SubCategory", subCategorySchema);
