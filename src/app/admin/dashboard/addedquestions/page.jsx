

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PlusIcon, CheckIcon, PencilSquareIcon, } from "@heroicons/react/24/outline";
// import { Spinner } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import UpdateQuestionForm from "../updateQuestion/page";

function AddedQuestions() {

  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [questionToUpdate, setQuestionToUpdate] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch subcategories
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axios.get("/api/admin/getallsubcategory");
        setSubCategories(res?.data?.subcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
  }, []);

  // Helper function to get subcategory name
  const getSubCategoryName = (subCategoryId) => {
    const subCategory = subCategories?.find(sub => sub._id === subCategoryId);
    return subCategory ? subCategory?.name : 'Unknown';
  };

  const handleView = (q) => {
    setSelectedQuestion({ ...q });
    setShowModal(true);
  };

  const handleEdit = (question) => {
    setQuestionToUpdate(question);
    setShowUpdateForm(true);
  };

  const deleteQuestion = async (id) => {
    console.log(id, "Deleting question with ID");
    try {
      const response = await axios.delete(
        `/api/admin/deletequestion/${id}`
      );

      if (response.status === 200) {
        const updatedQuestions = questionList.filter((q) => q._id !== id);
        setQuestionList(updatedQuestions);
        localStorage.setItem(
          "addedQuestions",
          JSON.stringify(updatedQuestions)
        );
        alert("Question deleted successfully!");
        fetchUpdatedQuestions();
      } else {
        alert("Failed to delete question from the database.");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question. Please try again.");
    }
  };

  const handleSubmitApproval = async () => {
    setLoading(true);
    router.push("/admin/dashboard/pageforappruve");
  };

  const fetchUpdatedQuestions = async () => {
    try {
      setQuestionsLoading(true);
      const token = localStorage.getItem("operatorToken");
      const info = localStorage.getItem("operatorInfo");
      const parsedInfo = JSON.parse(info);
      const operatorId = parsedInfo?.operatorId;

      if (!token || !operatorId) {
        setMessage("Authentication token or Operator ID is missing.");
        return;
      }

      const response = await axios.get(
        `/api/admin/getOperatorQuestions/${operatorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setQuestions(response.data.questions);
        localStorage.setItem(
          "submittedQuestions",
          JSON.stringify(response.data.questions.map((q) => q._id))
        );
      } else {
        setMessage("Failed to fetch updated questions.");
      }
    } catch (error) {
      console.error("Error fetching updated questions:", error);
      setMessage("Error fetching updated questions.");
    } finally {
      setQuestionsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdatedQuestions();
  }, []);

  // Pagination calculations
  const totalItems = questions?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = questions?.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (questionsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Added Questions</h2>
        {questions?.length === 0 ? (
          <button
            onClick={() => router.push("/admin/dashboard/addquestion")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Questions
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/admin/dashboard/addquestion")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Question
            </button>
            <button
              onClick={handleSubmitApproval}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  {/* <Spinner className="w-4 h-4" /> */}
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>

                  Redirecting...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Submit for Approval
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {questions?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ClipboardDocumentIcon className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No questions added yet</h3>
          <p className="text-gray-400 mt-2">Add your first question to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SubCategory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems?.map((q, index) => (
                <tr key={q._id || index} className="hover:bg-gray-50 transition-colors duration-150">
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {q.subCategory}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getSubCategoryName(q?.subCategory)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: q.questionText }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleView(q)}
                      disabled={q.status !== "draft"}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${q.status === "draft"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-800 cursor-not-allowed"
                        }`}
                    >
                      View
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {q.status === "draft" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(q)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteQuestion(q._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </div>

            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
                  <span className="font-medium">{totalItems}</span> results
                </p>
              </div>

              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg p-6 w-[90%] md:w-[600px] shadow-2xl relative"
          >
            <h2 className="text-xl font-bold mb-4">Question Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SubCategory:</label>
                <div className="p-2 bg-gray-100 rounded"> {getSubCategoryName(selectedQuestion.subCategory)}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question:</label>
                <div
                  className="prose prose-sm max-w-none p-2 bg-gray-100 rounded"
                  dangerouslySetInnerHTML={{ __html: selectedQuestion.questionText }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Options:</label>
                {selectedQuestion.options?.map((opt, i) => (
                  <div key={i} className="p-2 bg-gray-100 rounded mb-2">
                    {i === selectedQuestion.correctOptionIndex ? (
                      <span className="font-bold text-green-600">✓ {opt}</span>
                    ) : (
                      opt
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Explanation:</label>
                <div className="p-2 bg-gray-100 rounded">{selectedQuestion.answerExplanation}</div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {showUpdateForm && questionToUpdate && (
        <UpdateQuestionForm
          question={questionToUpdate}
          onUpdate={(updatedQuestion) => {
            // Update the local state with the updated question
            setQuestions(questions.map(q =>
              q._id === updatedQuestion._id ? updatedQuestion : q
            ));
            setShowUpdateForm(false);
            setQuestionToUpdate(null);
          }}
          onCancel={() => {
            setShowUpdateForm(false);
            setQuestionToUpdate(null);
          }}
        />
      )}
    </div>
  );
}

export default AddedQuestions;
