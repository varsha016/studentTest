import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin.operators", required: true },
    addQuestion: { type: Boolean, default: false },
    updateQuestion: { type: Boolean, default: false },
    addCategory: { type: Boolean, default: false },
    updateCategory: { type: Boolean, default: false },
});

export default mongoose.models.Permission || mongoose.model("Permission", permissionSchema);