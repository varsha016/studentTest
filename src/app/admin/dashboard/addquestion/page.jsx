

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


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
    const router = useRouter();

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/admin/getallsubcategory");
                setSubCategories(res.data);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };
        fetchSubCategories();
    }, []);

    // const handleChange = (e) => {
    //     setQuestionData({ ...questionData, [e.target.name]: e.target.value });
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuestionData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionData.options];
        newOptions[index] = value;
        setQuestionData({ ...questionData, options: newOptions });
    };
    const addQuestionToStorage = async () => {
        try {
            const token = localStorage.getItem("operatorToken"); // Retrieve the token from localStorage
            console.log(token, "token");

            if (!token) {
                alert("Unauthorized: No token provided. Please login again.");
                return;
            }

            const storedQuestions = JSON.parse(localStorage.getItem("addedQuestions")) || [];
            console.log(questionData, "questionData");

            const response = await axios.post(
                "http://localhost:3000/api/admin/question",
                questionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in Authorization header
                    },
                }
            );

            console.log(response.data, "API Response");

            if (response.data && response.data.message === "Question added successfully") {
                const newQuestion = response.data.data; // Ensure all fields are retrieved from API

                if (!newQuestion || !newQuestion._id) {
                    console.error("Invalid API response, missing _id.");
                    alert("Error: Missing question ID from response.");
                    return;
                }

                // Add new question to localStorage
                storedQuestions.push(newQuestion);
                console.log(storedQuestions, "Updated storedQuestions");

                localStorage.setItem("addedQuestions", JSON.stringify(storedQuestions));

                alert("Question added successfully!");

                // Reset form fields
                setQuestionData({
                    subCategory: "",
                    questionText: "",
                    questionType: "mcq",
                    options: ["", "", "", ""],
                    correctOptionIndex: 0,
                    directAnswer: "",
                    answerExplanation: "",
                });
            } else {
                alert(response.data?.message || "Failed to add question. Please try again.");
            }

        } catch (error) {
            console.error("Error adding question:", error);
            alert(error.response?.data?.message || "An error occurred while adding the question.");
        }
    };



    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
            {/* <pre>{JSON.stringify(questionData, null, 2)}</pre> */}
            <h2 className="text-2xl font-bold mb-4">Add Question</h2>
            <form className="space-y-4">
                <select name="subCategory" value={questionData.subCategory} onChange={handleChange} className="w-full p-2 border rounded" required>
                    <option value="">Select SubCategory</option>
                    {subCategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                </select>

                <input type="text" name="questionText" placeholder="Enter Question" value={questionData.questionText} onChange={handleChange} className="w-full p-2 border rounded" required />

                <select name="questionType" value={questionData.questionType} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="mcq">Multiple Choice (MCQ)</option>
                    <option value="direct">Direct Answer</option>
                </select>

                {questionData.questionType === "mcq" ? (
                    <div>
                        {questionData.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="radio" name="correctOptionIndex" checked={questionData.correctOptionIndex === index} onChange={() => setQuestionData({ ...questionData, correctOptionIndex: index })} />
                                <input type="text" placeholder={`Option ${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} className="w-full p-2 border rounded" required />
                            </div>
                        ))}
                    </div>
                ) : (
                    <input type="text" name="directAnswer" placeholder="Enter Direct Answer" value={questionData.directAnswer} onChange={handleChange} className="w-full p-2 border rounded" required />
                )}

                <textarea name="answerExplanation" placeholder="Provide Explanation for the Answer" value={questionData.answerExplanation} onChange={handleChange} className="w-full p-2 border rounded" required />

                <button type="button" onClick={addQuestionToStorage} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Add Question</button>
            </form>
        </div>
    );
}




// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// export default function AddQuestion() {
//     const [questionData, setQuestionData] = useState({
//         subCategory: "",
//         questionText: "",
//         questionType: "mcq",
//         options: ["", "", "", ""],
//         correctOptionIndex: 0,
//         directAnswer: "",
//         answerExplanation: "",
//     });

//     const [subCategories, setSubCategories] = useState([]);
//     const router = useRouter();
//     const explanationRef = useRef(null); // Ref for contentEditable div

//     useEffect(() => {
//         const fetchSubCategories = async () => {
//             try {
//                 const res = await axios.get("http://localhost:3000/api/admin/getallsubcategory");
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

//     const addQuestionToStorage = async () => {
//         try {
//             const token = localStorage.getItem("operatorToken");
//             if (!token) {
//                 alert("Unauthorized: No token provided.");
//                 return;
//             }

//             // Get explanation content from contentEditable div
//             const explanationHTML = explanationRef.current?.innerHTML || "";
//             const updatedData = { ...questionData, answerExplanation: explanationHTML };

//             const response = await axios.post(
//                 "http://localhost:3000/api/admin/question",
//                 updatedData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             if (response.data?.message === "Question added successfully") {
//                 const storedQuestions = JSON.parse(localStorage.getItem("addedQuestions")) || [];
//                 storedQuestions.push(response.data.data);
//                 localStorage.setItem("addedQuestions", JSON.stringify(storedQuestions));

//                 alert("Question added successfully!");
//                 setQuestionData({
//                     subCategory: "",
//                     questionText: "",
//                     questionType: "mcq",
//                     options: ["", "", "", ""],
//                     correctOptionIndex: 0,
//                     directAnswer: "",
//                     answerExplanation: "",
//                 });

//                 if (explanationRef.current) explanationRef.current.innerHTML = "";
//             } else {
//                 alert(response.data?.message || "Failed to add question.");
//             }

//         } catch (error) {
//             console.error("Error adding question:", error);
//             alert(error.response?.data?.message || "An error occurred.");
//         }
//     };

//     return (
//         <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
//             <h2 className="text-2xl font-bold mb-4">Add Question</h2>
//             <form className="space-y-4">
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

//                 <select
//                     name="questionType"
//                     value={questionData.questionType}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                 >
//                     <option value="mcq">Multiple Choice (MCQ)</option>
//                     <option value="direct">Direct Answer</option>
//                 </select>

//                 {questionData.questionType === "mcq" ? (
//                     <div>
//                         {questionData.options.map((option, index) => (
//                             <div key={index} className="flex items-center gap-2 mb-2">
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

//                 {/* Toolbar */}
//                 <div>
//                     <label className="block font-semibold mb-1">Answer Explanation</label>
//                     <div className="flex gap-2 mb-2">
//                         <button
//                             type="button"
//                             onClick={() => document.execCommand("bold")}
//                             className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//                         >
//                             Bold
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => document.execCommand("italic")}
//                             className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//                         >
//                             Italic
//                         </button>
//                     </div>

//                     {/* Rich Text Editable Div */}
//                     <div
//                         contentEditable
//                         ref={explanationRef}
//                         className="w-full p-2 border rounded min-h-[100px]"
//                         onInput={(e) =>
//                             setQuestionData({
//                                 ...questionData,
//                                 answerExplanation: e.currentTarget.innerHTML,
//                             })
//                         }
//                         dangerouslySetInnerHTML={{ __html: questionData.answerExplanation }}
//                     />
//                 </div>

//                 <button
//                     type="button"
//                     onClick={addQuestionToStorage}
//                     className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
//                 >
//                     Add Question
//                 </button>
//             </form>
//         </div>
//     );
// }
