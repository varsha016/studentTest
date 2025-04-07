



import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("MongoDB Already Connected");
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1); // Forcefully exit if connection fails
    }
};

export default connectDB;
