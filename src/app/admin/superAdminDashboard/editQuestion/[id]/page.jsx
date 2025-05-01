



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import axios from "axios";
// import dynamic from "next/dynamic";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";

// // Dynamically import TiptapEditor to avoid SSR issues
// const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
//     ssr: false,
// });

// const EditQuestion = () => {
//     const router = useRouter();
//     const { id } = useParams();

//     const [formData, setFormData] = useState({
//         questionText: "",
//         questionType: "mcq",
//         options: ["", "", "", ""],
//         correctOptionIndex: 0,
//         directAnswer: "",
//         answerExplanation: "",
//     });

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         // admin Token
//         if (!token) return;

//         const fetchQuestion = async () => {
//             console.log(id, 'admin id');

//             try {
//                 const res = await axios.get(`/api/superadmin/getquestion/${id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setFormData(res.data);
//             } catch (err) {
//                 console.error("❌ Error fetching question", err);
//             }
//         };

//         fetchQuestion();
//     }, [id]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleOptionChange = (index, value) => {
//         const updatedOptions = [...formData.options];
//         updatedOptions[index] = value;
//         setFormData({ ...formData, options: updatedOptions });
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem("operatorToken");

//         try {
//             await axios.put(
//                 `/api/superadmin/updatequestionWithStatus/${id}`,
//                 formData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             toast.success("✅ Question updated!");
//             alert("Question updated successfully!");
//             router.push("/admin/superAdminDashboard/viewQuestion");
//         } catch (err) {
//             console.error("❌ Error updating question", err);
//             toast.error("Failed to update question.");
//         }
//     };

//     return (
//         <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
//             <h1 className="text-2xl font-bold mb-6">Edit Question</h1>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                     <label className="block mb-2 font-medium">Question Type</label>
//                     <select
//                         name="questionType"
//                         value={formData.questionType}
//                         onChange={handleChange}
//                         className="w-full border p-2 rounded"
//                     >
//                         <option value="mcq">MCQ</option>
//                         <option value="direct">Direct</option>
//                         <option value="truefalse">truefalse</option>
//                     </select>
//                 </div>

//                 <div>
//                     <label className="block mb-2 font-medium">Question</label>
//                     <TiptapEditor
//                         value={formData.questionText}
//                         onChange={(value) =>
//                             setFormData((prev) => ({ ...prev, questionText: value }))
//                         }
//                     />
//                 </div>

//                 {formData.questionType === "mcq" ? (
//                     <>
//                         <div className="space-y-3">
//                             {[0, 1, 2, 3].map((i) => (
//                                 <div key={i}>
//                                     <label className="block font-medium">
//                                         Option {i + 1}
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.options[i] || ""}
//                                         onChange={(e) =>
//                                             handleOptionChange(i, e.target.value)
//                                         }
//                                         className="w-full border p-2 rounded"
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                         <div>
//                             <label className="block mt-4 font-medium">
//                                 Correct Option Index (0-3)
//                             </label>
//                             <input
//                                 type="number"
//                                 name="correctOptionIndex"
//                                 value={formData.correctOptionIndex}
//                                 onChange={handleChange}
//                                 min={0}
//                                 max={3}
//                                 className="w-full border p-2 rounded"
//                             />
//                         </div>
//                     </>
//                 ) : (
//                     <div>
//                         <label className="block mt-4 font-medium">Direct Answer</label>
//                         <input
//                             type="text"
//                             name="directAnswer"
//                             value={formData.directAnswer}
//                             onChange={handleChange}
//                             className="w-full border p-2 rounded"
//                         />
//                     </div>
//                 )}

//                 <div>
//                     <label className="block mt-4 font-medium">
//                         Answer Explanation
//                     </label>
//                     <TiptapEditor
//                         value={formData.answerExplanation}
//                         onChange={(value) =>
//                             setFormData((prev) => ({ ...prev, answerExplanation: value }))
//                         }
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     className="bg-blue-600 text-white mt-6 px-4 py-2 rounded hover:bg-blue-700 transition"
//                 >
//                     Update Question
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default EditQuestion;


"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

// Dynamically import TiptapEditor to avoid SSR issues
const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
    ssr: false,
});

const EditQuestion = () => {
    const router = useRouter();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        questionText: "",
        questionType: "mcq",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        directAnswer: "",
        answerExplanation: "",
        correctAnswer: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchQuestion = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/superadmin/getquestion/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const q = res.data;

                if (q.questionType === "truefalse") {
                    setFormData({
                        ...formData,
                        options: ["True", "False"],
                        correctAnswer: q.correctAnswer || (q.correctOptionIndex === 0 ? "True" : "False"),
                        // you can drop correctOptionIndex here if you like
                    });
                }

                // If truefalse, seed options
                const opts =
                    q.questionType === "truefalse"
                        ? ["True", "False"]
                        : q.options || ["", "", "", ""];

                setFormData({
                    questionText: q.questionText || "",
                    questionType: q.questionType || "mcq",
                    options: opts,
                    correctOptionIndex: q.correctOptionIndex ?? 0,
                    directAnswer: q.directAnswer || "",
                    answerExplanation: q.answerExplanation || "",
                });
            } catch (err) {
                console.error("❌ Error fetching question", err);
                toast.error("Failed to load question.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };


    const handleOptionChange = (i, v) => {
        setFormData((p) => {
            const o = [...p.options];
            o[i] = v;
            return { ...p, options: o };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("operatorToken");
        if (!token) return toast.error("Unauthorized.");

        try {
            setLoading(true);
            await axios.put(
                `/api/superadmin/updatequestionWithStatus/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("✅ Question updated!");
            router.push("/admin/superAdminDashboard/viewQuestion");
        } catch (err) {
            console.error("❌ Error updating question", err);
            toast.error("Failed to update question.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="animate-pulse text-gray-600">Loading…</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Edit Question</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question Type */}
                <div>
                    <label className="block mb-2 font-medium">Question Type</label>
                    <select
                        name="questionType"
                        value={formData.questionType}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="mcq">MCQ</option>
                        <option value="direct">Direct</option>
                        <option value="truefalse">True / False</option>
                    </select>
                </div>

                {/* Question Text */}
                <div>
                    <label className="block mb-2 font-medium">Question</label>
                    <TiptapEditor
                        value={formData.questionText}
                        onChange={(v) => setFormData((p) => ({ ...p, questionText: v }))}
                    />
                </div>

                {/* MCQ Options */}
                {formData.questionType === "mcq" && (
                    <>
                        <div className="space-y-3">
                            {formData.options.map((opt, i) => (
                                <div key={i}>
                                    <label className="block font-medium">Option {i + 1}</label>
                                    <TiptapEditor
                                        value={opt}
                                        onChange={(v) => handleOptionChange(i, v)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block mt-4 font-medium">
                                Correct Option Index (0–3)
                            </label>
                            <input
                                type="number"
                                name="correctOptionIndex"
                                value={formData.correctOptionIndex}
                                onChange={handleChange}
                                min={0}
                                max={3}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    </>
                )}

                {/* True/False */}
                {formData.questionType === "truefalse" && (
                    <div className="space-y-2">
                        <label className="block mb-2 font-medium">Correct Answer</label>
                        <div className="flex gap-4">
                            {["True", "False"].map((val) => (
                                <label key={val} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        value={val}
                                        checked={formData.correctAnswer === val}
                                        onChange={handleChange}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="select-none">{val}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
                {/* // Inside your form return JSX */}
                {/* {formData.questionType === "truefalse" && (
                    <div className="space-y-2">
                        <div className="flex gap-4">
                            <div>
                                <input
                                    type="radio"
                                    name="correctOptionIndex"
                                    value="true"
                                    checked={formData.correctOptionIndex === 0}
                                    onChange={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            correctOptionIndex: 0,
                                        }))
                                    }
                                />
                                <label className="ml-2">True</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name="correctOptionIndex"
                                    value="false"
                                    checked={formData.correctOptionIndex === 1}
                                    onChange={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            correctOptionIndex: 1,
                                        }))
                                    }
                                />
                                <label className="ml-2">False</label>
                            </div>
                        </div>
                    </div>
                )} */}

                {/* {formData.questionType === "truefalse" && (
                    <div>
                        <label className="block mb-2 font-medium">Correct Answer</label>
                        <select
                            name="correctOptionIndex"
                            // value={formData.correctOptionIndex}
                            value={formData.correctOptionIndex}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option >select option</option>
                            <option value={0}>True</option>
                            <option value={1}>False</option>
                        </select>
                    </div>
                )} */}

                {/* Direct Answer */}
                {formData.questionType === "direct" && (
                    <div>
                        <label className="block mb-2 font-medium">Direct Answer</label>
                        <TiptapEditor
                            value={formData.directAnswer}
                            onChange={(v) => setFormData((p) => ({ ...p, directAnswer: v }))}
                        />
                    </div>
                )}

                {/* Explanation */}
                <div>
                    <label className="block mb-2 font-medium">Answer Explanation</label>
                    <TiptapEditor
                        value={formData.answerExplanation}
                        onChange={(v) =>
                            setFormData((p) => ({ ...p, answerExplanation: v }))
                        }
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Update Question
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditQuestion;




// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { ArrowPathIcon } from "@heroicons/react/24/outline";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import TiptapEditor from "@/components/TiptapEditor";

// export default function EditQuestion({ question, onUpdate, onCancel }) {
//     console.log("Question:", question);

//     // Initialize questionData with default values and handle True/False type options
//     const [questionData, setQuestionData] = useState({
//         subCategory: question?.subCategory,
//         questionText: question?.questionText,
//         questionType: question?.questionType,
//         options: question?.questionType === "truefalse"
//             ? ["True", "False"]
//             : [...(question?.options || [])], // Ensure options are set for True/False type
//         correctOptionIndex: question?.correctOptionIndex,
//         directAnswer: question?.directAnswer || "",
//         answerExplanation: question?.answerExplanation,
//     });

//     const [subCategories, setSubCategories] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         setLoading(true);
//         const fetchSubCategories = async () => {
//             try {
//                 const res = await axios.get("/api/admin/getallsubcategory");
//                 setSubCategories(res?.data?.subcategories);
//             } catch (error) {
//                 console.error("Error fetching subcategories:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchSubCategories();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setQuestionData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleOptionChange = (index, value) => {
//         const newOptions = [...questionData.options];
//         newOptions[index] = value;
//         setQuestionData({ ...questionData, options: newOptions });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const token = localStorage.getItem("operatorToken");
//             if (!token) {
//                 toast.error("Unauthorized: No token provided. Please login again.");
//                 return;
//             }

//             const response = await axios.put(
//                 `/api/admin/updatesinglequestion/${question._id}`,
//                 questionData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             if (response.data?.success) {
//                 toast.success("Question updated successfully!");
//                 onUpdate(response.data.question);
//             } else {
//                 toast.error(response.data?.message || "Failed to update question.");
//             }
//         } catch (error) {
//             console.error("Error updating question:", error);
//             toast.error(
//                 error.response?.data?.message ||
//                 "An error occurred while updating the question."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//             <motion.div
//                 initial={{ scale: 0.5, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 className="bg-white rounded-xl shadow-md overflow-hidden p-6 w-[90%] md:w-[800px] max-h-[90vh] overflow-y-auto"
//             >
//                 <h1 className="text-2xl font-bold text-gray-800 mb-6">
//                     Update Question
//                 </h1>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="space-y-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 SubCategory
//                             </label>
//                             <select
//                                 name="subCategory"
//                                 value={questionData?.subCategory}
//                                 onChange={handleChange}
//                                 className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                 required
//                             >
//                                 <option value="">Select SubCategory</option>
//                                 {subCategories?.map((sub) => (
//                                     <option key={sub._id} value={sub._id}>
//                                         {sub?.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Question
//                             </label>
//                             <TiptapEditor
//                                 value={questionData.questionText}
//                                 onChange={(newValue) => {
//                                     setQuestionData((prev) => ({
//                                         ...prev,
//                                         questionText: newValue,
//                                     }));
//                                 }}
//                             />
//                         </div>

//                         {questionData.questionType === "mcq" ? (
//                             <div className="space-y-2">
//                                 {questionData.options.map((option, index) => (
//                                     <div key={index} className="gap-2">
//                                         <input
//                                             type="radio"
//                                             name="correctOptionIndex"
//                                             checked={questionData.correctOptionIndex === index}
//                                             onChange={() =>
//                                                 setQuestionData((prev) => ({
//                                                     ...prev,
//                                                     correctOptionIndex: index,
//                                                 }))
//                                             }
//                                         />
//                                         <TiptapEditor
//                                             value={option}
//                                             onChange={(newValue) => handleOptionChange(index, newValue)}
//                                             className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                             required
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : questionData.questionType === "truefalse" ? (
//                             <div className="space-y-2">
//                                 <div className="flex gap-4">
//                                     <div>
//                                         <input
//                                             type="radio"
//                                             name="correctOptionIndex"
//                                             value="true"
//                                             checked={questionData.correctOptionIndex === 0}
//                                             onChange={() =>
//                                                 setQuestionData((prev) => ({
//                                                     ...prev,
//                                                     correctOptionIndex: 0,
//                                                 }))
//                                             }
//                                         />
//                                         <label className="ml-2">True</label>
//                                     </div>
//                                     <div>
//                                         <input
//                                             type="radio"
//                                             name="correctOptionIndex"
//                                             value="false"
//                                             checked={questionData.correctOptionIndex === 1}
//                                             onChange={() =>
//                                                 setQuestionData((prev) => ({
//                                                     ...prev,
//                                                     correctOptionIndex: 1,
//                                                 }))
//                                             }
//                                         />
//                                         <label className="ml-2">False</label>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : questionData.questionType === "direct" ? (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Direct Answer
//                                 </label>
//                                 <TiptapEditor
//                                     value={questionData.directAnswer}
//                                     onChange={(newValue) =>
//                                         setQuestionData((prev) => ({ ...prev, directAnswer: newValue }))
//                                     }
//                                     className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                     required
//                                 />
//                             </div>
//                         ) : null}

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Answer Explanation
//                             </label>
//                             <TiptapEditor
//                                 value={questionData.answerExplanation}
//                                 onChange={(newValue) => setQuestionData((prev) => ({ ...prev, answerExplanation: newValue }))}
//                                 className="w-full h-2 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     <div className="flex justify-end space-x-3 pt-4">
//                         <button
//                             type="button"
//                             onClick={onCancel}
//                             className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
//                         >
//                             {loading ? (
//                                 <>
//                                     <ArrowPathIcon className="w-4 h-4 animate-spin" />
//                                     Updating...
//                                 </>
//                             ) : (
//                                 "Update Question"
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </motion.div>
//         </div>
//     );
// }
