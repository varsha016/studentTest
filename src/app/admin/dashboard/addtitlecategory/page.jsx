"use client";
import { useState } from "react";
import axios from "axios";

export default function AddTitleCategory() {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!title.trim()) {
            setMessage("❌ Title is required");
            return;
        }

        setLoading(true);

        try {
            const { data } = await axios.post("/api/admin/titleCategory", { title });

            setMessage("✅ Title category added successfully!");
            setTitle("");
        } catch (error) {
            setMessage(`❌ ${error.response?.data?.message || "Internal Server Error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
            <h2 className="text-xl font-semibold mb-4">Add Title Category</h2>

            {message && <p className={`mb-3 text-sm ${message.includes("✅") ? "text-green-500" : "text-red-500"}`}>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Title Name:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Enter title..."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Title"}
                </button>
            </form>
        </div>
    );
}
