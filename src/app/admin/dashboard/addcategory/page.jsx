"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddCategory() {
    const [titleCategories, setTitleCategories] = useState([]);
    const [selectedTitleCategory, setSelectedTitleCategory] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [message, setMessage] = useState("");
    const [permissions, setPermissions] = useState({});
    const [userEmail, setUserEmail] = useState("");




    useEffect(() => {
        fetchLoggedInUser();
    }, []);

    const fetchLoggedInUser = () => {
        const operator = JSON.parse(localStorage.getItem("operatorInfo")); // Assuming user data is stored in localStorage
        console.log(operator, 'opwer');

        if (operator?.email) {
            setUserEmail(operator.email);
            fetchOperators(operator.email);
        }
    };
    // Function to fetch operator permissions
    const fetchOperators = async (email) => {
        console.log(email, 'email');

        try {
            const response = await axios.get('/api/admin/getoperator');

            console.log(response.data, 'RESPONSE');
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

    // Fetch all Title Categories on page load
    useEffect(() => {
        const fetchTitleCategories = async () => {
            try {
                const res = await axios.get("/api/admin/getalltitlecategory");
                setTitleCategories(res.data);
            } catch (error) {
                console.error("Error fetching title categories:", error);
            }
        };
        fetchTitleCategories();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTitleCategory || !categoryName) {
            setMessage("Please select a title category and enter a category name.");
            return;
        }

        const operatorToken = localStorage.getItem('operatorToken');
        console.log(operatorToken, 'Computer Engineering');

        if (!operatorToken) {
            setMessage("You are not authorized. Please login.");
            return;
        }

        try {
            const res = await axios.post("/api/admin/category", {
                titleCategory: selectedTitleCategory,
                name: categoryName,
            }, {
                headers: {
                    Authorization: `Bearer ${operatorToken}`,
                },
            });

            if (res.status === 201) {
                setMessage("Category added successfully!");
                setCategoryName("");
            } else {
                setMessage(res.data.message);
            }
        } catch (error) {
            console.error("Error adding category:", error);
            setMessage(error.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add Category</h2>

            {message && <p className="text-green-500 mb-2">{message}</p>}

            <form onSubmit={handleSubmit}>
                {/* Title Category Dropdown */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                        Select Title Category:
                    </label>
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedTitleCategory}
                        onChange={(e) => setSelectedTitleCategory(e.target.value)}
                    >
                        <option value="">Choose a Title Category</option>
                        {titleCategories.map((title) => (
                            <option key={title._id} value={title._id}>
                                {title.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category Name Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Category Name:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter category name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                {permissions.addCategory ? (<button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Add Category
                </button>)
                    : (<div className="w-full  text-red-500 px-4 rounded-md bg-red-100  py-2 transition">
                        You are not authorized to add Title
                    </div>)
                }



            </form>
        </div>
    );
}
