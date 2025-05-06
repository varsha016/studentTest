// import dbConnect from "../../../lib/db";
// import Operator from "../../../models/admin/OperatorModel";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";

// const JWT_SECRET = process.env.JWT_SECRET;
// const BASE_URL = process.env.DOMAIN || "http://localhost:3000";
// const EMAIL_USER = process.env.EMAIL_USER;
// const EMAIL_PASS = process.env.EMAIL_PASS;

// export async function POST(req) {
//     try {
//         const body = await req.json();
//         const { email } = body;

//         if (!email) {
//             return new Response(JSON.stringify({
//                 success: false,
//                 message: "Email is required"
//             }), {
//                 status: 400,
//                 headers: { 'Content-Type': 'application/json' }
//             });
//         }

//         await dbConnect();

//         // Case-insensitive email search
//         const operator = await Operator.findOne({
//             email: { $regex: new RegExp(`^${email.trim()}$`, 'i') }
//         });

//         if (!operator) {
//             return new Response(JSON.stringify({
//                 success: false,
//                 message: "No operator found with this email address"
//             }), {
//                 status: 404,
//                 headers: { 'Content-Type': 'application/json' }
//             });
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             {
//                 operatorId: operator._id,
//                 email: operator.email
//             },
//             JWT_SECRET,
//             { expiresIn: "15m" }
//         );

//         // Create reset link
//         const resetLink = `${BASE_URL}/admin/resetPassword?token=${token}`;

//         // Configure email transporter
//         const transporter = nodemailer.createTransport({
//             service: "Gmail",
//             auth: {
//                 user: EMAIL_USER,
//                 pass: EMAIL_PASS,
//             },
//         });

//         // Send email
//         await transporter.sendMail({
//             from: `System Admin <${EMAIL_USER}>`,
//             to: operator.email,
//             subject: "Operator Password Reset Request",
//             html: `
//                 <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//                     <h2 style="color: #2563eb;">Password Reset</h2>
//                     <p>Dear ${operator.name} ${operator.lastName},</p>
//                     <p>You requested to reset your operator account password.</p>
//                     <p style="margin: 20px 0;">
//                         <a href="${resetLink}"
//                            style="background-color: #2563eb; color: white;
//                                   padding: 10px 15px; text-decoration: none;
//                                   border-radius: 5px;">
//                             Reset Password
//                         </a>
//                     </p>
//                     <p><strong>This link expires in 15 minutes.</strong></p>
//                     <p>If you didn't request this, please contact your administrator.</p>
//                     <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
//                     <p style="font-size: 0.9em; color: #6b7280;">
//                         Operator ID: ${operator._id}<br>
//                         Contact: ${operator.contactNumber}
//                     </p>
//                 </div>
//             `,
//         });

//         return new Response(JSON.stringify({
//             success: true,
//             message: "Password reset link sent to your email"
//         }), {
//             status: 200,
//             headers: { 'Content-Type': 'application/json' }
//         });

//     } catch (err) {
//         console.error("Forgot password error:", err);
//         return new Response(JSON.stringify({
//             success: false,
//             message: "Internal server error"
//         }), {
//             status: 500,
//             headers: { 'Content-Type': 'application/json' }
//         });
//     }
// }



import dbConnect from "../../../lib/db";
import Operator from "../../../models/admin/OperatorModel";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.DOMAIN || "http://localhost:3000";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

export async function POST(req) {
    // First log the raw request
    const reqClone = req.clone();
    const rawBody = await reqClone.text();
    console.log("Raw request body:", rawBody);

    try {
        // Parse the JSON body
        let body;
        try {
            body = JSON.parse(rawBody);
            console.log("Parsed request body:", body);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid JSON format in request body"
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate email exists
        if (!body || typeof body.email === 'undefined') {
            console.error("Email missing in request body");
            return new Response(JSON.stringify({
                success: false,
                message: "Email parameter is required in the request body"
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const email = body.email?.trim();
        if (!email) {
            return new Response(JSON.stringify({
                success: false,
                message: "Email cannot be empty"
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await dbConnect();

        // Rest of your existing code...
        const operator = await Operator.findOne({
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });

        if (!operator) {
            return new Response(JSON.stringify({
                success: false,
                message: "No operator found with this email address"
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                operatorId: operator._id,
                email: operator.email
            },
            JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Create reset link
        const resetLink = `${BASE_URL}/admin/resetPassword?token=${token}`;

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });

        // Send email
        await transporter.sendMail({
            from: `System Admin <${EMAIL_USER}>`,
            to: operator.email,
            subject: "Operator Password Reset Request",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #2563eb;">Password Reset</h2>
                    <p>Dear ${operator.name} ${operator.lastName},</p>
                    <p>You requested to reset your operator account password.</p>
                    <p style="margin: 20px 0;">
                        <a href="${resetLink}" 
                           style="background-color: #2563eb; color: white; 
                                  padding: 10px 15px; text-decoration: none; 
                                  border-radius: 5px;">
                            Reset Password
                        </a>
                    </p>
                    <p><strong>This link expires in 15 minutes.</strong></p>
                    <p>If you didn't request this, please contact your administrator.</p>
                </div>
            `,
        });

        return new Response(JSON.stringify({
            success: true,
            message: "Password reset link sent to your email"
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error("Error in forgot password endpoint:", err);
        return new Response(JSON.stringify({
            success: false,
            message: "Internal server error"
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}