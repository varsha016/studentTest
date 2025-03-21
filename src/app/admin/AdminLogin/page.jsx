// "use client";
// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// const AdminLogin = () => {
//     const [email, setEmail] = useState("admin@gmail.com");
//     const [password, setPassword] = useState("123");
//     const [error, setError] = useState("");
//     const router = useRouter();
//     const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api';
//     console.log(baseURL, 'baseURL');

//     const handleAdminLogin = async (e) => {
//         e.preventDefault();
//         setError("");

//         try {
//             const res = await axios.post(`${baseURL}/admin/login`, { email, password });
//             const data = res.data;

//             console.log(data, "Admin login response");

//             localStorage.setItem("token", data.token);
//             localStorage.setItem("role", data.admin.role);

//             router.replace("/admin/dashboard");
//         } catch (error) {
//             setError(error.response?.data?.message || "Login failed");
//         }
//     };




//     return (

//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//             <form onSubmit={handleAdminLogin} className="bg-white p-6 rounded shadow-md w-96">
//                 <h2 className="text-center text-2xl mb-4 font-semibold">Admin Login</h2>
//                 {/* {error && <p className="text-red-500">{error}</p>} */}
//                 <input
//                     type="text"
//                     placeholder="Username"
//                     className="w-full p-2 mb-4 border rounded"
//                     onChange={(e) => setEmail(e.target.value)}
//                 // required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     className="w-full p-2 mb-4 border rounded"
//                     onChange={(e) => setPassword(e.target.value)}
//                 // required
//                 />
//                 <button className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700">
//                     Login
//                 </button>
//             </form>
//         </div>



//     );
// }
// export default AdminLogin



"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AdminLogin = () => {
    const [email, setEmail] = useState("admin@gmail.com");
    const [password, setPassword] = useState("123");
    const [error, setError] = useState("");
    const router = useRouter();
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000/api';
    console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);



    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post(`${baseURL}/admin/login`, { email, password });
            const data = res.data;

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.admin.role);

            router.replace("/admin/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-500">
            <form
                onSubmit={handleAdminLogin}
                className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full">
                <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Admin Login</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={email}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;