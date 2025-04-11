"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TiptapEditor from "@/components/TiptapEditor";

export default function AddQuestion() {
  const [questionData, setQuestionData] = useState({
    subCategory: "",
    questionText: "",
    questionType: "mcq",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    directAnswer: "",
    answerExplanation: "",
  });

  const [subCategories, setSubCategories] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axios.get("/api/admin/getallsubcategory");
        setSubCategories(res.data.subcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({ ...prev, [name]: value }));
  };
  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("operatorToken");
      if (!token) {
        alert("Unauthorized: No token provided. Please login again.");
        return;
      }

      const storedQuestions =
        JSON.parse(localStorage.getItem("addedQuestions")) || [];

      const response = await axios.post("/api/admin/question", questionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.message === "Question added successfully") {
        const newQuestion = response.data.data;
        if (!newQuestion?._id) {
          alert("Error: Missing question ID from response.");
          return;
        }

        storedQuestions.push(newQuestion);
        localStorage.setItem("addedQuestions", JSON.stringify(storedQuestions));

        toast.success("Question added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => router.push("/admin/dashboard/addedquestions"),
        });

        setQuestionData({
          subCategory: "",
          questionText: "",
          questionType: "mcq",
          options: ["", "", "", ""],
          correctOptionIndex: 0,
          directAnswer: "",
          answerExplanation: "",
        });
      } else {
        alert(
          response.data?.message || "Failed to add question. Please try again."
        );
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert(
        error.response?.data?.message ||
        "An error occurred while adding the question."
      );
    } finally {
      setLoading(false);
    }
  };


  // Function to fetch operator permissions
  const [permissions, setPermissions] = useState({});
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    fetchLoggedInUser();
  }, []);
  const fetchLoggedInUser = () => {
    const operator = JSON.parse(localStorage.getItem("operatorInfo"));
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
    } finally {
      setPermissionsLoading(false); // ✅ stop loading after fetch
    }
  };
  console.log(permissions, "permissions");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Question
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SubCategory
              </label>
              <select
                name="subCategory"
                value={questionData.subCategory}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select SubCategory</option>
                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <TiptapEditor
                value={questionData.questionText}
                onChange={(newValue) => {
                  setQuestionData((prev) => ({
                    ...prev,
                    questionText: newValue,
                  }));
                }}
              />
            </div>

            {questionData.questionType === "mcq" ? (
              <div className="space-y-2">
                {questionData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOptionIndex"
                      checked={questionData.correctOptionIndex === index}
                      onChange={() =>
                        setQuestionData((prev) => ({
                          ...prev,
                          correctOptionIndex: index,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Direct Answer
                </label>
                <input
                  type="text"
                  name="directAnswer"
                  placeholder="Enter Direct Answer"
                  value={questionData.directAnswer}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer Explanation
              </label>
              <textarea
                name="answerExplanation"
                placeholder="Provide Explanation for the Answer"
                value={questionData.answerExplanation}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard/addedquestions")}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            {permissionsLoading ? (
              <div className="w-full text-gray-500 px-4 py-2 rounded-md bg-gray-100">
                Checking permissions...
              </div>
            ) : permissions.addQuestion ? (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Question"
                )}
              </button>
            ) : (
              <div className="w-full text-red-500 px-4 py-2 rounded-md bg-red-100 transition">
                You are not authorized to add Category
              </div>
            )}




          </div>
        </form>
      </div>
    </div>
  );
}
