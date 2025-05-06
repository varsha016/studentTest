
'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";

function ApprovalPage() {
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    const [filter, setFilter] = useState("all");

    const fetchUpdatedQuestions = async () => {
        const token = localStorage.getItem("operatorToken");
        const info = localStorage.getItem("operatorInfo");
        const parsedInfo = JSON.parse(info);
        const operatorId = parsedInfo?.operatorId;
        setLoading(true)

        if (!token || !operatorId) {
            setMessage("Authentication token or Operator ID is missing.");
            return;
        }
        try {
            const response = await axios.get(`/api/admin/getOperatorQuestions/${operatorId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setLoading(false)
                const allQuestions = response.data.questions;

                setQuestions(allQuestions); // ✅ Save full list always

                // ✅ Apply filter from state
                setFilteredQuestions(
                    allQuestions.filter((q) =>
                        filter === "all" ? true : q.status === filter
                    )
                );

                localStorage.setItem("submittedQuestions", JSON.stringify(allQuestions.map(q => q._id)));
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

    useEffect(() => {
        // Update selectAll state based on current selection
        const selectableQuestions = filteredQuestions.filter(
            q => q.status !== "pending" &&
                q.status !== "approved" &&
                q.status !== "rejected"
        );
        const allSelectableSelected = selectableQuestions.length > 0 &&
            selectableQuestions.every(q => selectedQuestions.includes(q._id));
        setSelectAll(allSelectableSelected);
    }, [selectedQuestions, filteredQuestions]);

    useEffect(() => {
        // Reset selectAll when filter changes
        setSelectAll(false);
    }, [filter]);

    const handleFilterChange = (status) => {
        setFilter(status);
        if (status === "all") {
            setFilteredQuestions(questions);
        } else {
            setFilteredQuestions(questions.filter(q => q.status === status));
        }
    };

    const handleSelectQuestion = (id) => {
        setSelectedQuestions((prev) =>
            prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedQuestions([]);
        } else {
            // Only select questions that are not pending, approved, or rejected
            const selectableQuestions = filteredQuestions.filter(
                q => q.status !== "pending" &&
                    q.status !== "approved" &&
                    q.status !== "rejected"
            );
            setSelectedQuestions(selectableQuestions.map(q => q._id));
        }
        setSelectAll(!selectAll);
    };

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

                // ✅ Update full list
                const updatedQuestions = questions.map((q) =>
                    selectedQuestions.includes(q._id)
                        ? { ...q, status: "pending" }
                        : q
                );
                setQuestions(updatedQuestions);

                // ✅ Re-apply current filter
                setFilteredQuestions(
                    updatedQuestions.filter((q) =>
                        filter === "all" ? true : q.status === filter
                    )
                );

                localStorage.setItem("submittedQuestions", JSON.stringify(selectedQuestions));
                setSelectedQuestions([]);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error sending questions for approval:", error);
            setMessage("Failed to send selected questions for approval.");
        }

        setLoading(false);
    };

    return (
        <div className="p-4 text-white max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Submit Questions for Approval </h2>
                <button
                    onClick={handleSelectAll}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    {selectAll ? "Deselect All" : "Select All"}
                </button>
            </div>

            {message && <p className="mb-4 text-yellow-400">{message}</p>}

            {/* Filter Section */}
            <div className="flex gap-2 mb-4">
                {["all", "pending", "approved", "rejected", "draft"].map((status) => (
                    <button
                        key={status}
                        onClick={() => handleFilterChange(status)}
                        className={`px-4 py-2 rounded ${filter === status ? "bg-blue-500 text-white" : "bg-gray-600 hover:bg-gray-700 text-gray-300"
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>


            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
                </div>
            ) : filteredQuestions?.length === 0 ? (
                <p className="text-center text-gray-400">No questions found.</p>
            ) : (
                <div className="max-h-96 overflow-y-auto border border-gray-600 rounded-lg">
                    <table className="min-w-full table-auto text-sm text-gray-700 ">
                        <thead className="bg-gray-200 sticky top-0">
                            <tr className="border">
                                <th className=" p-2">Select</th>
                                <th className=" p-2">Question</th>
                                <th className=" p-2">Status</th>
                                <th className=" p-2">Created At</th>
                                <th className=" p-2">Rejection Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuestions?.map((q) => (
                                <tr key={q._id} className=" bg-gray-100 text-gray-700 ">
                                    <td className="border p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedQuestions.includes(q._id)}
                                            onChange={() => handleSelectQuestion(q._id)}
                                            disabled={
                                                q.status === "pending" ||
                                                q.status === "approved" ||
                                                q.status === "rejected"
                                            }
                                            className="text-gray-700 cursor-pointer disabled:opacity-50"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <div
                                            className="prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: q.questionText }}
                                        />
                                    </td>
                                    <td className="border p-2">
                                        {q.status === "approved"
                                            ? "✅ Approved"
                                            : q.status === "rejected"
                                                ? "❌ Rejected"
                                                : q.status === "pending"
                                                    ? "⏳ Pending"
                                                    : "📄 Draft"}
                                    </td>
                                    <td className="border p-2">
                                        {new Date(q.createdAt).toLocaleString()}
                                    </td>
                                    <td className="border text-gray-700 p-2">{q.rejectionReason || ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            <button
                onClick={handleSubmitApproval}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
                disabled={loading}
            >
                {loading ? "Submitting..." : "Submit for Approval"}
            </button>
        </div>
    );
}

export default ApprovalPage;


// 'use client';

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function ApprovalPage() {
//     const [questions, setQuestions] = useState([]);
//     const [filteredQuestions, setFilteredQuestions] = useState([]);
//     const [selectedQuestions, setSelectedQuestions] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");
//     const [selectAll, setSelectAll] = useState(false);
//     const [filter, setFilter] = useState("all");

//     const fetchUpdatedQuestions = async () => {
//         const token = localStorage.getItem("operatorToken");
//         const info = localStorage.getItem("operatorInfo");
//         const parsedInfo = JSON.parse(info);
//         const operatorId = parsedInfo?.operatorId;
//         setLoading(true)

//         if (!token || !operatorId) {
//             setMessage("Authentication token or Operator ID is missing.");
//             return;
//         }
//         try {
//             const response = await axios.get(`/api/admin/getOperatorQuestions/${operatorId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             if (response.status === 200) {
//                 setLoading(false)
//                 const allQuestions = response.data.questions;

//                 setQuestions(allQuestions); // ✅ Save full list always

//                 // ✅ Apply filter from state
//                 setFilteredQuestions(
//                     allQuestions.filter((q) =>
//                         filter === "all" ? true : q.status === filter
//                     )
//                 );

//                 localStorage.setItem("submittedQuestions", JSON.stringify(allQuestions.map(q => q._id)));
//             } else {
//                 setMessage("Failed to fetch updated questions.");
//             }
//         } catch (error) {
//             console.error("Error fetching updated questions:", error);
//             setMessage("Error fetching updated questions.");
//         }
//     };


//     useEffect(() => {
//         fetchUpdatedQuestions();
//     }, []);

//     const handleFilterChange = (status) => {
//         setFilter(status);
//         if (status === "all") {
//             setFilteredQuestions(questions);
//         } else {
//             setFilteredQuestions(questions.filter(q => q.status === status));
//         }
//     };

//     const handleSelectQuestion = (id) => {
//         setSelectedQuestions((prev) =>
//             prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
//         );
//     };

//     const handleSelectAll = () => {
//         if (selectAll) {
//             setSelectedQuestions([]);
//         } else {
//             setSelectedQuestions(filteredQuestions.map(q => q._id));
//         }
//         setSelectAll(!selectAll);
//     };

//     // const handleSubmitApproval = async () => {
//     //     if (selectedQuestions.length === 0) {
//     //         setMessage("No questions selected for approval.");
//     //         return;
//     //     }

//     //     setLoading(true);
//     //     setMessage("");

//     //     const token = localStorage.getItem("operatorToken");

//     //     if (!token) {
//     //         setMessage("Authentication token is missing. Please log in again.");
//     //         setLoading(false);
//     //         return;
//     //     }

//     //     try {
//     //         const response = await axios.post(
//     //             "/api/admin/sendForApproval",
//     //             { questionIds: selectedQuestions },
//     //             { headers: { Authorization: `Bearer ${token}` } }
//     //         );

//     //         if (response.status === 200) {
//     //             setMessage("Selected questions sent for approval successfully.");
//     //             fetchUpdatedQuestions();
//     //             localStorage.setItem("submittedQuestions", JSON.stringify(selectedQuestions));
//     //             setSelectedQuestions([]);
//     //         } else {
//     //             setMessage(response.data.message);
//     //         }
//     //     } catch (error) {
//     //         console.error("Error sending questions for approval:", error);
//     //         setMessage("Failed to send selected questions for approval.");
//     //     }

//     //     setLoading(false);
//     // };
//     console.log(questions, " Questions");
//     console.log(filteredQuestions, "Filtered Questions");
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
//                 { questionIds: selectedQuestions },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             if (response.status === 200) {
//                 setMessage("Selected questions sent for approval successfully.");

//                 // ✅ Update full list
//                 const updatedQuestions = questions.map((q) =>
//                     selectedQuestions.includes(q._id)
//                         ? { ...q, status: "pending" }
//                         : q
//                 );
//                 setQuestions(updatedQuestions);

//                 // ✅ Re-apply current filter
//                 setFilteredQuestions(
//                     updatedQuestions.filter((q) =>
//                         filter === "all" ? true : q.status === filter
//                     )
//                 );

//                 localStorage.setItem("submittedQuestions", JSON.stringify(selectedQuestions));
//                 setSelectedQuestions([]);
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
//             <div className="flex flex-wrap justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Submit Questions for Approval </h2>
//                 <button
//                     onClick={handleSelectAll}
//                     className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//                 >
//                     {selectAll ? "Deselect All" : "Select All"}
//                 </button>
//             </div>

//             {message && <p className="mb-4 text-yellow-400">{message}</p>}

//             {/* Filter Section */}
//             <div className="flex gap-2 mb-4">
//                 {["all", "pending", "approved", "rejected", "draft"].map((status) => (
//                     <button
//                         key={status}
//                         onClick={() => handleFilterChange(status)}
//                         className={`px-4 py-2 rounded ${filter === status ? "bg-blue-500 text-white" : "bg-gray-600 hover:bg-gray-700 text-gray-300"
//                             }`}
//                     >
//                         {status.charAt(0).toUpperCase() + status.slice(1)}
//                     </button>
//                 ))}
//             </div>


//             {loading ? (
//                 <div className="flex justify-center items-center h-40">
//                     <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
//                 </div>
//             ) : filteredQuestions?.length === 0 ? (
//                 <p className="text-center text-gray-400">No questions found.</p>
//             ) : (
//                 <div className="max-h-96 overflow-y-auto border border-gray-600 rounded-lg">
//                     <table className="min-w-full table-auto text-sm text-gray-700 ">
//                         <thead className="bg-gray-200 sticky top-0">
//                             <tr className="border">
//                                 <th className=" p-2">Select</th>
//                                 <th className=" p-2">Question</th>
//                                 <th className=" p-2">Status</th>
//                                 <th className=" p-2">Created At</th>
//                                 <th className=" p-2">Rejection Reason</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredQuestions?.map((q) => (
//                                 <tr key={q._id} className=" bg-gray-100 text-gray-700 ">
//                                     <td className="border p-2 text-center">
//                                         <input
//                                             type="checkbox"
//                                             checked={selectedQuestions.includes(q._id)}
//                                             onChange={() => handleSelectQuestion(q._id)}
//                                             disabled={
//                                                 q.status === "pending" ||
//                                                 q.status === "approved" ||
//                                                 q.status === "rejected"
//                                             }
//                                             className="text-gray-700 cursor-pointer disabled:opacity-50"
//                                         />
//                                     </td>
//                                     <td className="border p-2">
//                                         <div
//                                             className="prose prose-sm max-w-none"
//                                             dangerouslySetInnerHTML={{ __html: q.questionText }}
//                                         />
//                                     </td>
//                                     <td className="border p-2">
//                                         {q.status === "approved"
//                                             ? "✅ Approved"
//                                             : q.status === "rejected"
//                                                 ? "❌ Rejected"
//                                                 : q.status === "pending"
//                                                     ? "⏳ Pending"
//                                                     : "📄 Draft"}
//                                     </td>
//                                     <td className="border p-2">
//                                         {new Date(q.createdAt).toLocaleString()}
//                                     </td>
//                                     <td className="border text-gray-700 p-2">{q.rejectionReason || ""}</td>
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
