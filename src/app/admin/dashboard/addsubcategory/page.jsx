"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const AddSubcategory = () => {
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");

    // Fetch all categories for dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/api/admin/getallcategory"); // Ensure this API exists
                console.log("Fetched Categories:", res.data);

                setCategories(res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category || !name) {
            setMessage("Please fill all fields.");
            return;
        }

        try {
            const res = await axios.post("/api/admin/subCategory", { category, name }); // ✅ Correct API Route & Request Body

            if (res.status === 201) {
                setMessage("Subcategory added successfully!");
                setCategory("");
                setName("");
            }
        } catch (error) {
            console.error("Error adding subcategory:", error);
            setMessage(error.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add Subcategory</h2>

            {message && <p className="mb-4 text-red-500">{message}</p>}

            <form onSubmit={handleSubmit}>
                {/* Category Dropdown */}
                <label className="block mb-2">Select Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                >
                    <option value="">Choose a category</option>
                    {categories?.categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                    {/* {Array.isArray(categories) && categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))} */}

                </select>

                {/* Subcategory Name Input */}
                <label className="block mb-2">Subcategory Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Enter subcategory name"
                />

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Add Subcategory
                </button>
            </form>
        </div>
    );
};

export default AddSubcategory;
