

// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function AddQuestion() {
//     const [questionData, setQuestionData] = useState({
//         subCategory: "",
//         questionText: "",
//         questionType: "mcq",
//         options: ["", "", "", ""],
//         correctOptionIndex: 0,
//         directAnswer: "",
//     });

//     const [subCategories, setSubCategories] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");
//     ;
//     useEffect(() => {
//         const fetchSubCategories = async () => {
//             try {
//                 const res = await axios.get("http://localhost:3000/api/admin/getallsubcategory");
//                 console.log("Fetched SubCategories:", res.data);

//                 setSubCategories(res.data);
//             } catch (error) {
//                 console.error("Error fetching subcategories:", error);
//             }
//         };
//         fetchSubCategories();
//     }, []);

//     const handleChange = (e) => {
//         setQuestionData({ ...questionData, [e.target.name]: e.target.value });
//     };

//     const handleOptionChange = (index, value) => {
//         const newOptions = [...questionData.options];
//         newOptions[index] = value;
//         setQuestionData({ ...questionData, options: newOptions });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage("");

//         const payload = {
//             ...questionData,
//             options: questionData.questionType === "mcq" ? questionData.options : [],
//             directAnswer: questionData.questionType === "direct" ? questionData.directAnswer : null,
//         };

//         try {
//             await axios.post("/api/admin/question", payload);
//             setMessage("Question added successfully!");
//             setQuestionData({
//                 subCategory: "",
//                 questionText: "",
//                 questionType: "mcq",
//                 options: ["", "", "", ""],
//                 correctOptionIndex: 0,
//                 directAnswer: "",
//             });
//         } catch (error) {
//             console.error("Error adding question:", error);
//             setMessage("Failed to add question.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
//             <h2 className="text-2xl font-bold mb-4">Add Question</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <select
//                     name="subCategory"
//                     value={questionData.subCategory}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                     required
//                 >
//                     <option value="">Select SubCategory</option>
//                     {subCategories.map((sub) => (
//                         <option key={sub._id} value={sub._id}>{sub.name}</option>
//                     ))}
//                 </select>

//                 <input
//                     type="text"
//                     name="questionText"
//                     placeholder="Enter Question"
//                     value={questionData.questionText}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                     required
//                 />

//                 <select name="questionType" value={questionData.questionType} onChange={handleChange} className="w-full p-2 border rounded">
//                     <option value="mcq">Multiple Choice (MCQ)</option>
//                     <option value="direct">Direct Answer</option>
//                 </select>

//                 {questionData.questionType === "mcq" ? (
//                     <div>
//                         {questionData.options.map((option, index) => (
//                             <div key={index} className="flex items-center gap-2">
//                                 <input
//                                     type="radio"
//                                     name="correctOptionIndex"
//                                     checked={questionData.correctOptionIndex === index}
//                                     onChange={() => setQuestionData({ ...questionData, correctOptionIndex: index })}
//                                 />
//                                 <input
//                                     type="text"
//                                     placeholder={`Option ${index + 1}`}
//                                     value={option}
//                                     onChange={(e) => handleOptionChange(index, e.target.value)}
//                                     className="w-full p-2 border rounded"
//                                     required
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <input
//                         type="text"
//                         name="directAnswer"
//                         placeholder="Enter Direct Answer"
//                         value={questionData.directAnswer}
//                         onChange={handleChange}
//                         className="w-full p-2 border rounded"
//                         required
//                     />
//                 )}

//                 <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" disabled={loading}>
//                     {loading ? "Submitting..." : "Submit Question"}
//                 </button>

//                 {message && <p className="mt-2 text-center text-gray-700">{message}</p>}
//             </form>
//         </div>
//     );
// }


"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddQuestion() {
    const [questionData, setQuestionData] = useState({
        subCategory: "",
        questionText: "",
        questionType: "mcq",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        directAnswer: "",
        answerExplanation: "",
    });

    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch subcategories on mount
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/admin/getallsubcategory");
                console.log("Fetched SubCategories:", res.data);
                setSubCategories(res.data);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };
        fetchSubCategories();
    }, []);

    const handleChange = (e) => {
        setQuestionData({ ...questionData, [e.target.name]: e.target.value });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionData.options];
        newOptions[index] = value;
        setQuestionData({ ...questionData, options: newOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const payload = {
            ...questionData,
            options: questionData.questionType === "mcq" ? questionData.options : [],
            correctOptionIndex: questionData.questionType === "mcq" ? questionData.correctOptionIndex : null,
            directAnswer: questionData.questionType === "direct" ? questionData.directAnswer : null,
        };

        try {
            await axios.post("/api/admin/question", payload);
            setMessage("Question added successfully!");
            setQuestionData({
                subCategory: "",
                questionText: "",
                questionType: "mcq",
                options: ["", "", "", ""],
                correctOptionIndex: 0,
                directAnswer: "",
                answerExplanation: "",
            });
        } catch (error) {
            console.error("Error adding question:", error);
            setMessage("Failed to add question.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Add Question</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* SubCategory Selection */}
                <select
                    name="subCategory"
                    value={questionData.subCategory}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">Select SubCategory</option>
                    {subCategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                </select>

                {/* Question Text */}
                <input
                    type="text"
                    name="questionText"
                    placeholder="Enter Question"
                    value={questionData.questionText}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                {/* Question Type Selection */}
                <select
                    name="questionType"
                    value={questionData.questionType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="mcq">Multiple Choice (MCQ)</option>
                    <option value="direct">Direct Answer</option>
                </select>

                {/* MCQ Section */}
                {questionData.questionType === "mcq" ? (
                    <div>
                        {questionData.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="correctOptionIndex"
                                    checked={questionData.correctOptionIndex === index}
                                    onChange={() => setQuestionData({ ...questionData, correctOptionIndex: index })}
                                />
                                <input
                                    type="text"
                                    placeholder={`Option ${index + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    // Direct Answer Section
                    <input
                        type="text"
                        name="directAnswer"
                        placeholder="Enter Direct Answer"
                        value={questionData.directAnswer}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                )}

                {/* Answer Explanation */}
                <textarea
                    name="answerExplanation"
                    placeholder="Provide Explanation for the Answer"
                    value={questionData.answerExplanation}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Question"}
                </button>

                {message && <p className="mt-2 text-center text-gray-700">{message}</p>}
            </form>
        </div>
    );
}
