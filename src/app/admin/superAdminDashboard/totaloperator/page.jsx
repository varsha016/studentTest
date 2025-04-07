'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const TotalOperatorCard = () => {
    const [operators, setOperators] = useState([]);
    const [loggedInOperators, setLoggedInOperators] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOperators();
        fetchLoggedInOperators();
    }, []);

    const fetchOperators = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/admin/getoperator");
            setOperators(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLoggedInOperators = async () => {
        try {
            const response = await axios.get("/api/admin/loggedinoperators");
            console.log(response);

            setLoggedInOperators(response.data.count);
        } catch (err) {
            console.error("Error fetching logged-in operators:", err.message);
        }
    };

    return (
        <div className="space-y-4 p-4">
            {loading && <p>Loading data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Operators Card */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="rounded-2xl shadow-xl p-6 bg-white transition hover:scale-105 border-l-8 border-blue-500"
                    >
                        <h2 className="text-xl font-semibold text-blue-600">Total Operators</h2>
                        <p className="text-4xl font-bold text-gray-800 mt-2">{operators.length}</p>
                        <p className="text-sm text-gray-500 mt-1">Total registered operators</p>
                    </motion.div>

                    {/* Logged-in Operators Card */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="rounded-2xl shadow-xl p-6 bg-white transition hover:scale-105 border-l-8 border-green-500"
                    >
                        <h2 className="text-xl font-semibold text-green-600">Logged-in Operators</h2>
                        <p className="text-4xl font-bold text-gray-800 mt-2">{loggedInOperators}</p>
                        <p className="text-sm text-gray-500 mt-1">Currently active operators</p>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default TotalOperatorCard;
