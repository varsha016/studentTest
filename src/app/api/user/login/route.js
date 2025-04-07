

// import connectDB from "../../../lib/db";
// import User from "../../../models/user/UserModel";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     await connectDB();
//     const { username, password, role } = await req.json();

//     try {
//         // Check if user already exists
//         const existingUser = await User.findOne({ username });

//         if (existingUser) {
//             // Verify Password
//             const isPasswordValid = await bcrypt.compare(password, existingUser.password);

//             if (!isPasswordValid) {
//                 return NextResponse.json({ message: "Invalid password" }, { status: 401 });
//             }

//             // Generate JWT Token
//             const token = jwt.sign(
//                 { id: existingUser._id, username: existingUser.username, role: existingUser.role },
//                 process.env.JWT_SECRET,
//                 { expiresIn: "1h" }
//             );

//             return NextResponse.json(
//                 {
//                     message: "Login successful",
//                     user: {
//                         _id: existingUser._id,
//                         username: existingUser.username,
//                         role: existingUser.role,
//                     },
//                     userToken: token,
//                 },
//                 { status: 200 }
//             );
//         }

//         // Hash Password and Create New User
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await User.create({ username, password: hashedPassword, role });

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

// import connectDB from "../../../lib/db";
// import User from "../../../models/user/UserModel";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();

    const { name, lastName, username, password } = await req.json();

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);

            if (!isPasswordValid) {
                return NextResponse.json({ message: "Invalid password" }, { status: 401 });
            }

            const token = jwt.sign(
                {
                    id: existingUser._id,
                    username: existingUser.username,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return NextResponse.json({
                message: "Login successful",
                user: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    lastName: existingUser.lastName,
                    username: existingUser.username,
                },
                userToken: token,
            }, { status: 200 });
        }

        // New user registration logic
        if (!name || !lastName) {
            return NextResponse.json(
                { message: "Name and last name are required for new user" },
                { status: 400 }
            );
        }
        console.log("Creating user with:", { name, lastName, username, password });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            lastName,
            username,
            password: hashedPassword,
        });
        console.log(newUser, 'newUser');

        const token = jwt.sign(
            {
                id: newUser._id,
                username: newUser.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return NextResponse.json({
            message: "User Created Successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                lastName: newUser.lastName,
                username: newUser.username,
            },
            userToken: token,
        }, { status: 201 });

    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { message: "Something went wrong", error: err.message },
            { status: 500 }
        );
    }
}

