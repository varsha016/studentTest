// import connectDB from "../../../lib/db";
// import User from "../../../models/user/UserModel";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     await connectDB();

//     const { username, password } = await req.json();

//     try {
//         // Check if the user exists
//         const existingUser = await User.findOne({ username });
//         console.log(existingUser, 'existingUser');

//         if (!existingUser) {
//             return NextResponse.json(
//                 { message: "User not found" },
//                 { status: 404 }
//             );
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             { id: existingUser._id, username: existingUser.username },
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" }
//         );
//         console.log(token, 'token');

//         return NextResponse.json(
//             {
//                 message: "Login successful",
//                 user: {
//                     _id: existingUser._id,
//                     name: existingUser.name,
//                     lastName: existingUser.lastName,
//                     username: existingUser.username,
//                 },
//                 userToken: token,
//             },
//             { status: 200 }
//         );
//     } catch (err) {
//         console.error("Error:", err);
//         return NextResponse.json(
//             { message: "Something went wrong", error: err.message },
//             { status: 500 }
//         );
//     }
// }

// src/app/api/user/login/route.js





import connectDB from "../../../lib/db";
import User from "../../../models/user/UserModel";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();

    const { username, password } = await req.json();
    console.log(password, 'password');

    try {
        // 1. Find user by username/email
        const existingUser = await User.findOne({ username });
        console.log(existingUser, 'existingUser');

        if (!existingUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // 2. Check if the password matches
        if (existingUser.password !== password) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // 3. Sign JWT with `userId`
        const token = jwt.sign(
            { userId: existingUser._id, username: existingUser.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 4. Return user info + token
        return NextResponse.json(
            {
                message: "Login successful",
                user: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    lastName: existingUser.lastName,
                    username: existingUser.username,
                },
                userToken: token,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error in login:", err);
        return NextResponse.json(
            { message: "Something went wrong", error: err.message },
            { status: 500 }
        );
    }
}
