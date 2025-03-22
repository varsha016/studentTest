// import mongoose from "mongoose";

// const testAttemptSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     sectionId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Section",
//         required: true,
//     },
//     responses: [
//         {
//             questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
//             answer: { type: String, required: true },
//             isCorrect: { type: Boolean },
//         }
//     ],
//     // score: { type: Number, default: 0 },
//     completedAt: { type: Date, default: null },
// });

// export default mongoose.models.TestAttempt || mongoose.model("TestAttempt", testAttemptSchema);


import mongoose from "mongoose";

const testAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    },
    responses: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
            questionText: { type: String, required: true }, // ✅ Add this line
            answer: { type: String, },
            isCorrect: { type: Boolean },
        }
    ],
    // score: { type: Number, default: 0 },
    completedAt: { type: Date, default: null },
});

export default mongoose.models.TestAttempt || mongoose.model("TestAttempt", testAttemptSchema);
