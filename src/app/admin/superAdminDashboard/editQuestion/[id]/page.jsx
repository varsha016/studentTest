// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import axios from "axios";

// const EditQuestion = () => {
//     const router = useRouter();
//     const { id } = useParams();
//     console.log(id, "ID");

//     const [formData, setFormData] = useState({
//         questionText: "",
//         questionType: "mcq",
//         options: ["", "", "", ""],
//         correctOptionIndex: 0,
//         directAnswer: "",
//         answerExplanation: "",
//     });

//     useEffect(() => {
//         const token = localStorage.getItem("operatorToken");
//         if (!token) return;

//         const fetchQuestion = async () => {
//             try {
//                 const res = await axios.get(`/api/superadmin/getquestion/${id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 console.log(res, 'res');

//                 setFormData(res.data);
//             } catch (err) {
//                 console.error("❌ Error fetching question", err);
//             }
//         };

//         fetchQuestion();
//     }, [id]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleOptionChange = (index, value) => {
//         const updatedOptions = [...formData.options];
//         updatedOptions[index] = value;
//         setFormData({ ...formData, options: updatedOptions });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem("token");
//         try {
//             await axios.put(`/api/superadmin/updatequestionWithStatus/${id}`, formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             alert("✅ Question updated!");
//             router.push("/admin/superAdminDashboard/viewQuestion");
//         } catch (err) {
//             console.error("❌ Error updating question", err);
//         }
//     };

//     return (
//         <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
//             <h1 className="text-2xl font-bold mb-4">Edit Question</h1>
//             <form onSubmit={handleSubmit}>
//                 <label className="block mb-2">Question Text</label>
//                 <input
//                     type="text"
//                     name="questionText"
//                     value={formData.questionText}
//                     onChange={handleChange}
//                     className="w-full border p-2 mb-4"
//                 />

//                 <label className="block mb-2">Question Type</label>
//                 <select
//                     name="questionType"
//                     value={formData.questionType}
//                     onChange={handleChange}
//                     className="w-full border p-2 mb-4"
//                 >
//                     <option value="mcq">MCQ</option>
//                     <option value="direct">Direct</option>
//                 </select>

//                 {formData.questionType === "mcq" && (
//                     <>
//                         {[0, 1, 2, 3].map((i) => (
//                             <div key={i} className="mb-2">
//                                 <label className="block">Option {i + 1}</label>
//                                 <input
//                                     type="text"
//                                     value={formData.options[i] || ""}
//                                     onChange={(e) => handleOptionChange(i, e.target.value)}
//                                     className="w-full border p-2"
//                                 />
//                             </div>
//                         ))}
//                         <label className="block mt-4">Correct Option Index (0-3)</label>
//                         <input
//                             type="number"
//                             name="correctOptionIndex"
//                             value={formData.correctOptionIndex}
//                             onChange={handleChange}
//                             min={0}
//                             max={3}
//                             className="w-full border p-2"
//                         />
//                     </>
//                 )}

//                 {formData.questionType === "direct" && (
//                     <>
//                         <label className="block mt-4">Direct Answer</label>
//                         <input
//                             type="text"
//                             name="directAnswer"
//                             value={formData.directAnswer}
//                             onChange={handleChange}
//                             className="w-full border p-2"
//                         />
//                     </>
//                 )}

//                 <label className="block mt-4">Answer Explanation</label>
//                 <textarea
//                     name="answerExplanation"
//                     value={formData.answerExplanation}
//                     onChange={handleChange}
//                     className="w-full border p-2"
//                 ></textarea>

//                 <button
//                     type="submit"
//                     className="bg-blue-600 text-white mt-6 px-4 py-2 rounded hover:bg-blue-700 transition-all"
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
    });

    useEffect(() => {
        const token = localStorage.getItem("operatorToken");
        if (!token) return;

        const fetchQuestion = async () => {
            try {
                const res = await axios.get(`/api/superadmin/getquestion/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFormData(res.data);
            } catch (err) {
                console.error("❌ Error fetching question", err);
            }
        };

        fetchQuestion();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...formData.options];
        updatedOptions[index] = value;
        setFormData({ ...formData, options: updatedOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("operatorToken");

        try {
            await axios.put(
                `/api/superadmin/updatequestionWithStatus/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("✅ Question updated!");
            router.push("/admin/superAdminDashboard/viewQuestion");
        } catch (err) {
            console.error("❌ Error updating question", err);
            toast.error("Failed to update question.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Edit Question</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Question</label>
                    <TiptapEditor
                        value={formData.questionText}
                        onChange={(value) =>
                            setFormData((prev) => ({ ...prev, questionText: value }))
                        }
                    />
                </div>

                {formData.questionType === "mcq" ? (
                    <>
                        <div className="space-y-3">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i}>
                                    <label className="block font-medium">
                                        Option {i + 1}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.options[i] || ""}
                                        onChange={(e) =>
                                            handleOptionChange(i, e.target.value)
                                        }
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block mt-4 font-medium">
                                Correct Option Index (0-3)
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
                ) : (
                    <div>
                        <label className="block mt-4 font-medium">Direct Answer</label>
                        <input
                            type="text"
                            name="directAnswer"
                            value={formData.directAnswer}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                )}

                <div>
                    <label className="block mt-4 font-medium">
                        Answer Explanation
                    </label>
                    <TiptapEditor
                        value={formData.answerExplanation}
                        onChange={(value) =>
                            setFormData((prev) => ({ ...prev, answerExplanation: value }))
                        }
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white mt-6 px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Update Question
                </button>
            </form>
        </div>
    );
};

export default EditQuestion;
