// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function UserLogin() {
//     const router = useRouter();
//     const [formData, setFormData] = useState({ email: "user@gmail.com", password: "123" });
//     const [error, setError] = useState("");

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError("");

//         try {
//             const { data } = await axios.post("/api/user/login", { username: formData.email, password: formData.password });
//             console.log(data, "data");

//             localStorage.setItem("token", data.userToken);
//             localStorage.setItem("userId", data.user._id);
//             localStorage.setItem("userName", data.user.username);
//             localStorage.setItem("role", data.user.role)
//             window.dispatchEvent(new Event("storage"));
//             router.replace(data.role === "admin" ? "/admin/dashboard" : "/user/homepage");
//         } catch (err) {
//             setError(err.response?.data?.message || "Invalid credentials");
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
//                 <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

//                 {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

//                 <form onSubmit={handleLogin} className="space-y-4">
//                     <div>
//                         <input
//                             type="email"
//                             name="email"
//                             placeholder="Email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <input
//                             type="password"
//                             name="password"
//                             placeholder="Password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
//                     >
//                         Login
//                     </button>
//                 </form>

//                 <p className="text-sm text-gray-600 text-center mt-4">
//                     Don't have an account?{" "}
//                     <a href="/user/register" className="text-blue-500 hover:underline">
//                         Sign up
//                     </a>
//                 </p>
//             </div>
//         </div>
//     );
// }





"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UserLogin() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "Test",
        lastName: "User",
        username: "user@gmail.com",
        password: "123",
    });
    const [error, setError] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMessage, setForgotMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        console.log(formData, "formData");


        try {
            const { data } = await axios.post("/api/user/login", { name: formData.name, lastName: formData.lastName, username: formData.username, password: formData.password });
            console.log(data, "data");

            localStorage.setItem("token", data.userToken);
            localStorage.setItem("userId", data.user._id);
            localStorage.setItem("userName", data.user.username);
            // localStorage.setItem("role", data.user.role);
            localStorage.setItem("name", data.user.name);
            localStorage.setItem("lastName", data.user.lastName);

            window.dispatchEvent(new Event("storage"));
            // router.replace(data.role === "admin" ? "/admin/dashboard" : "/user/homepage");
            router.replace("/user/homepage");

        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        }
    };

    // const handleForgotPassword = async () => {
    //     try {
    //         const { data } = await axios.post("/api/user/forgot-password", { email: forgotEmail });
    //         setForgotMessage(data.message || "Check your email for reset instructions.");
    //     } catch (err) {
    //         setForgotMessage(err.response?.data?.message || "Something went wrong.");
    //     }
    // };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="First Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />

                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />

                    <input
                        type="email"
                        name="username"
                        placeholder="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Login
                    </button>
                </form>

                <div className="text-sm text-center mt-3">
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setShowForgotPassword(true)}
                    >
                        Forgot Password?
                    </button>
                </div>

                <p className="text-sm text-gray-600 text-center mt-4">
                    Don't have an account?{" "}
                    <a href="/user/register" className="text-blue-500 hover:underline">
                        Sign up
                    </a>
                </p>

                {/* Forgot Password Modal */}
                {showForgotPassword && (
                    <div className="mt-6 p-4 bg-gray-100 border rounded-md">
                        <h3 className="text-md font-semibold mb-2">Reset your password</h3>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="w-full px-4 py-2 mb-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                        <button
                            // onClick={handleForgotPassword}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Send Reset Link
                        </button>
                        {forgotMessage && (
                            <p className="text-sm mt-2 text-center text-gray-700">{forgotMessage}</p>
                        )}
                        <button
                            onClick={() => {
                                setShowForgotPassword(false);
                                setForgotMessage("");
                            }}
                            className="text-xs text-red-500 mt-3 hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
