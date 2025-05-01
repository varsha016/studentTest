import connectDB from "../../../lib/db";
import Operator from "../../../models/admin/OperatorModel";
import { NextResponse } from "next/server";
export async function GET() {
    try {
        await connectDB();

        // Find all logged-in operators directly
        const loggedInOperators = await Operator.find({ isLoggedIn: true });

        const loggedInCount = loggedInOperators.length;

        console.log(loggedInCount, 'Logged-in operators count');

        return NextResponse.json({ count: loggedInCount }, { status: 200 });
    } catch (error) {
        console.error("Error fetching logged-in operators:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
// update oModel
// export async function GET() {
//     try {
//         await connectDB();

//         // Count total logged-in operators across all admins
//         const admins = await Admin.find();
//         let loggedInCount = 0;
//         console.log(admins, 'AAAAAAAAAAAAAAAAAAAAAAAAAA');

//         admins.forEach(admin => {
//             loggedInCount += admin.operators.filter(op => op.isLoggedIn === true).length;
//         });

//         console.log(loggedInCount, 'AAAAuuuuuuAAAAAAAAAAAAAAAAA');
//         return NextResponse.json({ count: loggedInCount }, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching logged-in operators:", error);
//         return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
//     }
// }
