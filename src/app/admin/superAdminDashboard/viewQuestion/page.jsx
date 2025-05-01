// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown, Trash2, Edit2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// // import toast from 'react-hot-toast';
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import UpdateQuestionForm from "../../dashboard/updateQuestion/page";





// const statusList = ["approved", "pending", "rejected", "draft"];
// const QUESTIONS_PER_PAGE = 5;

// const ViewQuestions = () => {
//     const router = useRouter();
//     const [questionsByStatus, setQuestionsByStatus] = useState({});
//     const [openStatus, setOpenStatus] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedStatus, setSelectedStatus] = useState("all");
//     const [page, setPage] = useState(1);

//     useEffect(() => {
//         const fetchAllQuestions = async () => {
//             const token = localStorage.getItem("token");
//             console.log(token);

//             if (!token) return;

//             try {
//                 const allData = {};
//                 for (const status of statusList) {
//                     const res = await axios.get(
//                         `/api/superadmin/allstatusquestions?status=${status}`,
//                         {
//                             headers: {
//                                 Authorization: `Bearer ${token}`,
//                             },
//                         }
//                     );
//                     allData[status] = res.data;
//                 }
//                 setQuestionsByStatus(allData);
//             } catch (err) {
//                 console.error("❌ Failed to fetch questions:", err);
//             }
//         };

//         fetchAllQuestions();
//     }, []);

//     const toggleStatus = (status) => {
//         setOpenStatus((prev) => (prev === status ? null : status));
//         setPage(1);
//     };


//     const handleDelete = async (id) => {
//         console.log(id, "ID");

//         try {
//             await axios.delete(`/api/admin/deletequestion/${id}`);
//             setQuestionsByStatus((prev) => ({
//                 ...prev,
//                 [openStatus]: prev[openStatus].filter((q) => q._id !== id),
//             }));
//             toast.success("Question deleted successfully!", {
//                 position: "top-right",
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//                 theme: "light",
//                 // style: { backgroundColor: "red" }

//             });

//         } catch (err) {
//             console.error("Error deleting question:", err);
//             toast.error("Failed to delete question.");
//         }
//     };



//     const filteredQuestions = (status) => {
//         let questions = questionsByStatus[status] || [];
//         if (searchTerm.trim()) {
//             questions = questions.filter((q) =>
//                 q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }
//         return questions;
//     };

//     const paginatedQuestions = (status) => {
//         const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
//         return filteredQuestions(status).slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
//     };

//     const totalPages = (status) => {
//         return Math.ceil(filteredQuestions(status).length / QUESTIONS_PER_PAGE);
//     };
//     //////////////



//     const handleEdit = (id) => {
//         router.push(`/admin/superAdminDashboard/editQuestion/${id}`);
//     };

//     return (
//         <div className="p-6 max-w-7xl mx-auto text-white ">

//             <h1 className="text-3xl font-bold mb-6 text-center">📚 Super Admin Dashboard</h1>

//             {/* Filters */}
//             <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
//                 <input
//                     type="text"
//                     placeholder="Search question..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="px-4 py-2 w-full md:w-1/2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
//                 />

//                 <select
//                     value={selectedStatus}
//                     onChange={(e) => setSelectedStatus(e.target.value)}
//                     className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
//                 >
//                     <option value="all">All Statuses</option>
//                     {statusList.map((s) => (
//                         <option key={s} value={s} className="text-gray-800">
//                             {s.charAt(0).toUpperCase() + s.slice(1)}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <div className="space-y-4">
//                 {(selectedStatus === "all" ? statusList : [selectedStatus]).map((status) => (
//                     <div key={status} className="border border-gray-200 rounded-xl shadow-md bg-white overflow-hidden">
//                         <button
//                             onClick={() => toggleStatus(status)}
//                             className="w-full flex justify-between items-center p-4 text-left font-semibold text-lg bg-gray-600 hover:bg-gray-700 transition"
//                         >
//                             {status.toUpperCase()}
//                             <motion.div
//                                 animate={{ rotate: openStatus === status ? 180 : 0 }}
//                                 transition={{ duration: 0.3 }}
//                             >
//                                 <ChevronDown />
//                             </motion.div>
//                         </button>

//                         <AnimatePresence initial={false}>
//                             {openStatus === status && (
//                                 <motion.div
//                                     key={status}
//                                     initial={{ height: 0, opacity: 0 }}
//                                     animate={{ height: "auto", opacity: 1 }}
//                                     exit={{ height: 0, opacity: 0 }}
//                                     transition={{ duration: 0.4, ease: "easeInOut" }}
//                                     className="max-h-[500px] overflow-y-auto px-4 py-2 space-y-4"
//                                 >
//                                     {paginatedQuestions(status).map((q, index) => (
//                                         <motion.div
//                                             key={q._id}
//                                             className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white"
//                                             whileHover={{ scale: 1.02 }}
//                                             transition={{ type: "spring", stiffness: 150 }}
//                                         >
//                                             <div className="flex justify-between items-start">
//                                                 <div>

//                                                     <div className="mb-1 text-gray-800 font-medium">
//                                                         <span className="flex">

//                                                             <p className="font-medium text-gray-800">
//                                                                 {index + 1 + (page - 1) * QUESTIONS_PER_PAGE}.
//                                                             </p>
//                                                             <div
//                                                                 className="prose prose-sm max-w-none"
//                                                                 dangerouslySetInnerHTML={{ __html: q.questionText }}
//                                                             />
//                                                         </span>
//                                                     </div>

//                                                     {q.questionType === "mcq" && (

//                                                         // <ul className="list-disc list-inside text-sm text-gray-600">
//                                                         <ul className=" text-sm text-gray-600">

//                                                             {q.options.map((opt, i) => (
//                                                                 <li
//                                                                     key={i}
//                                                                     className={i === q.correctOptionIndex ? "font-bold text-green-600" : ""}
//                                                                 >
//                                                                     <div
//                                                                         className="prose prose-sm max-w-none mt-3"
//                                                                         dangerouslySetInnerHTML={{ __html: opt }}
//                                                                     />
//                                                                     {/* {opt} */}
//                                                                 </li>
//                                                             ))}
//                                                         </ul>



//                                                     )}
//                                                     {/* {q.questionType === "direct" && (
//                                                         <p className="text-sm text-blue-600 mt-1">
//                                                             <strong><div
//                                                                 className="prose prose-sm max-w-none"
//                                                                 dangerouslySetInnerHTML={{ __html: q.directAnswer }}
//                                                             /></strong>
//                                                         </p>
//                                                     )} */}
//                                                     {q.questionType === "direct" && (
//                                                         <p className="text-sm text-blue-600 mt-1">
//                                                             <strong>
//                                                                 <span
//                                                                     className="prose prose-sm max-w-none"
//                                                                     dangerouslySetInnerHTML={{ __html: q.directAnswer }}
//                                                                 />
//                                                             </strong>
//                                                         </p>
//                                                     )}

//                                                     {q.questionType === "truefalse" && (
//                                                         <p className="text-sm text-blue-600 mt-1">
//                                                             <strong><span
//                                                                 className="prose prose-sm max-w-none"
//                                                                 dangerouslySetInnerHTML={{ __html: q.correctAnswer }}
//                                                             /></strong>
//                                                         </p>
//                                                     )}
//                                                     {q.answerExplanation && (
//                                                         <div
//                                                             className="prose prose-sm max-w-none"
//                                                             dangerouslySetInnerHTML={{ __html: q.answerExplanation }}
//                                                         />
//                                                         // <p className="text-xs text-gray-500 mt-2 italic">
//                                                         //     Explanation: {q.answerExplanation}
//                                                         // </p>
//                                                     )}
//                                                 </div>

//                                                 <div className="flex gap-2">
//                                                     <button
//                                                         onClick={() => handleDelete(q._id)}
//                                                         className="p-2 rounded hover:bg-red-100 text-red-600 transition"
//                                                     >
//                                                         <Trash2 size={18} />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleEdit(q._id)}
//                                                         // onClick={() => handleEdit(q)}
//                                                         className="p-2 rounded hover:bg-blue-100 text-blue-600 transition"
//                                                     >
//                                                         <Edit2 size={18} />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </motion.div>
//                                     ))}

//                                     {/* Pagination */}
//                                     {totalPages(status) > 1 && (
//                                         <div className="flex justify-center items-center gap-2 mt-4">
//                                             {[...Array(totalPages(status)).keys()].map((p) => (
//                                                 <button
//                                                     key={p}
//                                                     onClick={() => setPage(p + 1)}
//                                                     className={`px-3 py-1 rounded ${page === p + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
//                                                         } hover:bg-blue-500 transition`}
//                                                 >
//                                                     {p + 1}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </div>
//                 ))}
//             </div>


//         </div>
//     );
// };

// export default ViewQuestions;


"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Trash2, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusList = ["approved", "pending", "rejected", "draft"];
const QUESTIONS_PER_PAGE = 5;

const ViewQuestions = () => {
    const router = useRouter();
    const [questionsByStatus, setQuestionsByStatus] = useState({});
    const [allQuestions, setAllQuestions] = useState([]); // 👈 New: for operator search
    const [openStatus, setOpenStatus] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [operatorSearch, setOperatorSearch] = useState(""); // 👈 New: operator name input
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchAllQuestions = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const allData = {};
                for (const status of statusList) {
                    const res = await axios.get(`/api/superadmin/allstatusquestions?status=${status}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    allData[status] = res.data;
                }
                setQuestionsByStatus(allData);
            } catch (err) {
                console.error("❌ Failed to fetch questions:", err);
            }
        };

        const fetchQuestionsForOperatorSearch = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await axios.get("/api/admin/getallquestion", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAllQuestions(res.data); // 👈 Store all questions for operator search
            } catch (err) {
                console.error("❌ Failed to fetch all questions:", err);
            }
        };

        fetchAllQuestions();
        fetchQuestionsForOperatorSearch(); // 👈 fetch all questions separately
    }, []);

    const toggleStatus = (status) => {
        setOpenStatus((prev) => (prev === status ? null : status));
        setPage(1);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/admin/deletequestion/${id}`);
            setQuestionsByStatus((prev) => ({
                ...prev,
                [openStatus]: prev[openStatus].filter((q) => q._id !== id),
            }));
            toast.success("Question deleted successfully!", { position: "top-right" });
        } catch (err) {
            console.error("Error deleting question:", err);
            toast.error("Failed to delete question.");
        }
    };

    // 🔥 Updated Filter Logic 🔥
    const filteredQuestions = (status) => {
        let questions = questionsByStatus[status] || [];

        // Normal text search
        if (searchTerm.trim()) {
            questions = questions.filter((q) =>
                q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Operator Search
        if (operatorSearch.trim()) {
            const matchingOperatorQuestions = allQuestions.filter(
                (q) => q.operatorName?.toLowerCase().includes(operatorSearch.toLowerCase())
            ).map((q) => q._id);

            questions = questions.filter((q) => matchingOperatorQuestions.includes(q._id));
        }

        return questions;
    };

    const paginatedQuestions = (status) => {
        const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
        return filteredQuestions(status).slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    };

    const totalPages = (status) => {
        return Math.ceil(filteredQuestions(status).length / QUESTIONS_PER_PAGE);
    };

    const handleEdit = (id) => {
        router.push(`/admin/superAdminDashboard/editQuestion/${id}`);
    };

    function stripHtml(html) {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    return (
        <div className="p-6 max-w-7xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6 text-center">📚 Super Admin Dashboard</h1>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search question text..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 w-full md:w-1/2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />

                <input
                    type="text"
                    placeholder="Search by Operator Name..."
                    value={operatorSearch}
                    onChange={(e) => setOperatorSearch(e.target.value)}
                    className="px-4 py-2 w-full md:w-1/2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />

                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    <option value="all">All Statuses</option>
                    {statusList.map((s) => (
                        <option key={s} value={s} className="text-gray-800">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Status Wise */}
            <div className="space-y-4">
                {operatorSearch.trim() ? (
                    // 🔥 If operator name search is active, show directly all matched questions
                    <div className="border border-gray-200 rounded-xl shadow-md bg-white overflow-hidden">
                        <div className="p-4 bg-gray-600 text-white font-semibold text-lg">
                            Operator: {operatorSearch}
                        </div>
                        <div className="px-4 py-2 space-y-4">
                            {allQuestions
                                .filter((q) =>
                                    q.questionText &&
                                    stripHtml(q.questionText).toLowerCase().includes(operatorSearch.toLowerCase())
                                )
                                .map((q, index) => (
                                    <div
                                        key={q._id}
                                        className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="mb-1 text-gray-800 font-medium">
                                                    <span className="flex">
                                                        <p className="font-medium text-gray-800">{index + 1}.</p>
                                                        <div
                                                            className="prose prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: q.questionText }}
                                                        />
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDelete(q._id)}
                                                    className="p-2 rounded hover:bg-red-100 text-red-600 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(q._id)}
                                                    className="p-2 rounded hover:bg-blue-100 text-blue-600 transition"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ) : (
                    // 🔥 Otherwise your normal status-wise display
                    (selectedStatus === "all" ? statusList : [selectedStatus]).map((status) => (
                        <div key={status} className="border border-gray-200 rounded-xl shadow-md bg-white overflow-hidden">
                            <button
                                onClick={() => toggleStatus(status)}
                                className="w-full flex justify-between items-center p-4 text-left font-semibold text-lg bg-gray-600 hover:bg-gray-700 transition"
                            >
                                {status.toUpperCase()}
                                <motion.div
                                    animate={{ rotate: openStatus === status ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown />
                                </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                                {openStatus === status && (
                                    <motion.div
                                        key={status}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="max-h-[500px] overflow-y-auto px-4 py-2 space-y-4"
                                    >
                                        {paginatedQuestions(status).map((q, index) => (
                                            <motion.div
                                                key={q._id}
                                                className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white"
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ type: "spring", stiffness: 150 }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="mb-1 text-gray-800 font-medium">
                                                            <span className="flex">
                                                                <p className="font-medium text-gray-800">
                                                                    {index + 1 + (page - 1) * QUESTIONS_PER_PAGE}.
                                                                </p>
                                                                <div
                                                                    className="prose prose-sm max-w-none"
                                                                    dangerouslySetInnerHTML={{ __html: q.questionText }}
                                                                />
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleDelete(q._id)}
                                                            className="p-2 rounded hover:bg-red-100 text-red-600 transition"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(q._id)}
                                                            className="p-2 rounded hover:bg-blue-100 text-blue-600 transition"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Pagination */}
                                        {totalPages(status) > 1 && (
                                            <div className="flex justify-center items-center gap-2 mt-4">
                                                {[...Array(totalPages(status)).keys()].map((p) => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPage(p + 1)}
                                                        className={`px-3 py-1 rounded ${page === p + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                                                            } hover:bg-blue-500 transition`}
                                                    >
                                                        {p + 1}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ViewQuestions;


