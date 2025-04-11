"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AddSubcategory = () => {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch all categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/admin/getallcategory"); // Ensure this API exists
        console.log("Fetched Categories:", res.data.data);

        setCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!category || !name) {
      setMessage("Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/admin/subCategory", {
        category,
        name,
      }); // Correct API Route & Request Body

      if (res.status === 201) {
        toast.success("Subcategory added successfully!", {
          position: "top-right",
          autoClose: 2000,
          onClose: () => router.push("/admin/dashboard/subcategories")
        });
        setCategory("");
        setName("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add subcategory");
      console.error("Error adding subcategory:", error);
    } finally {
      setLoading(false);
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
          {categories?.map((cat) => (
            <option key={cat._id} value={cat._id} className="">
              {cat.name}
            </option>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-400 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Saving...
            </>
          ) : "Add Subcategory"}
        </button>
      </form>
    </div>
  );
};

export default AddSubcategory;
