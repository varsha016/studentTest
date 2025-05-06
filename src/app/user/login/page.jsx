"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: "user@gmail.com",
        password: "123",
    });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Invalid credentials");
                toast.error(data.message || "Login failed!");
                return;
            }

            // Save token to localStorage
            localStorage.setItem("userId", data.user._id);
            localStorage.setItem("name", data.user.name);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("userToken", data.userToken);
            // localStorage.setItem("userId", response.data.userId);
            window.dispatchEvent(new Event("user-auth-changed")); // ✅ must be after localStorage set


            toast.success("Login successful! Redirecting...");
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (err) {
            setError("An error occurred. Please try again.");
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
            <p className="text-right mt-2 text-blue-500 cursor-pointer" onClick={() => router.push("./ForgotPasswordPage")}>
                Forgot Password?
            </p>

        </div>
    );
}