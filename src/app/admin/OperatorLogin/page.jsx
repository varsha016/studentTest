"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OperatorLoginPage() {
    const [formData, setFormData] = useState({ email: "varsha@gmail.com", password: "123" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Add loading state
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const baseURL = "http://localhost:3000/api";
    // const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true); // Set loading to true

        try {
            const response = await axios.post(`${baseURL}/admin/operatorlogin`, formData);
            console.log(response, "response");

            // Save token and user info in localStorage
            localStorage.setItem("operatorToken", response.data.result.token);
            localStorage.setItem("operatorInfo", JSON.stringify(response.data.result));

            // Show success toast
            toast.success("Login successful!");

            // Redirect to dashboard
            setTimeout(() => {
                router.push("/admin/dashboard");
            }, 2000);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Login failed. Please try again.");

            // Show error toast
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
            <ToastContainer /> {/* Toast container for notifications */}
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md md:max-w-lg lg:max-w-xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Operator Login</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="text-right mt-2 text-blue-500 cursor-pointer" onClick={() => router.push("./forgotpassword")}>
                    Forgot Password?
                </p>
            </div>
        </div>
    );
}
