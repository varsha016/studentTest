import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Operator", required: true },
    // operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin.operators", required: true },
    addTitleCategory: { type: Boolean, default: false },
    updateTitleCategory: { type: Boolean, default: false },
    addQuestion: { type: Boolean, default: false },
    updateQuestion: { type: Boolean, default: false },
    addCategory: { type: Boolean, default: false },
    updateCategory: { type: Boolean, default: false },
    addSubCategory: { type: Boolean, default: false },
    updateSubCategory: { type: Boolean, default: false },
    // addSection: { type: Boolean, default: false },
    // updateSection: { type: Boolean, default: false },
});

export default mongoose.models.Permission || mongoose.model("Permission", permissionSchema);