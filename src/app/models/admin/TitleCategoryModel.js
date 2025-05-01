import mongoose from "mongoose";

const titleCategorySchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },  // e.g., "Science", "Math"
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Operator", required: true },
});

export default mongoose.models.TitleCategory || mongoose.model("TitleCategory", titleCategorySchema);






// import mongoose from "mongoose";

// // Define the schema
// const titleCategorySchema = new mongoose.Schema({
//     title: { type: String, required: true, unique: true },
// }, { timestamps: true });

// // Register the model if it doesn't exist
// const TitleCategory = mongoose.models?.TitleCategory || mongoose.model("TitleCategory", titleCategorySchema);

// export default TitleCategory;
