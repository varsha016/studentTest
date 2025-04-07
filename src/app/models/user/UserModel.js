import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true, // This makes the username field unique
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
// export default mongoose.models.User || mongoose.model("User", UserSchema);
