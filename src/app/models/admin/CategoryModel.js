
// import mongoose from "mongoose";

// const categorySchema = new mongoose.Schema({
//     titleCategory: { type: mongoose.Schema.Types.ObjectId, ref: "TitleCategory", required: true }, // Reference to TitleCategory
//     name: { type: String, required: true, unique: true }, // e.g., "Physics", "Chemistry"
// });

// export default mongoose.models.Category || mongoose.model("Category", categorySchema);
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    titleCategory: { type: mongoose.Schema.Types.ObjectId, ref: "TitleCategory", required: true },
    name: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin.operators", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin.operators" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

export default mongoose.models.Category || mongoose.model("Category", categorySchema);