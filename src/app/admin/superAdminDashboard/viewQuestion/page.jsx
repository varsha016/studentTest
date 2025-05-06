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
//     const [operators, setOperators] = useState([]);
//     const [operatorSearchTerm, setOperatorSearchTerm] = useState("");
//     const [selectedOperatorId, setSelectedOperatorId] = useState("");
//     const router = useRouter();
//     const [questionsByStatus, setQuestionsByStatus] = useState({});
//     const [openStatus, setOpenStatus] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedStatus, setSelectedStatus] = useState("all");
//     const [page, setPage] = useState(1);

//     useEffect(() => {
//         const fetchOperators = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const res = await axios.get("/api/admin/getoperator", {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 console.log(res.data, "res");

//                 setOperators(res.data || []);
//             } catch (err) {
//                 console.error("Failed to fetch operators:", err);
//             }
//         };
//         fetchOperators();
//     }, []);
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
//             {/* <pre>{JSON.stringify(questionsByStatus, null, 2)}</pre> */}
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
//                 <div className="relative w-full md:w-1/3">
//                     <input
//                         type="text"
//                         placeholder="Search by operator name..."
//                         value={operatorSearchTerm}
//                         onChange={(e) => {
//                             setOperatorSearchTerm(e.target.value);
//                             setSelectedOperatorId("");
//                         }}
//                         className="px-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
//                     />
//                     {operatorSearchTerm && (
//                         <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
//                             {operators
//                                 .filter(op =>
//                                     op.name.toLowerCase().includes(operatorSearchTerm.toLowerCase())
//                                 )
//                                 .map(op => (
//                                     <div
//                                         key={op._id}
//                                         className="p-2 hover:bg-blue-100 cursor-pointer text-gray-800"
//                                         onClick={() => {
//                                             setSelectedOperatorId(op._id);
//                                             setOperatorSearchTerm(op.name);
//                                         }}
//                                     >
//                                         {op.name}
//                                     </div>
//                                 ))
//                             }
//                         </div>
//                     )}
//                 </div>
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




// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown, Trash2, Edit2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const statusList = ["approved", "pending", "rejected", "draft"];
// const QUESTIONS_PER_PAGE = 5;

// const ViewQuestions = () => {
//     const router = useRouter();
//     const [allQuestions, setAllQuestions] = useState([]);
//     const [filteredQuestions, setFilteredQuestions] = useState([]);
//     const [openStatus, setOpenStatus] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedStatus, setSelectedStatus] = useState("all");
//     const [page, setPage] = useState(1);
//     const [operators, setOperators] = useState([]);
//     const [operatorSearchTerm, setOperatorSearchTerm] = useState("");
//     const [selectedOperator, setSelectedOperator] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchAllQuestions = async () => {
//             const token = localStorage.getItem("token");
//             if (!token) return;

//             try {
//                 setLoading(true);
//                 const res = await axios.get("/api/admin/getallquestion", {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 console.log(res.data, "questionres");

//                 setAllQuestions(res.data || []);
//                 setFilteredQuestions(res.data || []);
//             } catch (err) {
//                 console.error("❌ Failed to fetch questions:", err);
//                 toast.error("Failed to load questions");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const fetchOperators = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const res = await axios.get("/api/admin/getoperator", {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setOperators(res.data || []);
//             } catch (err) {
//                 console.error("Failed to fetch operators:", err);
//             }
//         };

//         fetchAllQuestions();
//         fetchOperators();
//     }, []);

//     useEffect(() => {
//         let results = allQuestions;

//         // Filter by operator
//         if (selectedOperator) {
//             results = results.filter(q => q.createdBy === selectedOperator._id);
//         }

//         // Filter by status
//         if (selectedStatus !== "all") {
//             results = results.filter(q => q.status === selectedStatus);
//         }

//         // Filter by question text
//         if (searchTerm.trim()) {
//             results = results.filter(q =>
//                 q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }

//         setFilteredQuestions(results);
//         setPage(1); // Reset to first page when filters change
//     }, [allQuestions, selectedOperator, selectedStatus, searchTerm]);

//     const toggleStatus = (status) => {
//         setOpenStatus((prev) => (prev === status ? null : status));
//         setPage(1);
//     };

//     const paginatedQuestions = () => {
//         const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
//         return filteredQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
//     };

//     const totalPages = () => {
//         return Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`/api/admin/deletequestion/${id}`);
//             setAllQuestions(prev => prev.filter(q => q._id !== id));
//             toast.success("Question deleted successfully!");
//         } catch (err) {
//             console.error("Error deleting question:", err);
//             toast.error("Failed to delete question.");
//         }
//     };

//     const handleEdit = (id) => {
//         router.push(`/admin/superAdminDashboard/editQuestion/${id}`);
//     };

//     if (loading) {
//         return <div className="text-center p-8">Loading questions...</div>;
//     }

//     return (
//         <div className="p-6 max-w-7xl mx-auto text-white">
//             <h1 className="text-3xl font-bold mb-6 text-center">📚 Super Admin Dashboard</h1>

//             {/* Filters */}
//             <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
//                 <input
//                     type="text"
//                     placeholder="Search question text..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="px-4 py-2 w-full md:w-1/3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
//                 />

//                 <div className="relative w-full md:w-1/3">
//                     <input
//                         type="text"
//                         placeholder="Search by operator name..."
//                         value={selectedOperator ? selectedOperator.name : operatorSearchTerm}
//                         onChange={(e) => {
//                             setOperatorSearchTerm(e.target.value);
//                             setSelectedOperator(null);
//                         }}
//                         className="px-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
//                     />
//                     {operatorSearchTerm && !selectedOperator && (
//                         <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
//                             {operators
//                                 .filter(op =>
//                                     op.name.toLowerCase().includes(operatorSearchTerm.toLowerCase())
//                                 )
//                                 .map(op => (
//                                     <div
//                                         key={op._id}
//                                         className="p-2 hover:bg-blue-100 cursor-pointer text-gray-800"
//                                         onClick={() => {
//                                             setSelectedOperator(op);
//                                             setOperatorSearchTerm("");
//                                         }}
//                                     >
//                                         {op.name}
//                                     </div>
//                                 ))
//                             }
//                         </div>
//                     )}
//                 </div>

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

//             {selectedOperator && (
//                 <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded inline-block">
//                     Showing questions by: {selectedOperator.name}
//                     <button
//                         onClick={() => {
//                             setSelectedOperator(null);
//                             setOperatorSearchTerm("");
//                         }}
//                         className="ml-2 text-red-600"
//                     >
//                         × Clear
//                     </button>
//                 </div>
//             )}

//             {filteredQuestions.length === 0 ? (
//                 <div className="text-center p-8 text-gray-500">
//                     No questions found matching your criteria
//                 </div>
//             ) : (
//                 <div className="space-y-4">
//                     <div className="border border-gray-200 rounded-xl shadow-md bg-white overflow-hidden">
//                         <div className="w-full p-4 text-left font-semibold text-lg bg-gray-600">
//                             {selectedStatus === "all" ? "ALL QUESTIONS" : selectedStatus.toUpperCase()}
//                         </div>

//                         <div className="max-h-[500px] overflow-y-auto px-4 py-2 space-y-4">
//                             {paginatedQuestions().map((q, index) => (
//                                 <motion.div
//                                     key={q._id}
//                                     className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white"
//                                     whileHover={{ scale: 1.02 }}
//                                     transition={{ type: "spring", stiffness: 150 }}
//                                 >
//                                     <div className="flex justify-between items-start">
//                                         <div>
//                                             <div className="mb-1 text-gray-800 font-medium">
//                                                 <span className="flex">
//                                                     <p className="font-medium text-gray-800">
//                                                         {index + 1 + (page - 1) * QUESTIONS_PER_PAGE}.
//                                                     </p>
//                                                     <div
//                                                         className="prose prose-sm max-w-none"
//                                                         dangerouslySetInnerHTML={{ __html: q.questionText }}
//                                                     />
//                                                 </span>
//                                             </div>

//                                             {q.questionType === "mcq" && (
//                                                 <ul className="text-sm text-gray-600">
//                                                     {q.options.map((opt, i) => (
//                                                         <li
//                                                             key={i}
//                                                             className={i === q.correctOptionIndex ? "font-bold text-green-600" : ""}
//                                                         >
//                                                             <div
//                                                                 className="prose prose-sm max-w-none mt-3"
//                                                                 dangerouslySetInnerHTML={{ __html: opt }}
//                                                             />
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             )}

//                                             {q.questionType === "direct" && (
//                                                 <p className="text-sm text-blue-600 mt-1">
//                                                     <strong>
//                                                         <span
//                                                             className="prose prose-sm max-w-none"
//                                                             dangerouslySetInnerHTML={{ __html: q.directAnswer }}
//                                                         />
//                                                     </strong>
//                                                 </p>
//                                             )}

//                                             {q.questionType === "truefalse" && (
//                                                 <p className="text-sm text-blue-600 mt-1">
//                                                     <strong>
//                                                         <span
//                                                             className="prose prose-sm max-w-none"
//                                                             dangerouslySetInnerHTML={{ __html: q.correctAnswer }}
//                                                         />
//                                                     </strong>
//                                                 </p>
//                                             )}

//                                             {q.answerExplanation && (
//                                                 <div
//                                                     className="prose prose-sm max-w-none"
//                                                     dangerouslySetInnerHTML={{ __html: q.answerExplanation }}
//                                                 />
//                                             )}
//                                         </div>

//                                         <div className="flex gap-2">
//                                             <button
//                                                 onClick={() => handleDelete(q._id)}
//                                                 className="p-2 rounded hover:bg-red-100 text-red-600 transition"
//                                             >
//                                                 <Trash2 size={18} />
//                                             </button>
//                                             <button
//                                                 onClick={() => handleEdit(q._id)}
//                                                 className="p-2 rounded hover:bg-blue-100 text-blue-600 transition"
//                                             >
//                                                 <Edit2 size={18} />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             ))}

//                             {totalPages() > 1 && (
//                                 <div className="flex justify-center items-center gap-2 mt-4">
//                                     {[...Array(totalPages()).keys()].map((p) => (
//                                         <button
//                                             key={p}
//                                             onClick={() => setPage(p + 1)}
//                                             className={`px-3 py-1 rounded ${page === p + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
//                                                 } hover:bg-blue-500 transition`}
//                                         >
//                                             {p + 1}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
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
    const [allQuestions, setAllQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [openStatus, setOpenStatus] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [operators, setOperators] = useState([]);
    const [operatorSearchTerm, setOperatorSearchTerm] = useState("");
    const [selectedOperator, setSelectedOperator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [operatorQuestions, setOperatorQuestions] = useState([]);

    useEffect(() => {
        const fetchAllQuestions = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                setLoading(true);
                const res = await axios.get("/api/admin/getallquestion", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(res.data, "questionres");

                setAllQuestions(res.data || []);
                setFilteredQuestions(res.data || []);
            } catch (err) {
                console.error("❌ Failed to fetch questions:", err);
                toast.error("Failed to load questions");
            } finally {
                setLoading(false);
            }
        };

        const fetchOperators = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("/api/admin/getoperator", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOperators(res.data || []);
            } catch (err) {
                console.error("Failed to fetch operators:", err);
            }
        };

        fetchAllQuestions();
        fetchOperators();
    }, []);

    // useEffect(() => {
    //     let results = allQuestions;

    //     // Filter by operator
    //     if (selectedOperator) {
    //         results = results.filter(q => {
    //             // Handle both cases where createdBy might be an object or just an ID
    //             const creatorId = q.createdBy?._id || q.createdBy;
    //             return creatorId === selectedOperator._id;
    //         });
    //         console.log("Filtered questions by operator:", results);
    //         setOperatorQuestions(results);
    //     } else {
    //         setOperatorQuestions([]);
    //     }

    //     // Filter by status
    //     if (selectedStatus !== "all") {
    //         results = results.filter(q => q.status === selectedStatus);
    //     }

    //     // Filter by question text
    //     if (searchTerm.trim()) {
    //         results = results.filter(q =>
    //             q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
    //         );
    //     }

    //     setFilteredQuestions(results);
    //     setPage(1);
    // }, [allQuestions, selectedOperator, selectedStatus, searchTerm]);


    useEffect(() => {
        let results = allQuestions;
        let operatorSpecific = [];

        // First filter by operator if selected
        if (selectedOperator) {
            operatorSpecific = results.filter(q => {
                const creatorId = q.createdBy?._id || q.createdBy;
                return creatorId === selectedOperator._id;
            });
            setOperatorQuestions(operatorSpecific); // Store all operator's questions
            results = operatorSpecific; // Use these as base for further filtering
        } else {
            setOperatorQuestions([]);
        }

        // Then apply other filters
        if (selectedStatus !== "all") {
            results = results.filter(q => q.status === selectedStatus);
        }

        if (searchTerm.trim()) {
            results = results.filter(q =>
                q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredQuestions(results);
        setPage(1);
    }, [allQuestions, selectedOperator, selectedStatus, searchTerm]);

    const handleOperatorSearch = (operatorName) => {
        const foundOperator = operators.find(op =>
            op.name.toLowerCase() === operatorName.toLowerCase()
        );

        if (foundOperator) {
            setSelectedOperator(foundOperator);
            setOperatorSearchTerm(foundOperator.name);
        } else {
            toast.warning(`No operator found with name: ${operatorName}`);
        }
    };

    const toggleStatus = (status) => {
        setOpenStatus((prev) => (prev === status ? null : status));
        setPage(1);
    };

    // const paginatedQuestions = () => {
    //     const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
    //     return filteredQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    // };
    const paginatedQuestions = () => {
        const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
        const endIndex = startIndex + QUESTIONS_PER_PAGE;
        const paginated = filteredQuestions.slice(startIndex, endIndex);
        console.log(`Paginating: ${startIndex} to ${endIndex} of ${filteredQuestions.length}`);
        return paginated;
    };

    const totalPages = () => {
        return Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/admin/deletequestion/${id}`);
            setAllQuestions(prev => prev.filter(q => q._id !== id));
            toast.success("Question deleted successfully!");
        } catch (err) {
            console.error("Error deleting question:", err);
            toast.error("Failed to delete question.");
        }
    };

    const handleEdit = (id) => {
        router.push(`/admin/superAdminDashboard/editQuestion/${id}`);
    };

    if (loading) {
        return <div className="text-center p-8 text-white">Loading questions...</div>;
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
                    className="px-4 py-2 w-full md:w-1/3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />

                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search by operator name..."
                        value={selectedOperator ? selectedOperator.name : operatorSearchTerm}
                        onChange={(e) => {
                            setOperatorSearchTerm(e.target.value);
                            if (!e.target.value) setSelectedOperator(null);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleOperatorSearch(operatorSearchTerm);
                            }
                        }}
                        className="px-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    {operatorSearchTerm && !selectedOperator && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {operators
                                .filter(op =>
                                    op.name.toLowerCase().includes(operatorSearchTerm.toLowerCase())
                                )
                                .map(op => (
                                    <div
                                        key={op._id}
                                        className="p-2 hover:bg-blue-100 cursor-pointer text-gray-800"
                                        onClick={() => {
                                            setSelectedOperator(op);
                                            setOperatorSearchTerm(op.name);
                                        }}
                                    >
                                        {op.name}
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>

                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    <option value="all" className="text-gray-800">All Statuses</option>
                    {statusList.map((s) => (
                        <option key={s} value={s} className="text-gray-800">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {selectedOperator && (
                <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-between">
                    {/* <pre>{JSON.stringify(operatorQuestions, null, 2)}</pre> */}
                    <div>
                        Showing {operatorQuestions.length} questions added by:
                        <span className="font-bold ml-2">{selectedOperator.name}</span>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedOperator(null);
                            setOperatorSearchTerm("");
                        }}
                        className="ml-4 p-1 rounded-full hover:bg-blue-200 transition"
                    >
                        <span className="text-red-600 font-bold">×</span>
                    </button>
                </div>
            )}
            {filteredQuestions.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                    No questions found matching your criteria
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl shadow-md bg-white overflow-hidden">
                        {/* Status header - make sure this matches your filter */}
                        <div className="w-full p-4 text-left font-semibold text-lg bg-gray-600">
                            {selectedStatus === "all"
                                ? "ALL QUESTIONS"
                                : selectedStatus.toUpperCase()}
                            {selectedOperator && ` (Added by: ${selectedOperator.name})`}
                        </div>

                        {/* Question list */}
                        <div className="max-h-[500px] overflow-y-auto px-4 py-2 space-y-4">
                            {paginatedQuestions().length > 0 ? (
                                paginatedQuestions().map((q, index) => (
                                    <motion.div
                                        key={q._id || index} // Fallback to index if _id missing
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

                                                {q.questionType === "mcq" && (
                                                    <ul className="text-sm text-gray-600">
                                                        {q.options.map((opt, i) => (
                                                            <li
                                                                key={i}
                                                                className={i === q.correctOptionIndex ? "font-bold text-green-600" : ""}
                                                            >
                                                                <div
                                                                    className="prose prose-sm max-w-none mt-3"
                                                                    dangerouslySetInnerHTML={{ __html: opt }}
                                                                />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {q.questionType === "direct" && (
                                                    <p className="text-sm text-blue-600 mt-1">
                                                        <strong>
                                                            <span
                                                                className="prose prose-sm max-w-none"
                                                                dangerouslySetInnerHTML={{ __html: q.directAnswer }}
                                                            />
                                                        </strong>
                                                    </p>
                                                )}

                                                {q.questionType === "truefalse" && (
                                                    <p className="text-sm text-blue-600 mt-1">
                                                        <strong>
                                                            <span
                                                                className="prose prose-sm max-w-none"
                                                                dangerouslySetInnerHTML={{ __html: q.correctAnswer }}
                                                            />
                                                        </strong>
                                                    </p>
                                                )}

                                                {q.answerExplanation && (
                                                    <div
                                                        className="prose prose-sm max-w-none"
                                                        dangerouslySetInnerHTML={{ __html: q.answerExplanation }}
                                                    />
                                                )}
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
                                ))
                            ) : (
                                <div className="text-center p-4 text-gray-500">
                                    No questions on this page
                                </div>
                            )}

                            {/* Pagination controls */}
                            {totalPages() > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-4">
                                    {[...Array(totalPages()).keys()].map((p) => (
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
                        </div>
                    </div>
                </div>
            )}

            {/* {filteredQuestions.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                    No questions found matching your criteria
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl shadow-md bg-white overflow-hidden">
                        <div className="w-full p-4 text-left font-semibold text-lg bg-gray-600">
                            {selectedStatus === "all" ? "ALL QUESTIONS" : selectedStatus.toUpperCase()}
                        </div>

                        <div className="max-h-[500px] overflow-y-auto px-4 py-2 space-y-4">
                            {paginatedQuestions().map((q, index) => (
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

                                            {q.questionType === "mcq" && (
                                                <ul className="text-sm text-gray-600">
                                                    {q.options.map((opt, i) => (
                                                        <li
                                                            key={i}
                                                            className={i === q.correctOptionIndex ? "font-bold text-green-600" : ""}
                                                        >
                                                            <div
                                                                className="prose prose-sm max-w-none mt-3"
                                                                dangerouslySetInnerHTML={{ __html: opt }}
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {q.questionType === "direct" && (
                                                <p className="text-sm text-blue-600 mt-1">
                                                    <strong>
                                                        <span
                                                            className="prose prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: q.directAnswer }}
                                                        />
                                                    </strong>
                                                </p>
                                            )}

                                            {q.questionType === "truefalse" && (
                                                <p className="text-sm text-blue-600 mt-1">
                                                    <strong>
                                                        <span
                                                            className="prose prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: q.correctAnswer }}
                                                        />
                                                    </strong>
                                                </p>
                                            )}

                                            {q.answerExplanation && (
                                                <div
                                                    className="prose prose-sm max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: q.answerExplanation }}
                                                />
                                            )}
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

                            {totalPages() > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-4">
                                    {[...Array(totalPages()).keys()].map((p) => (
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
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default ViewQuestions;