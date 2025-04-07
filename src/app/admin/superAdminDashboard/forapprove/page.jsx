// 'use client';
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function AdminDashboard() {
//     const [questions, setQuestions] = useState([]);
//     const [selectedQuestions, setSelectedQuestions] = useState([]);
//     const [RejectedQuestions, setRejectedQuestions] = useState([]);
//     const [message, setMessage] = useState("");

//     useEffect(() => {
//         const fetchPendingQuestions = async () => {
//             try {
//                 if (typeof window === "undefined") return;

//                 const token = localStorage.getItem("token");
//                 if (!token) {
//                     console.error("No token found. Redirecting to login...");
//                     setMessage("Authentication required. Please log in.");
//                     return;
//                 }

//                 console.log("Using Token:", token);

//                 const response = await axios.get("/api/admin/questionstatus?status=pending", {
//                     headers: {
//                         Authorization: `Bearer ${token.trim()}`,
//                     },
//                 });

//                 console.log("✅ API Response:", response);
//                 console.log("✅ Questions:", response.data.questions);

//                 if (response.data.questions.length === 0) {
//                     setMessage("No pending questions available.");
//                 } else {
//                     setQuestions(response.data.questions);
//                     setMessage(""); // Clear message if questions are available
//                 }
//             } catch (error) {
//                 console.error("❌ Error fetching questions:", error);

//                 if (error.response) {
//                     console.error("❌ API Response Error:", error.response);
//                     console.error("❌ Response Status:", error.response.status);
//                     console.error("❌ Response Data:", error.response.data);

//                     if (error.response.status === 404) {
//                         setMessage("No pending questions found or API route not available.");
//                     } else {
//                         setMessage(`Error: ${error.response.data.message || "Unknown error"}`);
//                     }
//                 } else if (error.request) {
//                     console.error("❌ No response received from API", error.request);
//                     setMessage("Error: No response from the server. Check API connection.");
//                 } else {
//                     console.error("❌ Request setup error", error.message);
//                     setMessage(`Error: ${error.message}`);
//                 }
//             }
//         };

//         fetchPendingQuestions();
//     }, []);




//     const handleCheckboxChange = (id) => {
//         setSelectedQuestions((prev) =>
//             prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
//         );
//     };
//     const handleApproveSelected = async (id = null) => {
//         let questionsToApprove = id ? [id] : selectedQuestions;

//         if (questionsToApprove.length === 0) {
//             alert("No questions selected");
//             return;
//         }

//         try {
//             await axios.put("/api/superadmin/appruvequestions", {
//                 questionIds: questionsToApprove,
//             });

//             alert("Questions Approved Successfully");

//             // ✅ Immediately remove approved questions from the list
//             setQuestions((prev) => prev.filter((q) => !questionsToApprove.includes(q._id)));
//             setSelectedQuestions((prev) => prev.filter((qid) => !questionsToApprove.includes(qid)));

//         } catch (error) {
//             alert(`Error: ${error.response?.data?.error || error.message}`);
//         }
//     };


//     const handleReject = async (id) => {
//         console.log(id, "id");

//         const reason = prompt("Enter rejection reason:");
//         if (!reason) return;

//         try {
//             await axios.put(`/api/superadmin/approverejectquestion/${id}`, {
//                 status: "rejected",
//                 rejectionReason: reason
//             });

//             alert("Question Rejected");

//             // ✅ Immediately remove the rejected question from the list
//             setQuestions((prev) => prev.filter((q) => q._id !== id));
//             setSelectedQuestions((prev) => prev.filter((qid) => qid !== id));

//         } catch (error) {
//             alert(`Error: ${error.response?.data?.message || error.message}`);
//         }
//     };

//     // const handleApproveSelected = async (id = null) => {
//     //     let questionsToApprove = id ? [id] : selectedQuestions;

//     //     if (questionsToApprove.length === 0) {
//     //         alert("No questions selected");
//     //         return;
//     //     }

//     //     try {
//     //         const response = await axios.put("/api/superadmin/appruvequestions", {
//     //             questionIds: questionsToApprove,
//     //         });

//     //         alert("Questions Approved Successfully");

//     //         setQuestions((prev) =>
//     //             prev.filter((q) => !questionsToApprove.includes(q._id))
//     //         );
//     //         setSelectedQuestions([]);
//     //     } catch (error) {
//     //         alert(`Error: ${error.response?.data?.error || error.message}`);
//     //     }
//     // };


//     // const handleReject = async (id) => {
//     //     console.log(id, "id");

//     //     const reason = prompt("Enter rejection reason:");

//     //     if (!reason) return;

//     //     try {
//     //         await axios.put(`/api/superadmin/approverejectquestion/${id}`, {
//     //             status: "rejected", // ✅ Ensure status is sent
//     //             rejectionReason: reason
//     //         });

//     //         alert("Question Rejected");

//     //         // ✅ Update only the rejected question's status instead of filtering it out
//     //         setQuestions((prev) =>
//     //             prev.map((q) =>
//     //                 q._id === id ? { ...q, status: "rejected", rejectionReason: reason } : q
//     //             )
//     //         );
//     //     } catch (error) {
//     //         alert(`Error: ${error.response?.data?.message || error.message}`);
//     //     }
//     // };



//     return (
//         <div className="p-4 text-white">
//             <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

//             {/* Approve Selected Button */}
//             <button
//                 onClick={handleApproveSelected}
//                 className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
//             >
//                 Approve Selected
//             </button>

//             {/* Responsive Table */}
//             <div>
//                 {message ? <p className="text-red-500">{message}</p> : questions.map((q, index) => <p key={index}>{q.question}</p>)}
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="w-full border border-gray-700">
//                     <thead>
//                         <tr className="bg-gray-800">
//                             <th className="border p-2">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) => {
//                                         if (e.target.checked) {
//                                             setSelectedQuestions(questions.map((q) => q._id));
//                                         } else {
//                                             setSelectedQuestions([]);
//                                         }
//                                     }}
//                                     checked={selectedQuestions.length === questions.length}
//                                 />
//                             </th>
//                             <th className="border p-2">Subcategory</th>
//                             <th className="border p-2">Question</th>
//                             <th className="border p-2">Options</th>
//                             <th className="border p-2">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {questions.map((q) => (
//                             <tr key={q._id} className="hover:bg-gray-700">
//                                 <td className="border p-2">
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedQuestions.includes(q._id)}
//                                         onChange={() => handleCheckboxChange(q._id)}
//                                     />
//                                 </td>
//                                 <td className="border p-2">{q.subCategory}</td>
//                                 <td className="border p-2">{q.questionText}</td>
//                                 <td className="border p-2">
//                                     <ul>
//                                         {q.options?.map((op, index) => (
//                                             <li key={index} className="mb-1">{op}</li>
//                                         ))}
//                                     </ul>
//                                 </td>
//                                 <td className="border p-2">
//                                     <button
//                                         onClick={() => handleApproveSelected(q._id)}
//                                         className="bg-green-500 text-white px-4 py-2 rounded"
//                                     >
//                                         Approve
//                                     </button>

//                                     <button
//                                         onClick={() => handleReject(q._id)}
//                                         className="bg-red-500 text-white px-4 py-2 rounded ml-2"
//                                     >
//                                         Reject
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }


'use client';
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchPendingQuestions = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setMessage("Authentication required. Please log in.");
                    return;
                }

                const response = await axios.get("/api/admin/questionstatus?status=pending", {
                    headers: {
                        Authorization: `Bearer ${token.trim()}`,
                    },
                });

                if (response.data.questions.length === 0) {
                    setMessage("No pending questions available.");
                } else {
                    setQuestions(response.data.questions);
                    setMessage("");
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    setMessage("No pending questions found or API route not available.");
                } else {
                    setMessage(`Error: ${error.response?.data?.message || error.message}`);
                }
            }
        };

        fetchPendingQuestions();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedQuestions((prev) =>
            prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
        );
    };

    const handleApproveSelected = async (id = null) => {
        const questionsToApprove = id ? [id] : selectedQuestions;

        if (questionsToApprove.length === 0) {
            alert("No questions selected");
            return;
        }

        try {
            await axios.put("/api/superadmin/appruvequestions", {
                questionIds: questionsToApprove,
            });

            alert("Questions Approved Successfully");

            setQuestions((prev) => prev.filter((q) => !questionsToApprove.includes(q._id)));
            setSelectedQuestions((prev) => prev.filter((qid) => !questionsToApprove.includes(qid)));

        } catch (error) {
            alert(`Error: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleReject = async (id) => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        try {
            await axios.put(`/api/superadmin/approverejectquestion/${id}`, {
                status: "rejected",
                rejectionReason: reason,
            });

            alert("Question Rejected");

            setQuestions((prev) => prev.filter((q) => q._id !== id));
            setSelectedQuestions((prev) => prev.filter((qid) => qid !== id));
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="p-4 text-white">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <button
                onClick={handleApproveSelected}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
            >
                Approve Selected
            </button>

            {message && <p className="text-red-400 mb-4">{message}</p>}

            <div className="overflow-x-auto w-full">
                <table className="min-w-full table-auto border border-gray-700 text-sm">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="p-2 border">
                                <input
                                    type="checkbox"
                                    onChange={(e) =>
                                        setSelectedQuestions(
                                            e.target.checked ? questions.map((q) => q._id) : []
                                        )
                                    }
                                    checked={selectedQuestions.length === questions.length && questions.length > 0}
                                />
                            </th>
                            <th className="p-2 border">Subcategory</th>
                            <th className="p-2 border">Question</th>
                            <th className="p-2 border">Options</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q) => (
                            <tr key={q._id} className="hover:bg-gray-700">
                                <td className="p-2 border">
                                    <input
                                        type="checkbox"
                                        checked={selectedQuestions.includes(q._id)}
                                        onChange={() => handleCheckboxChange(q._id)}
                                    />
                                </td>
                                <td className="p-2 border">{q.subCategory}</td>
                                <td className="p-2 border">{q.questionText}</td>
                                <td className="p-2 border">
                                    <ul className="list-disc pl-4">
                                        {q.options?.map((op, idx) => (
                                            <li key={idx}>{op}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="p-2 border space-x-2">
                                    <button
                                        onClick={() => handleApproveSelected(q._id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(q._id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
