import dbConnect from "../../../lib/db";
import User from "../../../models/user/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

export async function POST(req) {
    try {
        const body = await req.json();
        const { token, password } = body;

        if (!token || !password) {
            return new Response(JSON.stringify({ message: "Token and password are required" }), {
                status: 400,
            });
        }

        await dbConnect();

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return new Response(JSON.stringify({ message: "Token has expired. Please request a new password reset link." }), {
                    status: 400,
                });
            }
            throw err;  // Rethrow if it's not the token expiration error
        }

        console.log(decoded, 'decoded');  // Ensure this has userId

        const user = await User.findById(decoded.userId);  // Use decoded.userId
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        // Skip checking if the new password is the same as the old one
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return new Response(JSON.stringify({ message: "Password reset successful" }), {
            status: 200,
        });

    } catch (err) {
        console.error("Reset password error:", err);
        return new Response(JSON.stringify({ message: "Invalid token" }), {
            status: 400,
        });
    }
}
