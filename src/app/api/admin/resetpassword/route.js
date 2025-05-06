import dbConnect from "../../../lib/db";
import Operator from "../../../models/admin/OperatorModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

export async function POST(req) {
    try {
        const body = await req.json();
        const { token, newPassword, confirmPassword } = body;

        // Validate inputs
        if (!token || !newPassword || !confirmPassword) {
            return new Response(JSON.stringify({
                success: false,
                message: "All fields are required"
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (newPassword !== confirmPassword) {
            return new Response(JSON.stringify({
                success: false,
                message: "Passwords do not match"
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await dbConnect();

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return new Response(JSON.stringify({
                    success: false,
                    message: "Token expired. Please request a new link."
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid token"
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const operator = await Operator.findById(decoded.operatorId);
        if (!operator) {
            return new Response(JSON.stringify({
                success: false,
                message: "Operator not found"
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Store password in plain text (as requested)
        operator.password = newPassword;
        operator.updatedAt = new Date();
        await operator.save();

        return new Response(JSON.stringify({
            success: true,
            message: "Password updated successfully"
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error("Operator reset password error:", err);
        return new Response(JSON.stringify({
            success: false,
            message: "Internal server error"
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}