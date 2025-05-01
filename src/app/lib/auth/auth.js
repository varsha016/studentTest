


// import jwt from 'jsonwebtoken';
// import Admin from '../../models/admin/adminModel';



// export async function authenticate(req) {
//     try {
//         const authHeader = req.headers.get("authorization");
//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             throw new Error("Unauthorized: No token provided");
//         }

//         const token = authHeader.split(" ")[1];
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("Decoded JWT:", decoded);

//         // 🔹 Check if the decoded token has an adminId
//         if (decoded.adminId) {
//             const admin = await Admin.findById(decoded.adminId);
//             if (!admin) {
//                 throw new Error("Unauthorized: Admin not found");
//             }
//             console.log("Admin authorized:", admin);
//             return { operator: admin, role: "admin" };  // 🔥 Explicitly set role
//         }

//         // 🔹 If it's an operator, verify their presence
//         if (decoded.role === "operator" && decoded.operatorId) {
//             const admin = await Admin.findById(decoded.adminId);
//             if (!admin) {
//                 throw new Error("Unauthorized: Admin not found");
//             }

//             console.log("Admin operators:", admin.operators);

//             const operator = admin.operators.find(op => op._id.toString() === decoded.operatorId);
//             if (!operator) {
//                 throw new Error("Unauthorized: Operator not found");
//             }

//             return { operator, role: "operator" };  // 🔥 Explicitly set role
//         }

//         throw new Error("Unauthorized: Invalid role in token");

//     } catch (error) {
//         console.error("Authentication Error:", error.message);
//         throw new Error(`Authentication failed: ${error.message}`);
//     }
// }


import jwt from 'jsonwebtoken';
import Admin from '../../models/admin/adminModel';
import Operator from '../../models/admin/OperatorModel'; // ✅ You forgot to import Operator!

export async function authenticate(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("Unauthorized: No token provided");
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);

        // 🔹 Check Admin login
        if (decoded.adminId) {
            const admin = await Admin.findById(decoded.adminId);
            if (!admin) {
                throw new Error("Unauthorized: Admin not found");
            }
            console.log("Admin authorized:", admin);
            return { admin, role: "admin" }; // 👉 Return admin separately
        }

        // 🔹 Check Operator login
        if (decoded.role === "operator" && decoded.operatorId) {
            const operator = await Operator.findById(decoded.operatorId); // ✅ Directly find Operator
            if (!operator) {
                throw new Error("Unauthorized: Operator not found");
            }
            console.log("Operator authorized:", operator);
            return { operator, role: "operator" }; // 👉 Return operator separately
        }

        throw new Error("Unauthorized: Invalid role in token");

    } catch (error) {
        console.error("Authentication Error:", error.message);
        throw new Error(`Authentication failed: ${error.message}`);
    }
}
