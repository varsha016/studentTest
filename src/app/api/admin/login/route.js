

import connectDB from "../../../lib/db";
import Admin from "../../../models/admin/adminModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ message: "Email and password are required" }), { status: 400 });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return new Response(JSON.stringify({ message: "Admin Not Found" }), { status: 404 });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return new Response(JSON.stringify({ message: "Invalid Credentials" }), { status: 401 });
        }

        // Generate JWT token with role
        const token = jwt.sign({ adminId: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return new Response(JSON.stringify({
            message: "Login successful",
            token,
            admin: {
                _id: admin._id,
                email: admin.email,
                role: "admin",
            }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
