


// import connectDB from "../../../lib/db";
// import Admin from "../../../models/admin/adminModel";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { NextResponse } from 'next/server';

// export async function POST(req) {
//     try {
//         await connectDB();
//         const { email, password } = await req.json();

//         if (!email || !password) {
//             return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
//         }

//         // Find the admin by email
//         const admin = await Admin.findOne({ email });
//         if (!admin) {
//             return NextResponse.json({ message: "Admin Not Found" }, { status: 404 });
//         }

//         // Compare the password with the stored hash
//         const isMatch = await bcrypt.compare(password, admin.password);
//         if (!isMatch) {
//             return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 });
//         }

//         // Generate JWT token with admin role
//         const token = jwt.sign(
//             { adminId: admin._id, role: "admin" },
//             process.env.JWT_SECRET,
//             { expiresIn: "24h" }
//         );

//         return NextResponse.json({
//             message: "Login successful",
//             token,
//             admin: {
//                 _id: admin._id,
//                 email: admin.email,
//                 role: "admin",
//             }
//         }, { status: 200 });

//     } catch (error) {
//         console.error("Admin login error:", error);
//         return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
//     }
// }



import connectDB from "../../../lib/db";
import Admin from "../../../models/admin/adminModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        // Find the admin by email
        let admin = await Admin.findOne({ email });

        if (!admin) {
            // If no admin is found, create a new admin
            const hashedPassword = await bcrypt.hash(password, 10);
            admin = new Admin({
                email,
                password: hashedPassword,
                // Add any other necessary fields to the new admin here (optional)
            });

            await admin.save();
            return NextResponse.json({ message: "New admin created", admin }, { status: 201 });
        }

        // If admin exists, compare the password with the stored hash
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 });
        }

        // Generate JWT token with admin role
        const token = jwt.sign(
            { adminId: admin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return NextResponse.json({
            message: "Login successful",
            token,
            admin: {
                _id: admin._id,
                email: admin.email,
                role: "admin",
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
