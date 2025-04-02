

// 'use client';

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function ApprovalPage() {
//     const [questions, setQuestions] = useState([]);
//     const [selectedQuestions, setSelectedQuestions] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");
//     const [selectAll, setSelectAll] = useState(false);

//     // Load questions from localStorage
//     useEffect(() => {
//         const storedQuestions = JSON.parse(localStorage.getItem("addedQuestions")) || [];
//         setQuestions(storedQuestions);
//     }, []);

//     // Handle selecting individual questions
//     const handleSelectQuestion = (id) => {
//         setSelectedQuestions((prev) =>
//             prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
//         );
//     };

//     // Handle select all toggle
//     const handleSelectAll = () => {
//         if (selectAll) {
//             setSelectedQuestions([]);
//         } else {
//             setSelectedQuestions(questions.map((q) => q._id));
//         }
//         setSelectAll(!selectAll);
//     };


//     const handleSubmitApproval = async () => {
//         if (selectedQuestions.length === 0) {
//             setMessage("No questions selected for approval.");
//             return;
//         }

//         setLoading(true);
//         setMessage("");

//         const token = localStorage.getItem("operatorToken");

//         if (!token) {
//             setMessage("Authentication token is missing. Please log in again.");
//             setLoading(false);
//             return;
//         }

//         try {
//             const response = await axios.post(
//                 "/api/admin/sendForApproval",
//                 {
//                     questionIds: selectedQuestions, // Send only selected questions
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     }
//                 }
//             );
//             if (response.status === 200) {
//                 setMessage("Selected questions sent for approval successfully.");
//                 setQuestions(prevQuestions =>
//                     prevQuestions.map(q =>
//                         selectedQuestions.includes(q._id)
//                             ? { ...q, status: "pending" }
//                             : q
//                     )
//                 );
//                 setSelectedQuestions([]); // Clear selection after submission
//             } else {
//                 setMessage(response.data.message);
//             }


//         } catch (error) {
//             console.error("Error sending questions for approval:", error);
//             setMessage("Failed to send selected questions for approval.");
//         }

//         setLoading(false);
//     };


//     return (
//         <div className="p-4 text-white max-w-6xl mx-auto">
//             {/* <pre>{JSON.stringify(questions, null, 2)}</pre> */}
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Submit Questions for Approval</h2>
//                 <button
//                     onClick={handleSelectAll}
//                     className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//                 >
//                     {selectAll ? "Deselect All" : "Select All"}
//                 </button>
//             </div>

//             {message && <p className="mb-4 text-yellow-400">{message}</p>}

//             {questions.length === 0 ? (
//                 <p className="text-center">No questions available.</p>
//             ) : (
//                 <div className="max-h-96 overflow-y-auto border border-gray-600 rounded-md">
//                     <table className="min-w-full table-auto text-sm">
//                         <thead className="bg-gray-800 sticky top-0">
//                             <tr>
//                                 <th className="border p-2">Select</th>
//                                 <th className="border p-2">Question</th>
//                                 <th className="border p-2">Status</th>
//                                 <th className="border p-2">Created At</th>
//                                 <th className="border p-2">Q selected</th>
//                                 <th className="border p-2">RejectionReason</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {questions.map((q) => (
//                                 <tr key={q._id} className="border bg-gray-700 hover:bg-gray-600">
//                                     <td className="border p-2 text-center">
//                                         <input
//                                             type="checkbox"
//                                             checked={selectedQuestions.includes(q._id)}
//                                             onChange={() => handleSelectQuestion(q._id)}
//                                         />
//                                     </td>
//                                     <td className="border p-2">{q.questionText}</td>
//                                     <td className="border p-2">{q.status}</td>
//                                     <td className="border p-2">{new Date(q.createdAt).toLocaleString()}</td>
//                                     <td className="border p-2 text-center">
//                                         <input
//                                             type="checkbox"
//                                             checked={selectedQuestions.includes(q._id)}
//                                             onChange={() => handleSelectQuestion(q._id)}
//                                             disabled={q.status === "pending"} // Disable if status is pending
//                                             className="cursor-pointer disabled:opacity-50"
//                                         />
//                                     </td>
//                                     <td className="border p-2">{q.rejectionReason}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             <button
//                 onClick={handleSubmitApproval}
//                 className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
//                 disabled={loading}
//             >
//                 {loading ? "Submitting..." : "Submit for Approval"}
//             </button>
//         </div>
//     );
// }

// export default ApprovalPage;

'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";

function ApprovalPage() {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectAll, setSelectAll] = useState(false);

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
    useEffect(() => {


        fetchUpdatedQuestions();
    }, []);


    // useEffect(() => {
    //     const fetchUpdatedQuestions = async () => {
    //         const token = localStorage.getItem("operatorToken");
    //         if (!token) {
    //             setMessage("Authentication token is missing. Please log in again.");
    //             return;
    //         }

    //         try {
    //             const response = await axios.get("/api/admin/getOperatorQuestions", {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             });

    //             if (response.status === 200) {
    //                 setQuestions(response.data.questions); // Update questions with latest statuses
    //                 localStorage.setItem("submittedQuestions", JSON.stringify(response.data.questions.map(q => q._id))); // Store submitted questions
    //             } else {
    //                 setMessage("Failed to fetch updated questions.");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching updated questions:", error);
    //             setMessage("Error fetching updated questions.");
    //         }
    //     };

    //     fetchUpdatedQuestions();
    // }, []);

    // Handle individual selection
    const handleSelectQuestion = (id) => {
        setSelectedQuestions((prev) =>
            prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
        );
    };

    // Handle select all toggle
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedQuestions([]);
        } else {
            setSelectedQuestions(questions.filter(q => q.status !== "pending" && q.status !== "approved" && q.status !== "rejected").map(q => q._id));
        }
        setSelectAll(!selectAll);
    };

    // Handle approval submission
    const handleSubmitApproval = async () => {
        if (selectedQuestions.length === 0) {
            setMessage("No questions selected for approval.");
            return;
        }

        setLoading(true);
        setMessage("");

        const token = localStorage.getItem("operatorToken");

        if (!token) {
            setMessage("Authentication token is missing. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "/api/admin/sendForApproval",
                { questionIds: selectedQuestions },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setMessage("Selected questions sent for approval successfully.");

                // Fetch latest data immediately after submission
                fetchUpdatedQuestions();

                // Store submitted questions in localStorage
                localStorage.setItem("submittedQuestions", JSON.stringify(selectedQuestions));

                setSelectedQuestions([]); // Clear selection
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error sending questions for approval:", error);
            setMessage("Failed to send selected questions for approval.");
        }

        setLoading(false);
    };

    // const handleSubmitApproval = async () => {
    //     if (selectedQuestions.length === 0) {
    //         setMessage("No questions selected for approval.");
    //         return;
    //     }

    //     setLoading(true);
    //     setMessage("");

    //     const token = localStorage.getItem("operatorToken");
    //     if (!token) {
    //         setMessage("Authentication token is missing. Please log in again.");
    //         setLoading(false);
    //         return;
    //     }

    //     try {
    //         const response = await axios.post(
    //             "/api/admin/sendForApproval",
    //             { questionIds: selectedQuestions },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         if (response.status === 200) {
    //             setMessage("Selected questions sent for approval successfully.");

    //             // Update local state and disable checkboxes
    //             setQuestions(prevQuestions =>
    //                 prevQuestions.map(q =>
    //                     selectedQuestions.includes(q._id)
    //                         ? { ...q, status: "pending" }
    //                         : q
    //                 )
    //             );
    //             localStorage.setItem("submittedQuestions", JSON.stringify([...selectedQuestions]));

    //             setSelectedQuestions([]); // Clear selection after submission
    //         } else {
    //             setMessage(response.data.message);
    //         }
    //     } catch (error) {
    //         console.error("Error sending questions for approval:", error);
    //         setMessage("Failed to send selected questions for approval.");
    //     }

    //     setLoading(false);
    // };
    console.log(questions);

    return (
        <div className="p-4 text-white max-w-6xl mx-auto">
            <pre>{JSON.stringify(selectedQuestions, null, 2)}</pre>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Submit Questions for Approval</h2>
                <button
                    onClick={handleSelectAll}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    {selectAll ? "Deselect All" : "Select All"}
                </button>
            </div>

            {message && <p className="mb-4 text-yellow-400">{message}</p>}

            {questions.length === 0 ? (
                <p className="text-center">No questions available.</p>
            ) : (
                <div className="max-h-96 overflow-y-auto border border-gray-600 rounded-md">
                    <table className="min-w-full table-auto text-sm">
                        <thead className="bg-gray-800 sticky top-0">
                            <tr>
                                <th className="border p-2">Select</th>
                                <th className="border p-2">Question</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Created At</th>
                                <th className="border p-2">Rejection Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q) => (
                                <tr key={q._id} className="border bg-gray-700 hover:bg-gray-600">
                                    <td className="border p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedQuestions.includes(q._id)}
                                            onChange={() => handleSelectQuestion(q._id)}
                                            disabled={q.status === "pending" || q.status === "approved" || q.status === "rejected"} // Disable if already submitted
                                            className="cursor-pointer disabled:opacity-50"
                                        />
                                    </td>


                                    <td className="border p-2">{q.questionText}</td>
                                    <td className="border p-2">
                                        {q.status === "approved" ? "✅ Approved" : q.status === "rejected" ? "❌ Rejected" : "⏳ Pending"}
                                    </td>
                                    <td className="border p-2">{new Date(q.createdAt).toLocaleString()}</td>
                                    <td className="border p-2">{q.rejectionReason || ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* {selectedQuestions.length > 0 && ( */}
            <button
                onClick={handleSubmitApproval}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
                disabled={loading}
            >
                {loading ? "Submitting..." : "Submit for Approval"}
            </button>
            {/* // )} */}

        </div>
    );
}

export default ApprovalPage;
