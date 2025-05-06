import dbConnect from "../../../lib/db";
import User from "../../../models/user/UserModel";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.DOMAIN || "http://localhost:3000";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const DEPLOYED_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;


export async function POST(req) {
    const body = await req.json(); // ⬅️ Important: parse request body like this in App Router
    const { username } = body;

    await dbConnect();

    try {
        const user = await User.findOne({ username });
        console.log(user, 'user');

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        // const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "15m" });
        // Generate token with `userId` in the payload
        const token = jwt.sign(
            { userId: user._id, username: user.email },  // Key name is `userId`
            JWT_SECRET,
            { expiresIn: "15m" }
        );

        console.log(token, 'token');

        const resetLink = `${BASE_URL}/user/ResetPasswordPage?token=${token}`;
        // const resetLink = `${BASE_URL}/user/ResetPasswordPage?token=${token}&email=${user.email}`;

        console.log(resetLink, 'resetLink');

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log(transporter, 'transporter');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.username,
            subject: "Password Reset Request",
            html: `
                <p>Hello ${user.name || user.username},</p>
                <p>You requested to reset your password.</p>
                <p>Click the link below to reset it. This link will expire in 15 minutes:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>If you did not request this, you can ignore this email.</p>
            `,
        };
        console.log(mailOptions, 'mailOptions');

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: "Password reset email sent" }), {
            status: 200,
        });
    } catch (err) {
        console.error("Forgot password error:", err);
        return new Response(JSON.stringify({ message: "Something went wrong" }), {
            status: 500,
        });
    }
}
