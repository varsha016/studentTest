'use client';
import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function AddedQuestions() {
    const [loading, setLoading] = useState(false);
    const [questionList, setQuestionList] = useState([]);
    const [editMode, setEditMode] = useState({}); // Track edit mode for each question
    const router = useRouter();
    const [message, setMessage] = useState("");



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
                <button
                    onClick={handleSubmitApproval}
                    className="my-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Redirecting..." : "Submit for Approval"}
                </button>
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
                                    <tr key={q._id || index} className="border">
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
                                        </td>
                                        <td className="border p-2 text-white min-w-[200px] break-words whitespace-normal">
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
                                        </td>
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
