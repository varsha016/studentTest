'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";


function AddedQuestions() {
    const [loading, setLoading] = useState(false);
    const [questionList, setQuestionList] = useState([]);
    const [editMode, setEditMode] = useState({}); // Track edit mode for each question
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const handleView = (q) => {
        setSelectedQuestion({ ...q });
        setShowModal(true);
    };


    const handleEdit = (index) => {
        setEditMode((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedQuestions = [...questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
        setQuestions(updatedQuestions);
    };


    const handleUpdate = async (index) => {
        const updatedData = questions[index];

        if (!updatedData._id) {
            alert("Question ID is missing.");
            return;
        }

        const token = localStorage.getItem("operatorToken");
        if (!token) {
            setMessage("Authentication token is missing. Please log in again.");
            return;
        }
        console.log(updatedData, "updatedData");


        try {
            const response = await axios.put(
                `/api/admin/updatesinglequestion/${updatedData._id}`,
                updatedData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                alert("Question updated successfully!");
                // setEditMode((prev) => ({ ...prev, [index]: false }));
                setEditMode((prev) => ({ ...prev, [index]: false }));
                await fetchUpdatedQuestions(); // <== call your API again
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error updating question:", error);
            alert("Failed to update question.");
        }
    };





    // Delete Question

    const deleteQuestion = async (id) => {
        console.log(id, "Deleting question with ID");

        try {
            // First, send a request to delete the question from the API
            const response = await axios.delete(`http://localhost:3000/api/admin/deletequestion/${id}`);

            if (response.status === 200) {
                // Remove from local state and storage if API deletion succeeds
                const updatedQuestions = questionList.filter((q) => q._id !== id);
                setQuestionList(updatedQuestions);
                localStorage.setItem("addedQuestions", JSON.stringify(updatedQuestions));
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


    console.log(questionList, "questionList");
    const handleSubmitApproval = async () => {
        setLoading(true);
        router.push("/admin/dashboard/pageforappruve")
    }

    const [questions, setQuestions] = useState([])
    const fetchUpdatedQuestions = async () => {
        const token = localStorage.getItem("operatorToken");
        const info = localStorage.getItem("operatorInfo"); // or get it however you store it
        const parsedInfo = JSON.parse(info);
        const operatorId = parsedInfo?.operatorId;
        console.log(operatorId, "Operator ID from local storage");

        // Adjust this based on how you store the operator ID
        if (!token || !operatorId) {
            setMessage("Authentication token or Operator ID is missing.");
            return;
        }

        try {
            const response = await axios.get(`/api/admin/getOperatorQuestions/${operatorId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(response.data, "Response data from API");

            if (response.status === 200) {
                setQuestions(response.data.questions);

                localStorage.setItem("submittedQuestions", JSON.stringify(response.data.questions.map(q => q._id)));
            } else {
                setMessage("Failed to fetch updated questions.");
            }
        } catch (error) {
            console.error("Error fetching updated questions:", error);
            setMessage("Error fetching updated questions.");
        }
    };
    useEffect(() => {


        fetchUpdatedQuestions();
    }, []);

    console.log(questions);

    return (



        <div className="text-white">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold my-4">Added Questions</h2>
                {questions?.length === 0 ? <button
                    onClick={() => router.push("/admin/dashboard/addquestion")}
                    className="my-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"

                >
                    Add Questions
                </button> :
                    <button
                        onClick={handleSubmitApproval}
                        className="my-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Redirecting..." : "Submit for Approval"}
                    </button>}

            </div>

            {questions?.length === 0 ? (
                <h1>No Questions Added</h1>
            ) : (
                <div className="max-h-80 overflow-y-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-700 text-white">
                                    <th className="border p-2 min-w-[150px]">SubCategory</th>
                                    <th className="border p-2 min-w-[250px]">Question</th>
                                    <th className="border p-2 min-w-[200px]">Options</th>
                                    <th className="border p-2 min-w-[150px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions?.map((q, index) => (
                                    <tr key={q._id || index} className="border" >
                                        <td className="border p-2 text-white min-w-[150px] break-words whitespace-normal">
                                            {editMode[index] ? (
                                                <input
                                                    type="text"
                                                    name="subCategory"
                                                    value={q.subCategory}
                                                    onChange={(e) => handleChange(e, index)}
                                                    className="text-white p-1 border w-full"
                                                />
                                            ) : (
                                                q.subCategory
                                            )}
                                        </td>
                                        <td className="border p-2 text-white min-w-[250px] break-words whitespace-normal">
                                            {editMode[index] ? (
                                                <input
                                                    type="text"
                                                    name="questionText"
                                                    value={q.questionText}

                                                    onChange={(e) => handleChange(e, index)}
                                                    className="text-white p-1 border w-full"
                                                />
                                            ) : (
                                                q.questionText
                                            )}

                                            {/* {editMode[index] ? (
                                                <input
                                                    type="text"
                                                    name="questionText"
                                                    value={q.questionText}
                                                    onChange={(e) => handleChange(e, index)}
                                                    className="text-white p-1 border w-full"
                                                />
                                            ) : /<\/?[a-z][\s\S]*>/i.test(q.questionText) ? (
                                                // has HTML tags → render as HTML
                                                <div
                                                    className="prose prose-invert max-w-none text-white"
                                                    dangerouslySetInnerHTML={{ __html: q.questionText }}
                                                />
                                            ) : (
                                                // plain text → render directly
                                                <span className="text-white">{q.questionText}</span>
                                            )} */}

                                        </td>
                                        <td className="border p-2 text-white min-w-[200px] break-words whitespace-normal">
                                            <button
                                                onClick={() => handleView(q)}
                                                disabled={q.status !== "draft"}
                                                className={`px-3 py-1 rounded transition duration-300 ${q.status === "draft"
                                                    ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                                                    : "bg-gray-400 cursor-not-allowed"
                                                    }`}
                                            >
                                                View
                                            </button>
                                        </td>

                                        {/* <td className="border p-2 text-white min-w-[200px] break-words whitespace-normal">
                                            {q.options?.length > 0 ? (
                                                q.options.map((option, i) => (
                                                    <div key={i} className="mb-1">
                                                        {editMode[index] ? (
                                                            <input
                                                                type="text"
                                                                name={`options[${i}]`}
                                                                value={option}
                                                                onChange={(e) => {
                                                                    const updatedOptions = [...q.options];
                                                                    updatedOptions[i] = e.target.value;
                                                                    const updatedQuestions = [...questions];
                                                                    updatedQuestions[index].options = updatedOptions;
                                                                    setQuestions(updatedQuestions);
                                                                }}


                                                                className="text-white p-1 border w-full"
                                                            />
                                                        ) : (
                                                            option
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-white">{q.directAnswer}</span>
                                            )}
                                        </td> */}
                                        <td className="border p-2 min-w-[150px] text-center">
                                            {q.status === "draft" ? (
                                                <>
                                                    {editMode[index] ? (
                                                        <button
                                                            onClick={() => handleUpdate(index)}
                                                            className="bg-green-500 text-white p-1 rounded mr-2"
                                                        >
                                                            Update
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEdit(index)}
                                                            className="bg-yellow-500 text-white p-1 rounded mr-2"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteQuestion(q._id || index)}
                                                        className="bg-red-500 text-white p-1 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-gray-400">Locked</span> // or leave it empty
                                            )}
                                        </td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

                        {/* <label className="block mb-2">Question:</label>
                        <input
                            className="w-full p-2 border rounded mb-4 bg-white text-black dark:bg-gray-700 dark:text-white"
                            value={selectedQuestion.questionText}
                            onChange={(e) => setSelectedQuestion({ ...selectedQuestion, questionText: e.target.value })}
                        /> */}
                        <label className="block mb-2">Question:</label>

                        {/<\/?[a-z][\s\S]*>/i.test(selectedQuestion.questionText) ? (
                            <div
                                className="w-full p-2 border rounded mb-4 bg-white text-black dark:bg-gray-700 dark:text-white prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: selectedQuestion.questionText }}
                            />
                        ) : (
                            <input
                                className="w-full p-2 border rounded mb-4 bg-white text-black dark:bg-gray-700 dark:text-white"
                                value={selectedQuestion.questionText}
                                onChange={(e) =>
                                    setSelectedQuestion({ ...selectedQuestion, questionText: e.target.value })
                                }
                            />
                        )}


                        <label className="block mb-2">Options:</label>
                        {selectedQuestion.options?.map((opt, i) => (
                            <input
                                key={i}
                                className="w-full p-2 border rounded mb-2 bg-white text-black dark:bg-gray-700 dark:text-white"
                                value={opt}
                                onChange={(e) => {
                                    const updated = [...selectedQuestion.options];
                                    updated[i] = e.target.value;
                                    setSelectedQuestion({ ...selectedQuestion, options: updated });
                                }}
                            />
                        ))}

                        <label className="block mb-2">Explanation:</label>
                        <textarea
                            rows="3"
                            className="w-full p-2 border rounded mb-4 bg-white text-black dark:bg-gray-700 dark:text-white"
                            value={selectedQuestion.answerExplanation || ""}
                            onChange={(e) => setSelectedQuestion({ ...selectedQuestion, answerExplanation: e.target.value })}
                        />

                        <div className="flex justify-end gap-4">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem("operatorToken");
                                        const res = await axios.put(
                                            `/api/admin/updatesinglequestion/${selectedQuestion._id}`,
                                            selectedQuestion,
                                            { headers: { Authorization: `Bearer ${token}` } }
                                        );
                                        if (res.data.success) {
                                            alert("Updated successfully!");
                                            setShowModal(false);
                                            await fetchUpdatedQuestions();
                                        } else {
                                            alert("Update failed.");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert("Error while updating.");
                                    }
                                }}
                            >
                                Update
                            </motion.button>
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-white"
                        >
                            &times;
                        </button>
                    </motion.div>
                </div>
            )}

        </div>

    );
}

export default AddedQuestions;





