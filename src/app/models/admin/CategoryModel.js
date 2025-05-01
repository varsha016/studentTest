

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    titleCategory: { type: mongoose.Schema.Types.ObjectId, ref: "TitleCategory", required: true },
    name: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Operator", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Operator" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

export default mongoose.models.Category || mongoose.model("Category", categorySchema);