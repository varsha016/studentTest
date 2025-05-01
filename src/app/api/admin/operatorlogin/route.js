

// import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Operator from '../../../models/admin/OperatorModel';
import connectDB from "../../../lib/db";
import { NextResponse } from 'next/server';



export async function POST(req) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // Find operator directly by email
        const operator = await Operator.findOne({ email });
        if (!operator) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Direct password match (no bcrypt)
        if (password !== operator.password) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            { operatorId: operator._id, role: "operator" },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const result = {
            name: operator.name,
            email: operator.email,
            operatorId: operator._id,
            isLoggedIn: true,
            token,
        };

        return NextResponse.json({ message: 'Operator login successful', result }, { status: 200 });

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

// export async function POST(req) {
//     try {
//         await connectDB();
//         const { email, password } = await req.json();

//         if (!email || !password) {
//             return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
//         }

//         const admin = await Admin.findOne({ 'operators.email': email });
//         if (!admin) {
//             return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
//         }

//         const operator = admin.operators.find(op => op.email === email);
//         if (!operator) {
//             return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
//         }

//         const isMatch = await bcrypt.compare(password, operator.password);
//         if (!isMatch) {
//             return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
//         }

//         if (!process.env.JWT_SECRET) {
//             throw new Error("JWT_SECRET is not defined");
//         }

//         const token = jwt.sign(
//             { adminId: admin._id, operatorId: operator._id, role: "operator" },
//             process.env.JWT_SECRET,
//             { expiresIn: "24h" }
//         );

//         const result = {
//             name: operator.name,
//             email: operator.email,
//             operatorId: operator._id,
//             isLoggedIn: true,
//             token,
//         };

//         return NextResponse.json({ message: 'Operator login successful', result }, { status: 200 });

//     } catch (error) {
//         console.error('Login Error:', error);
//         return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
//     }
// }

