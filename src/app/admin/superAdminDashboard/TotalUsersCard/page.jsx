'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const TotalUsersCard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/user/getallusers");
            setUsers(response.data.users); // assuming response is { users: [...] }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 p-4">
            {loading && (
                <div className="flex justify-center items-center space-x-2">
                    <div className="w-5 h-5 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading Users...</span>
                </div>
            )}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Users Card */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="rounded-2xl shadow-xl p-6 bg-white transition hover:scale-105 border-l-8 border-purple-500"
                    >
                        <h2 className="text-xl font-semibold text-purple-600">Total Users</h2>
                        <p className="text-4xl font-bold text-gray-800 mt-2">{users.length}</p>
                        <p className="text-sm text-gray-500 mt-1">Total registered users</p>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default TotalUsersCard;
