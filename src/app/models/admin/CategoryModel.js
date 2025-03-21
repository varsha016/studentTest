
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    titleCategory: { type: mongoose.Schema.Types.ObjectId, ref: "TitleCategory", required: true }, // Reference to TitleCategory
    name: { type: String, required: true, unique: true }, // e.g., "Physics", "Chemistry"
});

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
