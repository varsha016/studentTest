


"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    useEffect(() => {
        if (!userId) {
            setLoading(false); // Stop loading if no userId is found
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/user/getResult?userId=${userId}`);
                const data = await response?.json();

                if (data?.success) {
                    setUserData(data?.data);
                } else {
                    console.error("Failed to fetch data:", data?.message);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleDelete = async (attemptId) => {
        if (!confirm("Are you sure you want to delete this attempt?")) return;
        console.log(attemptId);

        try {
            const response = await axios.delete(`/api/user/deleteAttempt/${attemptId}`);
            if (response.data.success) {
                alert("Attempt deleted successfully!");
                setUserData((prev) => prev.filter((attempt) => attempt._id !== attemptId));
            } else {
                alert(response.data.message || "Failed to delete the attempt.");
            }
        } catch (error) {
            console.error("Error deleting attempt:", error);
            alert(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    if (loading) {
        return <div>Loading your test report...</div>;
    }

    if (!userId) {
        return <div className="text-red-500 text-center mt-10">You are not logged in. Please log in to view your test reports.</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Your Test Reports</h1>

            {userData?.length === 0 ? (
                <p>No test attempts found.</p>
            ) : (
                <div className="space-y-6">
                    {userData?.map((attempt, index) => (
                        <div key={index} className="p-4 border rounded-lg shadow-md">
                            <p><strong>UserId:</strong> {userId}</p>
                            <p><strong>UserName:</strong> {"user@gmail.com"}</p>

                            <h3 className="font-bold mt-4">Questions & Answers:</h3>
                            <ul className="list-disc pl-6">
                                {attempt.responses.map((response, i) => (
                                    <li key={i} className="mt-2">
                                        <p><strong>Q:</strong> {response?.questionId?.questionText || "Question not available"}</p>
                                        <p><strong>Your Answer:</strong> {response?.answer || "Not Answered"}</p>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleDelete(attempt._id)}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete Attempt
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
