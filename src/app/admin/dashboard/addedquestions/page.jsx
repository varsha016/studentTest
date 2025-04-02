'use client';
import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function AddedQuestions() {
    const [loading, setLoading] = useState(false);
    const [questionList, setQuestionList] = useState([]);
    const [editMode, setEditMode] = useState({}); // Track edit mode for each question
    const router = useRouter();
    // Load questions from localStorage
    useEffect(() => {
        const storedQuestions = JSON.parse(localStorage.getItem("addedQuestions")) || [];
        setQuestionList(storedQuestions);
    }, []);



    // Toggle Edit Mode
    const handleEdit = (index) => {
        setEditMode((prev) => ({ ...prev, [index]: !prev[index] }));
    };
    const handleUpdate = async (index) => {
        const updatedData = questionList[index];

        if (!updatedData._id) {
            alert("Question ID is missing.");
            return;
        }

        try {
            const response = await axios.put(`/api/admin/updatesinglequestion/${updatedData._id}`, updatedData);

            if (response.data.success) {
                alert("Question updated successfully!");
                console.log(response.data.question);

                // Update the state with the new data
                const updatedQuestions = [...questionList];
                updatedQuestions[index] = response.data.question; // Update with new data from API
                setQuestionList(updatedQuestions);

                // Update LocalStorage
                // localStorage.setItem("addedQuestions", JSON.stringify(updatedQuestions));

                // Exit edit mode
                setEditMode((prev) => ({ ...prev, [index]: false }));
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error updating question:", error);
            alert("Failed to update question.");
        }
    };



    // Handle Input Change
    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedQuestions = [...questionList];
        updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
        setQuestionList(updatedQuestions);
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
    useEffect(() => {
        const fetchUpdatedQuestions = async () => {
            const token = localStorage.getItem("operatorToken");
            if (!token) {
                setMessage("Authentication token is missing. Please log in again.");
                return;
            }

            try {
                const response = await axios.get("/api/admin/getOperatorQuestions", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setQuestions(response.data.questions);

                    // Store submitted questions in localStorage
                    localStorage.setItem("submittedQuestions", JSON.stringify(response.data.questions.map(q => q._id)));
                } else {
                    setMessage("Failed to fetch updated questions.");
                }
            } catch (error) {
                console.error("Error fetching updated questions:", error);
                setMessage("Error fetching updated questions.");
            }
        };

        fetchUpdatedQuestions();
    }, []);
    console.log(questions);

    return (

        <div className="text-white">
            {/* <pre>{JSON.stringify(questions,/ null, 2)}</pre> */}
            <div className="flex justify-between">
                <h2 className="text-xl font-bold my-4">Added Questions</h2>
                <button
                    onClick={handleSubmitApproval}
                    className="my-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? " redirect to Submit page" : "Submit for Approval"}
                </button>
            </div>

            {questionList.length === 0 ? (

                <h1>No Questions Added</h1>
                // <div className="flex justify-center items-center h-screen">
                //     <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                // </div>

            ) : (
                <div className="max-h-80 overflow-y-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border p-2">SubCategory</th>
                                <th className="border p-2">Question</th>
                                <th className="border p-2">Options</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionList.map((q, index) => (
                                <tr key={q._id || index} className="border">
                                    <td className="border p-2 text-white">
                                        {editMode[index] ? (
                                            <input
                                                type="text"
                                                name="subCategory"
                                                value={q.subCategory}
                                                onChange={(e) => handleChange(e, index)}
                                                className="text-white p-1 border"
                                            />
                                        ) : (
                                            q.subCategory
                                        )}
                                    </td>
                                    <td className="border p-2 text-white">
                                        {editMode[index] ? (
                                            <input
                                                type="text"
                                                name="questionText"
                                                value={q.questionText}
                                                onChange={(e) => handleChange(e, index)}
                                                className="text-white p-1 border"
                                            />
                                        ) : (
                                            q.questionText
                                        )}
                                    </td>
                                    <td className="border p-2 text-white">
                                        {q.options?.length > 0 ? (
                                            q.options.map((option, i) => (
                                                <div key={i}>
                                                    {editMode[index] ? (
                                                        <input
                                                            type="text"
                                                            name={`options[${i}]`}
                                                            value={option}
                                                            onChange={(e) => {
                                                                const updatedOptions = [...q.options];
                                                                updatedOptions[i] = e.target.value;
                                                                handleChange({ target: { name: 'options', value: updatedOptions } }, index);
                                                            }}
                                                            className="text-white p-1 border"
                                                        />
                                                    ) : (
                                                        option
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-white">{q.directAnswer}</span>
                                        )}
                                    </td>
                                    <td className="border p-2">
                                        {editMode[index] ? (
                                            <button
                                                onClick={() => handleUpdate(index)}
                                                className="bg-green-500 text-white p-1 rounded mr-2"
                                                disabled={questions.some(item => item._id === q._id)}
                                            >
                                                Update
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(index)}
                                                className="bg-yellow-500 text-white p-1 rounded mr-2"
                                                disabled={questions.some(item => item._id === q._id)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteQuestion(q._id || index)}
                                            className="bg-red-500 text-white p-1 rounded"
                                            disabled={questions.some(item => item._id === q._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>

                                    {/* <td className="border p-2">
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
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>

    );
}

export default AddedQuestions;


// 'use client';
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// function AddedQuestions() {
//     const [loading, setLoading] = useState(false);
//     const [questionList, setQuestionList] = useState([]);
//     const [editMode, setEditMode] = useState({});
//     const router = useRouter();

//     useEffect(() => {
//         const storedQuestions = JSON.parse(localStorage.getItem("addedQuestions")) || [];
//         setQuestionList(storedQuestions);
//     }, []);

//     const handleEdit = (index) => {
//         setEditMode((prev) => ({ ...prev, [index]: !prev[index] }));
//     };

//     const handleUpdate = async (index) => {
//         const updatedData = questionList[index];
//         if (!updatedData._id) {
//             alert("Question ID is missing.");
//             return;
//         }
//         try {
//             const response = await axios.put(`/api/admin/updatesinglequestion/${updatedData._id}`, updatedData);
//             if (response.data.success) {
//                 alert("Question updated successfully!");
//                 const updatedQuestions = [...questionList];
//                 updatedQuestions[index] = response.data.question;
//                 setQuestionList(updatedQuestions);
//                 setEditMode((prev) => ({ ...prev, [index]: false }));
//             } else {
//                 alert(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error updating question:", error);
//             alert("Failed to update question.");
//         }
//     };

//     const handleChange = (e, index) => {
//         const { name, value } = e.target;
//         const updatedQuestions = [...questionList];
//         updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
//         setQuestionList(updatedQuestions);
//     };

//     const deleteQuestion = async (id) => {
//         try {
//             const response = await axios.delete(`/api/admin/deletequestion/${id}`);
//             if (response.status === 200) {
//                 const updatedQuestions = questionList.filter((q) => q._id !== id);
//                 setQuestionList(updatedQuestions);
//                 localStorage.setItem("addedQuestions", JSON.stringify(updatedQuestions));
//                 alert("Question deleted successfully!");
//             } else {
//                 alert("Failed to delete question.");
//             }
//         } catch (error) {
//             console.error("Error deleting question:", error);
//             alert("Failed to delete question. Please try again.");
//         }
//     };

//     const handleSubmitApproval = () => {
//         setLoading(true);
//         router.push("/admin/dashboard/pageforappruve");
//     };

//     return (
//         <div className="text-white p-4 max-w-5xl mx-auto">
//             <div className="flex flex-col md:flex-row justify-between items-center">
//                 <h2 className="text-xl font-bold mb-4 md:mb-0">Added Questions</h2>
//                 <button
//                     onClick={handleSubmitApproval}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//                     disabled={loading}
//                 >
//                     {loading ? "Redirecting..." : "Submit for Approval"}
//                 </button>
//             </div>

//             {questionList.length === 0 ? (
//                 <h1 className="text-center mt-6">No Questions Added</h1>
//             ) : (
//                 <div className="overflow-x-auto max-h-[32em] overflow-y-auto mt-4">
//                     <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
//                         <thead>
//                             <tr className="bg-gray-800 text-white">
//                                 <th className="border p-2">SubCategory</th>
//                                 <th className="border p-2">Question</th>
//                                 <th className="border p-2">Options</th>
//                                 <th className="border p-2">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {questionList.map((q, index) => (
//                                 <tr key={q._id || index} className="border bg-gray-900 text-white">
//                                     <td className="border p-2">
//                                         {editMode[index] ? (
//                                             <input
//                                                 type="text"
//                                                 name="subCategory"
//                                                 value={q.subCategory}
//                                                 onChange={(e) => handleChange(e, index)}
//                                                 className="p-1 border bg-gray-700 text-white w-full"
//                                             />
//                                         ) : (
//                                             q.subCategory
//                                         )}
//                                     </td>
//                                     <td className="border p-2">
//                                         {editMode[index] ? (
//                                             <input
//                                                 type="text"
//                                                 name="questionText"
//                                                 value={q.questionText}
//                                                 onChange={(e) => handleChange(e, index)}
//                                                 className="p-1 border bg-gray-700 text-white w-full"
//                                             />
//                                         ) : (
//                                             q.questionText
//                                         )}
//                                     </td>
//                                     <td className="border p-2">
//                                         {q.options?.length > 0 ? (
//                                             q.options.map((option, i) => (
//                                                 <div key={i} className="mb-1">
//                                                     {editMode[index] ? (
//                                                         <input
//                                                             type="text"
//                                                             value={option}
//                                                             onChange={(e) => {
//                                                                 const updatedOptions = [...q.options];
//                                                                 updatedOptions[i] = e.target.value;
//                                                                 handleChange({ target: { name: 'options', value: updatedOptions } }, index);
//                                                             }}
//                                                             className="p-1 border bg-gray-700 text-white w-full"
//                                                         />
//                                                     ) : (
//                                                         option
//                                                     )}
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <span>{q.directAnswer}</span>
//                                         )}
//                                     </td>
//                                     {/* <td className="border p-2 flex flex-col md:flex-row gap-2">
//                                         {editMode[index] ? (
//                                             <button
//                                                 onClick={() => handleUpdate(index)}
//                                                 className="bg-green-500 text-white p-1 rounded"
//                                             >
//                                                 Update
//                                             </button>
//                                         ) : (
//                                             <button
//                                                 onClick={() => handleEdit(index)}
//                                                 className="bg-yellow-500 text-white p-1 rounded"
//                                             >
//                                                 Edit
//                                             </button>
//                                         )}
//                                         <button
//                                             onClick={() => deleteQuestion(q._id || index)}
//                                             className="bg-red-500 text-white p-1 rounded"
//                                         >
//                                             Delete
//                                         </button>
//                                     </td> */}
//                                     <td className="border p-2">
//                                         {editMode[index] ? (
//                                             <button
//                                                 onClick={() => handleUpdate(index)}
//                                                 className="bg-green-500 text-white p-1 rounded mr-2"
//                                                 disabled={questions.some(item => item._id === q._id)}
//                                             >
//                                                 Update
//                                             </button>
//                                         ) : (
//                                             <button
//                                                 onClick={() => handleEdit(index)}
//                                                 className="bg-yellow-500 text-white p-1 rounded mr-2"
//                                                 disabled={questions.some(item => item._id === q._id)}
//                                             >
//                                                 Edit
//                                             </button>
//                                         )}
//                                         <button
//                                             onClick={() => deleteQuestion(q._id || index)}
//                                             className="bg-red-500 text-white p-1 rounded"
//                                             disabled={questions.some(item => item._id === q._id)}
//                                         >
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default AddedQuestions;
