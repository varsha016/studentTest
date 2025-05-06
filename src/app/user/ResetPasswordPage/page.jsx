// "use client";

// import { useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";

// export default function ResetPasswordPage() {
//     const [password, setPassword] = useState("");
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     // const token = searchParams.get("userToken");



//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem("userToken");
//         console.log(token, "userToken");
//         try {
//             await axios.post("/api/user/resetPassword", { token, password });
//             toast.success("Password reset successful!");
//             setTimeout(() => router.push("/login"), 2000);
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Reset failed");
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
//             <ToastContainer />
//             <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="password"
//                     placeholder="Enter new password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full px-3 py-2 border rounded mb-4"
//                     required
//                 />
//                 <button
//                     type="submit"
//                     className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//                 >
//                     Reset Password
//                 </button>
//             </form>
//         </div>
//     );
// }


"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token"); // Get token from URL, not localStorage

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error("Invalid reset link");
            return;
        }

        try {
            await axios.post("/api/user/resetPassword", { token, password });
            toast.success("Password reset successful!");
            setTimeout(() => router.push("/user/login"), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded mb-4"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}