// import connectDB from "../../../lib/db";
// import User from "../../../models/user/UserModel";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     await connectDB();
//     const { username, password, role } = await req.json(); // Include role

//     try {
//         // Check if user already exists
//         const existingUser = await User.findOne({ username });

//         if (existingUser) {
//             return NextResponse.json(
//                 { message: "Username already exists" },
//                 { status: 400 }
//             );
//         }

//         // Hash Password
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await User.create({ username, password: hashedPassword, role });

//         // Generate JWT Token with _id, username, and role
//         const token = jwt.sign(
//             { id: newUser._id, username: newUser.username, role: newUser.role },
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" }
//         );

//         return NextResponse.json(
//             {
//                 message: "User Created Successfully",
//                 user: {
//                     _id: newUser._id,
//                     username: newUser.username,
//                     role: newUser.role,
//                 },
//                 userToken: token,
//             },
//             { status: 201 }
//         );
//     } catch (err) {
//         console.error("Error:", err);
//         return NextResponse.json(
//             { message: "Something went wrong", error: err.message },
//             { status: 500 }
//         );
//     }
// }

import connectDB from "../../../lib/db";
import User from "../../../models/user/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();
    const { username, password, role } = await req.json();

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            // Verify Password
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);

            if (!isPasswordValid) {
                return NextResponse.json({ message: "Invalid password" }, { status: 401 });
            }

            // Generate JWT Token
            const token = jwt.sign(
                { id: existingUser._id, username: existingUser.username, role: existingUser.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return NextResponse.json(
                {
                    message: "Login successful",
                    user: {
                        _id: existingUser._id,
                        username: existingUser.username,
                        role: existingUser.role,
                    },
                    userToken: token,
                },
                { status: 200 }
            );
        }

        // Hash Password and Create New User
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, role });

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return NextResponse.json(
            {
                message: "User Created Successfully",
                user: {
                    _id: newUser._id,
                    username: newUser.username,
                    role: newUser.role,
                },
                userToken: token,
            },
            { status: 201 }
        );

    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { message: "Something went wrong", error: err.message },
            { status: 500 }
        );
    }
}
