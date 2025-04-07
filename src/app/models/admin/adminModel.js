// import mongoose from "mongoose";

// const adminSchema = new mongoose.Schema({
//     username: { type: String, required: true },  // Add this if needed
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
// });

// export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);


import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    joiningDate: { type: Date, default: Date.now },
    password: { type: String, required: true },
    permissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Permission" },
});

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    operators: [operatorSchema],
});

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);