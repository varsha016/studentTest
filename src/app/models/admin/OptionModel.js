import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    text: { type: String, required: true },  // Option text
    isCorrect: { type: Boolean, required: true, },  // Is this option the correct answer?
});

export default mongoose.models.Option || mongoose.model("Option", optionSchema);
