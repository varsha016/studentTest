"use client";
import { useState } from "react";
import axios from "axios";

export default function AddOption() {
    const [text, setText] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!text.trim()) {
            setMessage("❌ Option text is required");
            return;
        }

        setLoading(true);

        try {
            const { data } = await axios.post("/api/admin/option", { text, isCorrect });

            setMessage("✅ Option added successfully!");
            setText("");
            setIsCorrect(false);
        } catch (error) {
            setMessage(`❌ ${error.response?.data?.message || "Internal Server Error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
            <h2 className="text-xl font-semibold mb-4">Add Option</h2>

            {message && <p className={`mb-3 text-sm ${message.includes("✅") ? "text-green-500" : "text-red-500"}`}>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Option Text:</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Enter Option..."
                    />
                </div>

                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={isCorrect}
                            onChange={() => setIsCorrect(!isCorrect)}
                            className="mr-2"
                        />
                        Correct Answer
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Option"}
                </button>
            </form>
        </div>
    );
}
