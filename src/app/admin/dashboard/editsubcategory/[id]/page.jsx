"use client";

import { useState, useEffect, use } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function EditSubcategory({ params }) {
  const { id } = use(params);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return; // Add guard clause for missing id

    const fetchData = async () => {
      try {
        console.log("Fetching subcategory data for ID:", id);
        const [categoriesRes, subcategoryRes] = await Promise.all([
          axios.get("/api/admin/getallcategory").then((res) => {
            // Handle both array and object responses
            const data = res.data?.data || res.data || [];
            return Array.isArray(data) ? data : [];
          }),
          axios.get(`/api/admin/subCategory/${id}`).catch((err) => {
            console.error(
              "API Error details:",
              err.response?.data || err.message
            );
            throw err;
          }),
        ]);

        console.log("Received data:", {
          categories: categoriesRes,
          subcategory: subcategoryRes.data,
        });
        setCategories(categoriesRes);
        setCategory(
          subcategoryRes.data.category?._id || subcategoryRes.data.category
        );
        setName(subcategoryRes.data.name);
      } catch (error) {
        console.error("Error:", error);
        toast.error(`Error loading data: ${error.message}`);
        setCategories([]); // Ensure it's always an array
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`/api/admin/subCategory/${id}`, { category, name });
      toast.success("Subcategory updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        onClose: () => router.push("/admin/dashboard/subcategories"),
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update subcategory"
      );
      console.error("Error updating subcategory:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Subcategory</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Category</option>
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Subcategory Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

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
          ) : (
            "Update Subcategory"
          )}
        </button>
      </form>
    </div>
  );
}
