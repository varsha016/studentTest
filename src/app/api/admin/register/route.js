import connectDB from "../../../lib/db";
import Admin from "../../../models/admin/adminModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await connectDB();

        const { username, email, password } = await req.json();
        console.log(username, email, password);

        // Ensure required fields are provided
        if (!username || !email || !password) {
            return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        console.log(existingAdmin, "existingAdmin");

        if (existingAdmin) {
            return new Response(JSON.stringify({ message: "Admin already exists" }), { status: 400 });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = await Admin.create({ username, email, password: hashedPassword });
        console.log(newAdmin, "newAdmin");

        // Generate JWT token
        const token = jwt.sign({ adminId: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return new Response(JSON.stringify({
            message: "Admin registered successfully",
            token,
            admin: {
                _id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email
            }
        }), { status: 201 });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
}
