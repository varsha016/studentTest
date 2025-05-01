


// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { ArrowPathIcon } from "@heroicons/react/24/outline";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import TiptapEditor from "@/components/TiptapEditor";

// export default function AddQuestion() {
//   const [questionData, setQuestionData] = useState({
//     subCategory: "",
//     questionText: "",
//     questionType: "mcq",
//     options: ["", "", "", ""],
//     correctOptionIndex: 0,
//     directAnswer: "",
//     answerExplanation: "",
//   });

//   const [subCategories, setSubCategories] = useState([]);
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchSubCategories = async () => {
//       try {
//         const res = await axios.get("/api/admin/getallsubcategory");
//         setSubCategories(res.data.subcategories);
//       } catch (error) {
//         console.error("Error fetching subcategories:", error);
//       }
//     };
//     fetchSubCategories();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setQuestionData((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleOptionChange = (index, value) => {
//     const newOptions = [...questionData.options];
//     newOptions[index] = value;
//     setQuestionData({ ...questionData, options: newOptions });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("operatorToken");
//       if (!token) {
//         alert("Unauthorized: No token provided. Please login again.");
//         return;
//       }

//       const storedQuestions =
//         JSON.parse(localStorage.getItem("addedQuestions")) || [];

//       const response = await axios.post("/api/admin/question", questionData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data?.message === "Question added successfully") {
//         const newQuestion = response.data.data;
//         if (!newQuestion?._id) {
//           alert("Error: Missing question ID from response.");
//           return;
//         }

//         storedQuestions.push(newQuestion);
//         localStorage.setItem("addedQuestions", JSON.stringify(storedQuestions));

//         toast.success("Question added successfully!", {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//           onClose: () => router.push("/admin/dashboard/addedquestions"),
//         });

//         setQuestionData({
//           subCategory: "",
//           questionText: "",
//           questionType: "mcq",
//           options: ["", "", "", ""],
//           correctOptionIndex: 0,
//           directAnswer: "",
//           answerExplanation: "",
//         });
//       } else {
//         alert(
//           response.data?.message || "Failed to add question. Please try again."
//         );
//       }
//     } catch (error) {
//       console.error("Error adding question:", error);
//       alert(
//         error.response?.data?.message ||
//         "An error occurred while adding the question."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };


//   // Function to fetch operator permissions
//   const [permissions, setPermissions] = useState({});
//   const [permissionsLoading, setPermissionsLoading] = useState(true);
//   const [userEmail, setUserEmail] = useState("");
//   useEffect(() => {
//     fetchLoggedInUser();
//   }, []);
//   const fetchLoggedInUser = () => {
//     const operator = JSON.parse(localStorage.getItem("operatorInfo"));
//     if (operator?.email) {
//       setUserEmail(operator.email);
//       fetchOperators(operator.email);
//     }
//   };

//   const fetchOperators = async (email) => {
//     try {
//       const response = await axios.get('/api/admin/getoperator');

//       if (response.data.length > 0) {
//         const loggedInOperator = response.data.find(op => op.email === email);
//         console.log("loggedInOperator", loggedInOperator);

//         if (loggedInOperator) {
//           setPermissions(loggedInOperator?.permissionId || {});
//         }
//       }
//     } catch (err) {
//       setMessage(`❌ ${err.response?.data?.message || err.message}`);
//     } finally {
//       setPermissionsLoading(false); // ✅ stop loading after fetch
//     }
//   };
//   console.log(permissions, "permissions");

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">
//           Add New Question
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 SubCategory
//               </label>
//               <select
//                 name="subCategory"
//                 value={questionData.subCategory}
//                 onChange={handleChange}
//                 className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 required
//               >
//                 <option value="">Select SubCategory</option>
//                 {subCategories.map((sub) => (
//                   <option key={sub._id} value={sub._id}>
//                     {sub.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Question
//               </label>
//               <TiptapEditor
//                 value={questionData.questionText}
//                 onChange={(newValue) => {
//                   setQuestionData((prev) => ({
//                     ...prev,
//                     questionText: newValue,
//                   }));
//                 }}
//               />
//             </div>

//             {questionData.questionType === "mcq" ? (
//               <div className="space-y-2">
//                 {questionData.options.map((option, index) => (
//                   <div key={index} className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       name="correctOptionIndex"
//                       checked={questionData.correctOptionIndex === index}
//                       onChange={() =>
//                         setQuestionData((prev) => ({
//                           ...prev,
//                           correctOptionIndex: index,
//                         }))
//                       }
//                     />
//                     <input
//                       type="text"
//                       placeholder={`Option ${index + 1}`}
//                       value={option}
//                       onChange={(e) =>
//                         handleOptionChange(index, e.target.value)
//                       }
//                       className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       required
//                     />
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Direct Answer
//                 </label>
//                 <input
//                   type="text"
//                   name="directAnswer"
//                   placeholder="Enter Direct Answer"
//                   value={questionData.directAnswer}
//                   onChange={handleChange}
//                   className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   required
//                 />
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Answer Explanation
//               </label>
//               <textarea
//                 name="answerExplanation"
//                 placeholder="Provide Explanation for the Answer"
//                 value={questionData.answerExplanation}
//                 onChange={handleChange}
//                 className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 required
//               />
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={() => router.push("/admin/dashboard/addedquestions")}
//               className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>

//             {permissionsLoading ? (
//               <div className="w-full text-gray-500 px-4 py-2 rounded-md bg-gray-100">
//                 Checking permissions...
//               </div>
//             ) : permissions.addQuestion ? (
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <ArrowPathIcon className="w-4 h-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Question"
//                 )}
//               </button>
//             ) : (
//               <div className="w-full text-red-500 px-4 py-2 rounded-md bg-red-100 transition">
//                 You are not authorized to add Category
//               </div>
//             )}




//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TiptapEditor from "@/components/TiptapEditor";

const AddQuestion = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [questionData, setQuestionData] = useState({
    category: "",
    subCategory: "",
    questionText: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    questionType: "mcq",
    directAnswer: "",
    answerExplanation: "",
    createdBy: "",
    correctAnswer: false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/admin/getallcategory");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const operator = JSON.parse(localStorage.getItem("operatorInfo"));
    if (operator?.id) {
      setQuestionData((prev) => ({ ...prev, createdBy: operator.id }));
    }
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({ ...prev, [name]: value }));


    if (name === "category") {
      console.log("Selected Category Value:", value); // <--- check this

      try {
        const res = await axios.get(`/api/admin/getallsubcategory`);
        console.log("All Subcategories:", res.data.subcategories); // <--- check this too


        const filteredSubs = res.data.subcategories.filter((sub) => {
          return sub.category && String(sub.category._id) === String(value);
        });

        console.log("Filtered Subcategories:", filteredSubs); // <--- see if this is empty

        setSubCategories(filteredSubs);
        setQuestionData((prev) => ({ ...prev, subCategory: "" }));
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    }


  };

  const handleTiptapChange = (field, value) => {
    setQuestionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...questionData.options];
    updatedOptions[index] = value;
    setQuestionData((prev) => ({ ...prev, options: updatedOptions }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post("/api/admin/addquestion", questionData);
  //     if (res.data.success) {
  //       toast.success("Question added successfully");
  //       router.push("/admin/allquestions");
  //     } else {
  //       toast.error(res.data.message || "Failed to add question");
  //     }
  //   } catch (error) {
  //     console.error("Error adding question:", error);
  //     toast.error("Something went wrong");
  //   }
  // };




  // Inside your component
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("operatorToken");
      if (!token) {
        alert("Unauthorized. Please log in again.");
        setLoading(false);
        return;
      }

      // Decode token to get createdBy
      let createdBy = "";
      const decoded = jwtDecode(token);
      createdBy = decoded.email || decoded.username || decoded.id; // Adjust as per your token's structure

      const {
        questionType,
        options,
        correctOptionIndex,
        directAnswer,
        correctAnswer,
        questionText,
        category,
        subCategory,
      } = questionData;

      // Validate required fields
      if (!category || !subCategory || !questionText) {
        alert("Please fill in Category, Subcategory, and Question Text.");
        setLoading(false);
        return;
      }

      let finalCorrectAnswer = "";

      if (questionType === "mcq") {
        finalCorrectAnswer = options[correctOptionIndex];
        if (!finalCorrectAnswer) {
          alert("Please select a correct option.");
          setLoading(false);
          return;
        }
      } else if (questionType === "truefalse") {
        if (typeof correctAnswer !== "boolean") {
          alert("Please select True or False as the correct answer.");
          setLoading(false);
          return;
        }
        finalCorrectAnswer = correctAnswer;
      } else if (questionType === "direct") {
        if (!directAnswer) {
          alert("Please enter the direct answer.");
          setLoading(false);
          return;
        }
        finalCorrectAnswer = directAnswer;
      }

      const payload = {
        ...questionData,
        correctAnswer: finalCorrectAnswer,
        createdBy,
      };

      const response = await axios.post("/api/admin/question", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.message === "Question added successfully") {
        const storedQuestions = JSON.parse(localStorage.getItem("addedQuestions")) || [];
        storedQuestions.push(response.data.data);
        localStorage.setItem("addedQuestions", JSON.stringify(storedQuestions));

        toast.success("Question added successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
          onClose: () => router.push("/admin/dashboard/addedquestions"),
        });

        setQuestionData({
          category: "",
          subCategory: "",
          questionText: "",
          options: ["", "", "", ""],
          correctOptionIndex: 0,
          questionType: "mcq",
          directAnswer: "",
          answerExplanation: "",
          createdBy: "",
          correctAnswer: false,
        });
      } else {
        alert(response.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Failed to add question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">
        Add New Question
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">


        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>

          <select name="category" onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-lg">
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-gray-400">
                {cat.name}
              </option>
            ))}
          </select>

        </div>

        {/* SubCategory */}
        <div>
          <label className="block mb-1 font-medium">SubCategory</label>
          <select name="subCategory" value={questionData.subCategory} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-lg">
            <option value="">Select Subcategory</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id} className="bg-gray-400">{sub.name}</option>
            ))}
          </select>
        </div>

        {/* Question Type */}
        <div>
          <label className="block mb-1 font-medium">Question Type</label>
          <select
            name="questionType"
            value={questionData.questionType}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg bg-gray-500"
          >
            <option value="mcq">Multiple Choice</option>
            <option value="truefalse">True/False</option>
            <option value="direct">Direct Answer</option>
          </select>
        </div>

        {/* Question Text - Tiptap */}
        <div >
          <label className="block mb-1 font-medium">Question</label>
          <TiptapEditor
            content={questionData.questionText}
            onChange={(value) => handleTiptapChange("questionText", value)}
          />
        </div>

        {/* Options */}
        {questionData.questionType === "mcq" && (
          <div className="space-y-3">
            {questionData.options.map((option, index) => (
              <div key={index} className="flex items-start gap-2">
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
                <div className="w-full">
                  <TiptapEditor
                    content={option}
                    onChange={(value) => handleOptionChange(index, value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* True/False Options */}
        {questionData.questionType === "truefalse" && (
          <div className="mt-2">
            <label className="block mb-1 font-medium">Correct Answer (True/False)</label>
            <select
              name="correctAnswer"
              value={questionData.correctAnswer}
              onChange={(e) =>
                setQuestionData((prev) => ({
                  ...prev,
                  correctAnswer: e.target.value === "true"
                }))
              }
              className="border px-2 py-1 rounded "
            >
              <option className="text-gray-700" value="">Select Answer</option>
              <option className="text-gray-700" value="true">True</option>
              <option className="text-gray-700" value="false">False</option>
            </select>
          </div>
        )}


        {/* Direct Answer */}
        {questionData.questionType === "direct" && (
          <div>
            <label className="block mb-1 font-medium">Direct Answer</label>
            <TiptapEditor
              content={questionData.directAnswer}
              onChange={(value) => handleTiptapChange("directAnswer", value)}
              placeholder="Enter correct answer"
              className="w-full border border-gray-300 p-2 rounded-lg"

            />
            {/* <input
              type="text"
              name="directAnswer"
              value={questionData.directAnswer}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Enter correct answer"
            /> */}
          </div>
        )}

        {/* Answer Explanation */}
        <div>
          <label className="block mb-1 font-medium">Answer Explanation</label>
          <TiptapEditor
            content={questionData.answerExplanation}
            onChange={(value) => handleTiptapChange("answerExplanation", value)}
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestion;
