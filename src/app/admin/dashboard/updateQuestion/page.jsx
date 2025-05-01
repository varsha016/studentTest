

// export default function UpdateQuestionForm({ question, onUpdate, onCancel }) {
//     console.log("Question:", question);

//     const [questionData, setQuestionData] = useState({
//         subCategory: question?.subCategory,
//         questionText: question?.questionText,
//         questionType: question?.questionType,
//         options: [...(question?.options || [])], // Ensure options is always an array
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
//                     {/* Same form fields as AddQuestion but with questionData populated */}
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
//                                     <div key={index} className="flex items-center gap-2">
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
//                                         <input
//                                             type="text"
//                                             placeholder={`Option ${index + 1}`}
//                                             value={option}
//                                             onChange={(e) =>
//                                                 handleOptionChange(index, e.target.value)
//                                             }
//                                             className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                             required
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Direct Answer
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="directAnswer"
//                                     placeholder="Enter Direct Answer"
//                                     value={questionData.directAnswer}
//                                     onChange={handleChange}
//                                     className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                     required
//                                 />
//                             </div>
//                         )}

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Answer Explanation
//                             </label>

//                             <textarea
//                                 name="answerExplanation"
//                                 placeholder="Provide Explanation for the Answer"
//                                 value={questionData.answerExplanation}
//                                 onChange={handleChange}
//                                 className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TiptapEditor from "@/components/TiptapEditor";


export default function UpdateQuestionForm({ question, onUpdate, onCancel }) {
    console.log("Question:", question);

    const [questionData, setQuestionData] = useState({
        subCategory: question?.subCategory,
        questionText: question?.questionText,
        questionType: question?.questionType,
        options: [...(question?.options || [])], // Ensure options is always an array
        correctOptionIndex: question?.correctOptionIndex,
        directAnswer: question?.directAnswer || "",
        answerExplanation: question?.answerExplanation,
    });

    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchSubCategories = async () => {
            try {
                const res = await axios.get("/api/admin/getallsubcategory");
                setSubCategories(res?.data?.subcategories);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuestionData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionData.options];
        newOptions[index] = value;
        setQuestionData({ ...questionData, options: newOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("operatorToken");
            if (!token) {
                toast.error("Unauthorized: No token provided. Please login again.");
                return;
            }

            const response = await axios.put(
                `/api/admin/updatesinglequestion/${question._id}`,
                questionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.success) {
                toast.success("Question updated successfully!");
                onUpdate(response.data.question);
            } else {
                toast.error(response.data?.message || "Failed to update question.");
            }
        } catch (error) {
            console.error("Error updating question:", error);
            toast.error(
                error.response?.data?.message ||
                "An error occurred while updating the question."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden p-6 w-[90%] md:w-[800px] max-h-[90vh] overflow-y-auto"
            >
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Update Question
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SubCategory
                            </label>
                            <select
                                name="subCategory"
                                value={questionData?.subCategory}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            >
                                <option value="">Select SubCategory</option>
                                {subCategories?.map((sub) => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub?.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Question
                            </label>
                            <TiptapEditor
                                value={questionData.questionText}
                                onChange={(newValue) => {
                                    setQuestionData((prev) => ({
                                        ...prev,
                                        questionText: newValue,
                                    }));
                                }}
                            />
                        </div>

                        {questionData.questionType === "mcq" ? (
                            <div className="space-y-2">
                                {questionData.options.map((option, index) => (
                                    <div key={index} className="gap-2">
                                        <input
                                            type="radio"
                                            name="correctOptionIndex"
                                            checked={questionData.correctOptionIndex === index}
                                            onChange={() =>
                                                setQuestionData((prev) => ({
                                                    ...prev,
                                                    correctOptionIndex: index,
                                                }))
                                            }
                                        />
                                        <TiptapEditor
                                            value={option}
                                            onChange={(newValue) => handleOptionChange(index, newValue)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : questionData.questionType === "truefalse" ? (
                            <div className="space-y-2">
                                <div className="flex gap-4">
                                    <div>
                                        <input
                                            type="radio"
                                            name="correctOptionIndex"
                                            value="true"
                                            checked={questionData.correctOptionIndex === 0}
                                            onChange={() =>
                                                setQuestionData((prev) => ({
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
                                            checked={questionData.correctOptionIndex === 1}
                                            onChange={() =>
                                                setQuestionData((prev) => ({
                                                    ...prev,
                                                    correctOptionIndex: 1,
                                                }))
                                            }
                                        />
                                        <label className="ml-2">False</label>
                                    </div>
                                </div>
                            </div>
                        ) : questionData.questionType === "direct" ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Direct Answer
                                </label>
                                <TiptapEditor
                                    value={questionData.directAnswer}
                                    onChange={(newValue) =>
                                        setQuestionData((prev) => ({ ...prev, directAnswer: newValue }))
                                    }
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                        ) : null}


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Answer Explanation
                            </label>
                            <TiptapEditor
                                value={questionData.answerExplanation}
                                onChange={(newValue) => setQuestionData((prev) => ({ ...prev, answerExplanation: newValue }))}
                                className="w-full h-2 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                            {/* <textarea
                                name="answerExplanation"
                                placeholder="Provide Explanation for the Answer"
                                value={questionData.answerExplanation}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            /> */}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Question"
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
