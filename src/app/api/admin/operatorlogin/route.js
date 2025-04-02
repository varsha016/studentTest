



// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import Admin from '../../../models/admin/adminModel'
// import connectDB from "../../../lib/db";


// import { NextResponse } from 'next/server';

// export async function POST(req) {
//     try {
//         await connectDB();
//         const { email, password } = await req.json();

//         if (!email || !password) {
//             return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
//         }
//         console.log(email, password, "email");

//         // Find the admin with the matching operator email
//         const admin = await Admin.findOne({ 'operators.email': email });
//         console.log(admin, "admin");

//         if (!admin) {
//             return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
//         }

//         const operator = admin.operators.find(op => op.email === email);
//         if (!operator) {
//             return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
//         }

//         // Compare hashed password
//         const isMatch = await bcrypt.compare(password, operator.password);
//         if (!isMatch) {
//             return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
//         }

//         // Generate JWT token
//         // const token = jwt.sign(
//         //     { operatorId: operator._id, email: operator.email },
//         //     process.env.JWT_SECRET,
//         //     { expiresIn: '24h' }
//         // );
//         const token = jwt.sign(
//             {
//                 adminId: admin._id,
//                 operatorId: operator._id,
//                 role: "operator",
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: "24h" }
//         );

//         const result = {
//             operatorId: operator._id,
//             email: operator.email,
//             token

//         }

//         return NextResponse.json({ message: 'operator Login successful', result }, { status: 200 });
//     } catch (error) {
//         console.error('Login Error:', error);
//         return NextResponse.json({ message: error.message }, { status: 500 });
//     }
// }





async function hashOperatorPassword(email, plainPassword) {
    await connectDB();
    const admin = await Admin.findOne({ 'operators.email': email });
    if (!admin) {
        console.log('Admin not found');
        return;
    }

    const operator = admin.operators.find(op => op.email === email);
    if (!operator) {
        console.log('Operator not found');
        return;
    }

    operator.password = await bcrypt.hash(plainPassword, 10);
    await admin.save();
    console.log('Password updated successfully!');
}

hashOperatorPassword('opoperator@gmail.com', '123');






import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../../../models/admin/adminModel';
import connectDB from "../../../lib/db";
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // Find the admin with the matching operator email
        const admin = await Admin.findOne({ 'operators.email': email });
        if (!admin) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Find the operator within the admin's operators list
        const operator = admin.operators.find(op => op.email === email);
        if (!operator) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, operator.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, operatorId: operator._id, role: "operator" },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const result = {
            operatorId: operator._id,
            email: operator.email,
            token,
        };

        return NextResponse.json({ message: 'Operator login successful', result }, { status: 200 });

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
