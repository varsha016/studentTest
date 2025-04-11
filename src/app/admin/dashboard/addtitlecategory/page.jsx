"use client";
import { useState, useEffect } from "react";
import axios from "axios";


export default function AddTitleCategory() {
    const [title, setTitle] = useState("");
    const [permissions, setPermissions] = useState({});
    const [userEmail, setUserEmail] = useState("");
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

    // Function to fetch operator permissions
    useEffect(() => {
        fetchLoggedInUser();
    }, []);
    const fetchLoggedInUser = () => {
        const operator = JSON.parse(localStorage.getItem("operatorInfo")); // Assuming user data is stored in localStorage
        if (operator?.email) {
            setUserEmail(operator.email);
            fetchOperators(operator.email);
        }
    };

    const fetchOperators = async (email) => {
        try {
            const response = await axios.get('/api/admin/getoperator');

            if (response.data.length > 0) {
                const loggedInOperator = response.data.find(op => op.email === email);
                console.log("loggedInOperator", loggedInOperator);

                if (loggedInOperator) {
                    setPermissions(loggedInOperator?.permissionId || {});
                }
            }
        } catch (err) {
            setMessage(`❌ ${err.response?.data?.message || err.message}`);
        }
    };
    // const [titleCategories, setTitleCategories] = useState([]);
    // const fetchTitleCategoriesByOperator = async () => {
    //     const token = localStorage.getItem("operatorToken");
    //     const operatorInfo = JSON.parse(localStorage.getItem("operatorInfo") || "{}");
    //     const operatorId = operatorInfo?.operatorId;
    //     console.log(operatorId, "Operator ID from local storage");

    //     if (!operatorId) return console.error("Operator ID not found");
    //     console.log(`/api/admin/titlewithoperatorid/${operatorId}`, "API endpoint");

    //     try {
    //         const response = await axios.get(`/api/admin/titlewithoperatorid/${operatorId}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         console.log(response, "response.data");

    //         setTitleCategories(response.data);
    //     } catch (error) {
    //         console.error("Error fetching title categories:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchTitleCategoriesByOperator();
    // }, []);

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
            {/* <pre>{JSON.stringify(titleCategories, null, 2)}</pre> */}
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
                {permissions.addTitleCategory ? (
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Title"}
                    </button>
                ) : (
                    <div className="w-full text-red-500 px-4 py-2 rounded-md bg-red-100">
                        You are not authorized to add Title
                    </div>
                )}


            </form>

        </div>
    );
}
