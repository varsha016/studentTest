"use client";

import axios from "axios";
import { useState, useEffect } from "react";

const SectionForm = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    subCategoryId: "",
    name: "",
    questionIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchApprovedQuestions(formData.subCategoryId);
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const { data } = await axios.get("/api/admin/getallcategory");
      // Handle both array and object responses
      const categoriesData = data?.categories || data?.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    try {
      setSubCategoriesLoading(true);
      const { data } = await axios.get(`/api/admin/getallsubcategory?id=${categoryId}`);
      // Handle both array and object responses
      const subCategoriesData = data?.subcategories || data?.data || data || [];
      setSubCategories(Array.isArray(subCategoriesData) ? subCategoriesData : []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategories([]);
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  const fetchApprovedQuestions = async (subCategoryId) => {
    console.log("Fetching approved questions for subcategory ID:", subCategoryId);

    if (!subCategoryId) {
      setQuestions([]);
      return;
    }

    try {
      setQuestionsLoading(true);
      const response = await axios.get(
        `/api/admin/fetchApprovedQuestions?subCategoryId=${subCategoryId}`
      );
      console.log("Approved Questions:", response.data.questions);
      setQuestions(response.data?.questions || []);
    } catch (error) {
      console.error("Error fetching approved questions:", error);
      setQuestions([]);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "categoryId") {
      fetchSubCategories(value);
    } else if (name === "subCategoryId") {
      fetchApprovedQuestions(value);
    }
  };

  const handleQuestionSelect = (questionId) => {
    setFormData((prev) => {
      const updatedQuestionIds = prev.questionIds.includes(questionId)
        ? prev.questionIds.filter((id) => id !== questionId)
        : [...prev.questionIds, questionId];

      if (updatedQuestionIds.length > 50) {
        setMessage("You can only select up to 50 questions per section.");
        return prev;
      }
      setMessage("");
      return { ...prev, questionIds: updatedQuestionIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.questionIds.length === 0) {
      setMessage("Please select at least one question.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post("/api/admin/addsection", formData);
      setMessage(data.message);
      setFormData({
        categoryId: "",
        subCategoryId: "",
        name: "",
        questionIds: [],
      });
    } catch (error) {
      console.error("Error creating section:", error);
      setMessage(error.response?.data?.message || "Failed to create section");
    } finally {
      setLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* <pre>{JSON.stringify(questions, null, 2)}</pre> */}
      {message && <p className="text-center mt-4 text-green-500">{message}</p>}
      <h2 className="text-2xl text-center font-bold mb-4">Create Section</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            disabled={categoriesLoading || categories.length === 0}
          >
            <option value="">
              {categoriesLoading
                ? "Loading categories..."
                : categories.length === 0
                  ? "No categories available"
                  : "Select Category"}
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">SubCategory</label>
          <select
            name="subCategoryId"
            value={formData.subCategoryId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            disabled={subCategoriesLoading || subCategories.length === 0 || !formData.categoryId}
          >
            <option value="">
              {!formData.categoryId
                ? "Select a category first"
                : subCategoriesLoading
                  ? "Loading subcategories..."
                  : subCategories.length === 0
                    ? "No subcategories available"
                    : "Select SubCategory"}
            </option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Section Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">
            Select Questions (Max: 50)
          </label>
          <div className="grid grid-cols-2 gap-2 border p-2 rounded min-h-[200px]">
            {questionsLoading ? (
              <div className="col-span-2 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : questions.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-gray-500">
                {formData.subCategoryId
                  ? "No approved questions available for this subcategory"
                  : "Select a subcategory to view questions"}
              </div>
            ) : (
              currentQuestions.map((q) => (
                <label key={q._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.questionIds.includes(q._id)}
                    onChange={() => handleQuestionSelect(q._id)}
                  />
                  <span className="truncate"><div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: q.questionText }}
                  />

                  </span>
                </label>
              ))
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 rounded  transition"
          disabled={loading}
        >
          {loading ? "Creating Section..." : "Create Section"}
        </button>
      </form>
    </div>
  );
};

export default SectionForm;
