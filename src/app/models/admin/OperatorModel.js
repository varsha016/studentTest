import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    joiningDate: { type: Date, default: Date.now },
    password: { type: String, required: true },
    permissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Permission" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // Link to admin who created this operator
});

export default mongoose.models.Operator || mongoose.model("Operator", operatorSchema);
