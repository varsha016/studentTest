


// "use client";

// import axios from "axios";
// import { Suspense, useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { set } from "mongoose";
// import { ArrowUp } from "lucide-react";
// import jwtDecode from "jwt-decode";
// import jsPDF from "jspdf";


// const SectionPageContent = () => {
//     const searchParams = useSearchParams();
//     const subcategoryId = searchParams.get("id") || "No value";
//     // const paramValue = searchParams.get('key') || 'No value';
//     const [userData, setUserData] = useState([]);


//     const [sections, setSections] = useState([]);
//     const [selectedSection, setSelectedSection] = useState(null);
//     const [questions, setQuestions] = useState([]);

//     const [answers, setAnswers] = useState({});
//     const [completedSections, setCompletedSections] = useState(new Set());
//     // const [testAttemptId, setTestAttemptId] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [results, setResults] = useState(null);
//     const [subcategories, setSubcategories] = useState([]);
//     const [loading, setLoading] = useState(true);


//     const router = useRouter();
//     const [userId, setUserId] = useState(null);
//     const [userName, setUserName] = useState(null);
//     useEffect(() => {
//         const storedUserId = localStorage.getItem("userId");
//         setUserId(storedUserId);
//         const storedUserName = localStorage.getItem("userName");
//         setUserName(storedUserName);
//     }, []);

//     useEffect(() => {
//         // if (typeof window !== "undefined") {
//         //     const storedUserId = localStorage.getItem("userId");
//         //     const storedUserName = localStorage.getItem("userName");

//         //     if (!storedUserId) {
//         //         window.alert("You cannot start the test before login.");
//         //         router.push("/user/login");
//         //     } else {
//         //         setUserId(storedUserId);
//         //         setUserName(storedUserName);
//         //     }

//         setLoading(true);
//         fetch(`/api/admin/getallsubcategory`)
//             .then((res) => res.json())
//             .then((data) => setSubcategories(data))
//             .catch((error) => console.error("Error fetching subcategories:", error))
//             .finally(() => setLoading(false));
//         // }
//     }, [router]);



//     console.log(userId, "user id");


//     useEffect(() => {
//         setLoading(true);
//         fetch(`/api/admin/getallsubcategory`)
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log("API Response:", data); // Debugging log
//                 if (data?.subcategories && Array.isArray(data.subcategories)) {
//                     setSubcategories(data.subcategories); // Extract the array
//                 } else {
//                     console.error("Invalid data format: Expected an object with a 'subcategories' array", data);
//                     setSubcategories([]); // Fallback to an empty array
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error fetching subcategories:", error);
//                 setSubcategories([]); // Fallback to an empty array on error
//             })
//             .finally(() => setLoading(false));
//     }, []);

//     useEffect(() => {
//         const fetchSections = async () => {
//             if (!subcategoryId) return;
//             setLoading(true);
//             try {
//                 const response = await axios.get(`/api/admin/allsection`, {
//                     params: { subcategoryId },
//                 });
//                 setLoading(false);
//                 setSections(response.data.sections);
//                 if (response.data.sections.length > 0) {
//                     handleSectionClick(response.data.sections[0]); // Default open first section
//                 }
//             } catch (error) {
//                 console.error("Error fetching sections:", error);
//             }
//         };

//         fetchSections();
//     }, [subcategoryId,]);

//     const handleSectionClick = (section) => {
//         if (completedSections.has(section._id)) return;

//         setSelectedSection(section);
//         setQuestions(section.questions);
//         // setCurrentQuestionIndex(0);

//         setAnswers((prevAnswers) => ({
//             ...prevAnswers,
//             ...section.questions.reduce((acc, q) => ({ ...acc, [q._id]: prevAnswers[q._id] || null }), {}),
//         }));
//     };



//     const handleSubmitTest = async () => {
//         if (!selectedSection || isSubmitting) return;

//         setIsSubmitting(true);

//         try {
//             const responses = questions.map((q) => {
//                 const isDirectAnswer = q.questionType === "direct";

//                 return {
//                     questionId: q._id,
//                     questionText: q.questionText,
//                     answer: answers[q._id] !== undefined ? answers[q._id] : null,
//                     correctOptionIndex: !isDirectAnswer ? q.correctOptionIndex : null,
//                     directAnswer: isDirectAnswer ? q.directAnswer : null,
//                 };
//             });

//             console.log(responses, "responses");

//             const response = await axios.post("/api/user/submittest", {
//                 userId,
//                 sectionId: selectedSection._id,
//                 responses,
//             });

//             if (response.status === 201) {
//                 alert("Test submitted successfully!");
//                 setCompletedSections((prev) => new Set([...prev, selectedSection._id]));
//                 setResults(response.data);
//                 setSelectedSection(null);
//             }
//         } catch (error) {
//             console.error("Error submitting test:", error);
//             alert("Failed to submit test. Try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };


//     useEffect(() => {
//         const fetchData = async () => {
//             const storedUserId = userId || localStorage.getItem("userId");

//             if (!storedUserId) {
//                 console.warn("No userId available. Skipping data fetch.");
//                 setLoading(false); // Ensure loading is set to false if no userId is found
//                 return;
//             }

//             try {
//                 const response = await fetch(`/api/user/getResult?userId=${storedUserId}`);
//                 const data = await response.json();
//                 console.log(data, "getResult dataaa");

//                 if (data?.success) {
//                     setUserData(data?.data);
//                 } else {
//                     console.error("Failed to fetch data:", data?.message);
//                 }
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [userId]);


//     const downloadResults = () => {
//         if (!userData?.length === 0) {
//             alert("No test data available to download.");
//             return;
//         }

//         const doc = new jsPDF();
//         const margin = 10;
//         let y = margin;

//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(18);
//         doc.text("Test Results Report", margin, y);
//         y += 10;

//         doc.setFontSize(12);
//         doc.setFont("helvetica", "normal");
//         doc.text(`User ID: ${userId}`, margin, y);
//         y += 8;

//         doc.setFontSize(12);
//         doc.setFont("helvetica", "normal");
//         doc.text(`User Name: ${userName}`, margin, y);
//         y += 8;

//         // Iterate through attempts
//         userData.forEach((attempt, index) => {
//             if (y > 270) {
//                 doc.addPage();
//                 y = margin;
//             }

//             doc.setFontSize(14);
//             doc.setFont("helvetica", "bold");
//             doc.text(`Attempt ${index + 1}`, margin, y);
//             y += 8;

//             // doc.setFontSize(12);
//             // doc.setFont("helvetica", "normal");
//             // doc.text(`Score: ${attempt.score || "N/A"}`, margin, y);
//             // doc.text(`Correct Answers: ${attempt.correctAnswers || 0}`, margin + 80, y);
//             // doc.text(`Total Questions: ${attempt.totalQuestions || 0}`, margin + 160, y);
//             // y += 8;

//             // const formattedDate = attempt.createdAt ? new Date(attempt.createdAt).toLocaleString() : "N/A";
//             // doc.text(`Attempt Date: ${formattedDate}`, margin, y);
//             // y += 10;

//             // Questions & Answers
//             doc.setFontSize(13);
//             doc.setFont("helvetica", "bold");
//             doc.text("Questions & Answers:", margin, y);
//             y += 8;

//             attempt.responses.forEach((response, i) => {
//                 if (y > 270) {
//                     doc.addPage();
//                     y = margin;
//                 }

//                 doc.setFontSize(11);
//                 doc.setFont("helvetica", "normal");
//                 doc.text(`Q${i + 1}: ${response?.questionId?.questionText || "Question not available"}`, margin, y);
//                 y += 6;

//                 doc.text(`Your Answer: ${response?.answer || "Not Answered"}`, margin, y);
//                 y += 6;

//                 // const isCorrect = response?.isCorrect ? "✅ Correct" : "❌ Incorrect";
//                 // doc.text(isCorrect, margin, y);
//                 // y += 10;
//             });

//             y += 10;
//         });

//         doc.save(`test_results_${userId}.pdf`);
//     };





//     const [currentPage, setCurrentPage] = useState(0);
//     const questionsPerPage = 2;

//     // Calculate the indexes for slicing questions
//     const totalPages = Math.ceil(questions.length / questionsPerPage);
//     const startIndex = currentPage * questionsPerPage;
//     const endIndex = startIndex + questionsPerPage;
//     const displayedQuestions = questions.slice(startIndex, endIndex);

//     // Handle Page Click
//     const handlePageClick = (page) => {
//         setCurrentPage(page);
//     };
//     console.log(subcategories, 'subcategories');


//     return (<>
//         {/* <pre>{JSON.stringify(subcategories, null, 2)}</pre> */}
//         {loading ? (
//             <div className="flex justify-center items-center h-20">
//                 <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//         ) : (
//             <div className="flex h-screen bg-gray-300  ">
//                 <div className="py-4 px-4 font-medium text-gray-700">
//                     {subcategories.length > 0 ? (
//                         subcategories.map((category) => (
//                             <div key={category._id}>
//                                 <ul className="flex flex-col py-1 overflow-y-scroll ">
//                                     <li>{category.name}</li>
//                                 </ul>
//                             </div>
//                         ))
//                     ) : (
//                         <p>No categories available</p>
//                     )}
//                 </div>
//                 {loading ? (
//                     <div className="flex justify-center items-center h-20">
//                         <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
//                     </div>
//                 ) : (
//                     <main className="w-3/4 p-6 bg-gray-200 overflow-y-scroll flex flex-col items-center">
//                         <h2 className="text-lg font-bold mb-4">Each Section Contains Maximum 50 questions.</h2>

//                         <aside>
//                             {loading ? (
//                                 <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
//                             )
//                                 : (
//                                     <ul className="flex gap-3">
//                                         {sections?.length > 0 ? (
//                                             sections?.map((section) => (
//                                                 <li
//                                                     key={section._id}
//                                                     className={`p-2 font-bold rounded cursor-pointer ${selectedSection?._id === section._id ? "bg-blue-500 text-white" : "bg-gray-300"}`}
//                                                     onClick={() => handleSectionClick(section)}
//                                                 >
//                                                     {section.name}
//                                                 </li>
//                                             ))
//                                         ) : (

//                                             <p className="text-gray-500"> No sections found.</p>
//                                         )}
//                                     </ul>
//                                 )
//                             }

//                         </aside>
//                         {selectedSection ? (
//                             <div className="w-full max-w-2xl bg-white p-6 shadow-md rounded mt-3">
//                                 <h2 className="text-xl font-bold mb-4">{selectedSection.name}</h2>
//                                 {questions.length > 0 ? (
//                                     <div>


//                                         {displayedQuestions.map((question, index) => (
//                                             <div key={question._id} className="mb-4">
//                                                 <p className="text-lg font-semibold">
//                                                     Q{startIndex + index + 1}: {question.questionText}
//                                                 </p>

//                                                 {question.questionType === "direct" ? (
//                                                     // Render input for direct answer questions
//                                                     <ul className="mt-2 space-y-2">
//                                                         <li className="p-2 bg-gray-200 rounded">
//                                                             <label className="flex items-center space-x-2 w-full">
//                                                                 <input
//                                                                     type="text"
//                                                                     className="w-full p-2 border rounded"
//                                                                     placeholder="Enter your answer"
//                                                                     value={answers[question._id] || ""}
//                                                                     onChange={(e) =>
//                                                                         setAnswers((prev) => ({ ...prev, [question._id]: e.target.value }))
//                                                                     }
//                                                                 />
//                                                             </label>
//                                                         </li>
//                                                     </ul>
//                                                 ) : (
//                                                     // Render options for multiple-choice questions
//                                                     <ul className="mt-2 space-y-2">
//                                                         {question.options.map((option, optIndex) => (
//                                                             <li key={optIndex} className="p-2 bg-gray-200 rounded">
//                                                                 <label className="flex items-center space-x-2">
//                                                                     <input
//                                                                         type="radio"
//                                                                         name={`mcq-${question._id}`}
//                                                                         value={option}
//                                                                         checked={answers[question._id] === option}
//                                                                         onChange={() =>
//                                                                             setAnswers((prev) => ({ ...prev, [question._id]: option }))
//                                                                         }
//                                                                     />
//                                                                     <span>{option}</span>
//                                                                 </label>
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 )}
//                                             </div>
//                                         ))}


//                                         <div className="flex justify-between mt-4">
//                                             {/* Previous Button */}
//                                             <button
//                                                 onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
//                                                 disabled={currentPage === 0}
//                                                 className={`px-4 py-2 ${currentPage === 0 ? "bg-gray-300" : "bg-blue-500 text-white"} rounded`}
//                                             >
//                                                 Previous
//                                             </button>

//                                             {/* Page Numbers */}
//                                             {Array.from({ length: totalPages }, (_, index) => (
//                                                 <button
//                                                     key={index}
//                                                     onClick={() => handlePageClick(index)}
//                                                     className={`px-4 py-2 rounded ${currentPage === index ? "bg-blue-500 text-white" : "bg-gray-300"}`}
//                                                 >
//                                                     {index + 1}
//                                                 </button>
//                                             ))}

//                                             {/* Next Button */}
//                                             <button
//                                                 onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
//                                                 disabled={currentPage === totalPages - 1}
//                                                 className={`px-4 py-2 ${currentPage === totalPages - 1 ? "bg-gray-300" : "bg-blue-500 text-white"} rounded`}
//                                             >
//                                                 Next
//                                             </button>

//                                             {endIndex >= questions.length && (
//                                                 <button
//                                                     onClick={handleSubmitTest}
//                                                     className="bg-green-500 text-white px-4 py-2 rounded"
//                                                 >
//                                                     Submit Test
//                                                 </button>
//                                             )}

//                                         </div>
//                                     </div>
//                                 ) : <p>No questions available.</p>}
//                             </div>
//                         ) : <p className="animate-pulse text-lg text-cyan-400 font-semibold text-center mt-4">
//                             <span>

//                                 {/* <ArrowUp className="w-8 h-6" /> */}
//                                 Select a section to begin.
//                             </span>
//                         </p>
//                         }
//                         {results && (
//                             <button onClick={downloadResults} className="mt-4 p-2 bg-green-500 text-white rounded">Download Results</button>
//                         )}
//                     </main>

//                 )}

//             </div>
//         )
//         }

//     </>


//     );
// };



// // "use client";
// // import axios from "axios";
// // import { Suspense, useEffect, useState } from "react";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import { ArrowUp, Check, X, Save, BookOpen } from "lucide-react";
// // import jsPDF from "jspdf";
// // import Loading from "../../Loading/page";
// // import Link from "next/link";

// // const SectionPageContent = () => {
// //     const searchParams = useSearchParams();
// //     const subcategoryId = searchParams.get("id") || "No value";
// //     const [userData, setUserData] = useState([]);
// //     const [sections, setSections] = useState([]);
// //     const [selectedSection, setSelectedSection] = useState(null);
// //     const [questions, setQuestions] = useState([]);
// //     const [answers, setAnswers] = useState({});
// //     const [completedSections, setCompletedSections] = useState(new Set());
// //     const [isSubmitting, setIsSubmitting] = useState(false);
// //     const [results, setResults] = useState(null);
// //     const [subcategories, setSubcategories] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [showExplanation, setShowExplanation] = useState({});
// //     const [savedQuestions, setSavedQuestions] = useState([]);

// //     const router = useRouter();
// //     const [userId, setUserId] = useState(null);
// //     const [userName, setUserName] = useState(null);

// //     useEffect(() => {
// //         const storedUserId = localStorage.getItem("userId");
// //         setUserId(storedUserId);
// //         const storedUserName = localStorage.getItem("userName");
// //         setUserName(storedUserName);
// //     }, []);

// //     useEffect(() => {
// //         setLoading(true);
// //         fetch(`/api/admin/getallsubcategory`)
// //             .then((res) => res.json())
// //             .then((data) => setSubcategories(data))
// //             .catch((error) => console.error("Error fetching subcategories:", error))
// //             .finally(() => setLoading(false));
// //     }, [router]);

// //     useEffect(() => {
// //         const fetchSections = async () => {
// //             if (!subcategoryId) return;
// //             setLoading(true);
// //             try {
// //                 const response = await axios.get(`/api/admin/allsection`, {
// //                     params: { subcategoryId },
// //                 });
// //                 setLoading(false);
// //                 setSections(response.data.sections);
// //                 if (response.data.sections.length > 0) {
// //                     handleSectionClick(response.data.sections[0]); // Default open first section
// //                 }
// //             } catch (error) {
// //                 console.error("Error fetching sections:", error);
// //             }
// //         };

// //         fetchSections();
// //     }, [subcategoryId]);

// //     const handleSectionClick = (section) => {
// //         if (completedSections.has(section._id)) return;

// //         setSelectedSection(section);
// //         setQuestions(section.questions);
// //         setAnswers((prevAnswers) => ({
// //             ...prevAnswers,
// //             ...section.questions.reduce((acc, q) => ({ ...acc, [q._id]: prevAnswers[q._id] || null }), {}),
// //         }));
// //     };

// //     const handleSubmitTest = async () => {
// //         if (!selectedSection || isSubmitting) return;

// //         setIsSubmitting(true);

// //         try {
// //             const responses = questions?.map((q) => {
// //                 const isDirectAnswer = q.questionType === "direct";

// //                 return {
// //                     questionId: q._id,
// //                     questionText: q.questionText,
// //                     answer: answers[q._id] !== undefined ? answers[q._id] : null,
// //                     correctOptionIndex: !isDirectAnswer ? q.correctOptionIndex : null,
// //                     directAnswer: isDirectAnswer ? q.directAnswer : null,
// //                 };
// //             });

// //             const response = await axios.post("/api/user/submittest", {
// //                 userId,
// //                 sectionId: selectedSection._id,
// //                 responses,
// //             });

// //             if (response.status === 201) {
// //                 alert("Test submitted successfully!");
// //                 setUserData(response.data);
// //                 setCompletedSections((prev) => new Set([...prev, selectedSection._id]));
// //                 setResults(response.data);
// //                 setSelectedSection(null);
// //             }
// //         } catch (error) {
// //             console.error("Error submitting test:", error);
// //             alert("Failed to submit test. Try again.");
// //         } finally {
// //             setIsSubmitting(false);
// //         }
// //     };

// //     const handleSaveQuestion = (question) => {
// //         const savedQuestion = {
// //             ...question,
// //             userAnswer: answers[question._id], // Include the user's answer
// //         };

// //         // Update the state with the new saved question
// //         setSavedQuestions((prev) => {
// //             const updatedSavedQuestions = [...prev, savedQuestion];
// //             // Save the updated list to localStorage
// //             localStorage.setItem("savedQuestions", JSON.stringify(updatedSavedQuestions));
// //             return updatedSavedQuestions;
// //         });

// //         alert("Question saved!");
// //     };

// //     // const handleSaveQuestion = (question) => {
// //     //     const savedQuestion = {
// //     //         ...question,
// //     //         userAnswer: answers[question._id],
// //     //     };
// //     //     setSavedQuestions((prev) => [...prev, savedQuestion]);
// //     //     localStorage.setItem("savedQuestions", JSON.stringify([...savedQuestions, savedQuestion]));
// //     //     alert("Question saved!");
// //     // };

// //     const handleShowExplanation = (questionId) => {
// //         setShowExplanation((prev) => ({
// //             ...prev,
// //             [questionId]: !prev[questionId],
// //         }));
// //     };

// //     const [currentPage, setCurrentPage] = useState(0);
// //     const questionsPerPage = 2;
// //     const totalPages = Math.ceil(questions.length / questionsPerPage);
// //     const startIndex = currentPage * questionsPerPage;
// //     const endIndex = startIndex + questionsPerPage;
// //     const displayedQuestions = questions.slice(startIndex, endIndex);

// //     const handlePageClick = (page) => {
// //         setCurrentPage(page);
// //     };
// //     useEffect(() => {
// //         const fetchData = async () => {
// //             const storedUserId = userId || localStorage.getItem("userId");

// //             if (!storedUserId) {
// //                 console.warn("No userId available. Skipping data fetch.");
// //                 setLoading(false); // Ensure loading is set to false if no userId is found
// //                 return;
// //             }

// //             try {
// //                 const response = await fetch(`/api/user/getResult?userId=${storedUserId}`);
// //                 const data = await response.json();
// //                 console.log(data.data, "getResult dataaa");

// //                 if (data?.success) {
// //                     setUserData(data?.data);
// //                 } else {
// //                     console.error("Failed to fetch data:", data?.message);
// //                 }
// //             } catch (error) {
// //                 console.error("Error fetching user data:", error);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchData();
// //     }, [userId]);
// //     console.log(userData, "userData");

// //     const downloadResults = () => {
// //         if (!Array.isArray(userData?.data.responses) || userData.data.responses.length === 0) {
// //             alert("No test data available to download.");
// //             return;
// //         }

// //         const doc = new jsPDF();
// //         const margin = 10;
// //         let y = margin;

// //         doc.setFont("helvetica", "bold");
// //         doc.setFontSize(18);
// //         doc.text("Test Results Report", margin, y);
// //         y += 10;

// //         doc.setFontSize(12);
// //         doc.setFont("helvetica", "normal");
// //         doc.text(`User ID: ${userData.data.userId}`, margin, y);
// //         y += 8;

// //         doc.text(`Section ID: ${userData.data.sectionId}`, margin, y);
// //         y += 8;

// //         doc.text(`Completed At: ${new Date(userData.data.completedAt).toLocaleString()}`, margin, y);
// //         y += 8;

// //         doc.setFontSize(13);
// //         doc.setFont("helvetica", "bold");
// //         doc.text("Questions & Answers:", margin, y);
// //         y += 8;

// //         userData?.data?.responses.forEach((response, i) => {
// //             if (y > 270) {
// //                 doc.addPage();
// //                 y = margin;
// //             }

// //             doc.setFontSize(11);
// //             doc.setFont("helvetica", "normal");
// //             doc.text(`Q${i + 1}: ${response?.questionText || "Question not available"}`, margin, y);
// //             y += 6;

// //             doc.text(`Your Answer: ${response?.answer || "Not Answered"}`, margin, y);
// //             y += 6;
// //         });

// //         doc.save(`test_results_${userData.data.userId}.pdf`);
// //     };





// //     return (
// //         <div className="flex h-screen">
// //             <div className="p-6 bg-gray-100 rounded-lg shadow-sm max-w-md mx-auto">
// //                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
// //                 {subcategories.length > 0 ? (
// //                     <ul className="space-y-2">
// //                         {subcategories?.map((sub) => (
// //                             <Link key={sub._id} href={`/user/exam/examsection?id=${sub._id}`}>
// //                                 <div className="p-2 text-md font-semibold cursor-pointer hover:bg-gray-300 rounded-sm transition">
// //                                     {sub.name}
// //                                 </div>
// //                             </Link>
// //                             // <li
// //                             //     key={category._id}
// //                             //     className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-300"
// //                             // >
// //                             //     {category.name}
// //                             // </li>
// //                         ))}
// //                     </ul>
// //                 ) : (
// //                     <p className="text-gray-500">No categories available</p>
// //                 )}
// //             </div>
// //             <main className="w-3/4 p-6 bg-gray-200 overflow-y-scroll flex flex-col items-center">
// //                 {loading && <Loading />}
// //                 <h2 className="text-lg font-bold mb-4">Each Section Contains Maximum 50 questions.</h2>
// //                 <aside>
// //                     <ul className="flex gap-3">
// //                         {sections?.length > 0 ? (
// //                             sections?.map((section) => (
// //                                 <li
// //                                     key={section._id}
// //                                     className={`p-2 font-bold rounded cursor-pointer ${selectedSection?._id === section._id ? "bg-blue-500 text-white" : "bg-gray-300"}`}
// //                                     onClick={() => handleSectionClick(section)}
// //                                 >
// //                                     {section.name}
// //                                 </li>
// //                             ))
// //                         ) : (
// //                             <p className="text-gray-500"> No sections found.</p>
// //                         )}
// //                     </ul>
// //                 </aside>
// //                 {selectedSection ? (
// //                     <div className="w-full max-w-2xl bg-white p-6 shadow-md rounded mt-3">
// //                         <h2 className="text-xl font-bold mb-4">{selectedSection.name}</h2>
// //                         {questions.length > 0 ? (
// //                             <div>
// //                                 {displayedQuestions?.map((question, index) => (
// //                                     <div key={question._id} className="mb-4">
// //                                         <p className="text-lg font-semibold">
// //                                             Q{startIndex + index + 1}: {question.questionText}
// //                                         </p>
// //                                         {question.questionType === "direct" ? (
// //                                             <ul className="mt-2 space-y-2">
// //                                                 <li className="p-2 bg-gray-200 rounded">
// //                                                     <label className="flex items-center space-x-2 w-full">
// //                                                         <input
// //                                                             type="text"
// //                                                             className="w-full p-2 border rounded"
// //                                                             placeholder="Enter your answer"
// //                                                             value={answers[question._id] || ""}
// //                                                             onChange={(e) =>
// //                                                                 setAnswers((prev) => ({ ...prev, [question._id]: e.target.value }))
// //                                                             }
// //                                                         />
// //                                                     </label>
// //                                                 </li>
// //                                             </ul>
// //                                         ) : (
// //                                             <ul className="mt-2 space-y-2">
// //                                                 {question.options?.map((option, optIndex) => {
// //                                                     const isCorrect = optIndex === question.correctOptionIndex;
// //                                                     const isSelected = answers[question._id] === option;
// //                                                     return (
// //                                                         <li
// //                                                             key={optIndex}
// //                                                             className={`p-2 rounded ${isSelected ? (isCorrect ? "bg-green-100" : "bg-red-100") : "bg-gray-200"}`}
// //                                                         >
// //                                                             <div className="flex justify-between">
// //                                                                 <label className="flex items-center space-x-2">
// //                                                                     <input
// //                                                                         type="radio"
// //                                                                         name={`mcq-${question._id}`}
// //                                                                         value={option}
// //                                                                         checked={isSelected}
// //                                                                         onChange={() =>
// //                                                                             setAnswers((prev) => ({ ...prev, [question._id]: option }))
// //                                                                         }
// //                                                                     />
// //                                                                     <p>
// //                                                                         <span className={`${isSelected && isCorrect ? "font-bold" : ""}`}>
// //                                                                             {option}
// //                                                                         </span>

// //                                                                     </p>
// //                                                                 </label>
// //                                                                 {isSelected && (
// //                                                                     <span>
// //                                                                         {isCorrect ? <Check className="text-green-500" /> : <X className="text-red-500" />}
// //                                                                     </span>
// //                                                                 )}
// //                                                             </div>
// //                                                         </li>
// //                                                     );
// //                                                 })}
// //                                             </ul>
// //                                         )}
// //                                         <div className="flex gap-4 mt-4">
// //                                             <button
// //                                                 onClick={() => handleShowExplanation(question._id)}
// //                                                 className="flex items-center space-x-2  hover:bg-blue-500 rounded-sm bg-blue-100  py-1 px-1  roundedbg-blue-500 hover:text-white"
// //                                             >
// //                                                 {/* <BookOpen className="w-4 h-4" /> */}
// //                                                 <span>Explanation</span>
// //                                             </button>
// //                                             <button
// //                                                 onClick={() => handleSaveQuestion(question)}
// //                                                 className="flex items-center space-x-2  hover:bg-green-500 rounded-sm bg-green-100  py-1 px-1  roundedbg-green-500 hover:text-white"
// //                                             >
// //                                                 {/* <Save className="w-4 h-4" /> */}
// //                                                 <span>Save</span>
// //                                             </button>
// //                                         </div>
// //                                         {showExplanation[question._id] && (
// //                                             <div className="mt-2 p-2 bg-gray-100 rounded">
// //                                                 <p className="text-sm text-gray-700">{question.answerExplanation}</p>
// //                                             </div>
// //                                         )}
// //                                     </div>
// //                                 ))}
// //                                 <div className="flex justify-between mt-4">
// //                                     <button
// //                                         onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
// //                                         disabled={currentPage === 0}
// //                                         className={`px-4 py-2 ${currentPage === 0 ? "bg-gray-300" : "bg-blue-500 text-white"} rounded`}
// //                                     >
// //                                         Previous
// //                                     </button>
// //                                     {Array.from({ length: totalPages }, (_, index) => (
// //                                         <button
// //                                             key={index}
// //                                             onClick={() => handlePageClick(index)}
// //                                             className={`px-4 py-2 rounded ${currentPage === index ? "bg-blue-500 text-white" : "bg-gray-300"}`}
// //                                         >
// //                                             {index + 1}
// //                                         </button>
// //                                     ))}
// //                                     <button
// //                                         onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
// //                                         disabled={currentPage === totalPages - 1}
// //                                         className={`px-4 py-2 ${currentPage === totalPages - 1 ? "bg-gray-300" : "bg-blue-500 text-white"} rounded`}
// //                                     >
// //                                         Next
// //                                     </button>
// //                                     {endIndex >= questions.length && (
// //                                         <button
// //                                             onClick={handleSubmitTest}
// //                                             className="bg-green-500 text-white px-4 py-2 rounded"
// //                                         >
// //                                             Submit Test
// //                                         </button>
// //                                     )}
// //                                 </div>
// //                             </div>
// //                         ) : (
// //                             <p>No questions available.</p>
// //                         )}
// //                     </div>
// //                 ) : (
// //                     <p className="animate-pulse text-lg text-cyan-400 font-semibold text-center mt-4">
// //                         <span>Select a section to begin.</span>
// //                     </p>
// //                 )}
// //                 {results && (
// //                     <button onClick={downloadResults} className="mt-4 p-2 bg-green-500 text-white rounded">
// //                         Download Results
// //                     </button>
// //                 )}
// //             </main>
// //         </div>
// //     );
// // };
// const SectionPage = () => (
//     <Suspense fallback={<p>Loading...</p>}>
//         <SectionPageContent />
//     </Suspense>
// );

// export default SectionPage;
// // export default SectionPage;


"use client";

import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import jsPDF from "jspdf";

const SectionPageContent = () => {
    const searchParams = useSearchParams();
    const subcategoryId = searchParams.get("id") || "No value";

    const [subcategories, setSubcategories] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [completedSections, setCompletedSections] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 2;

    const router = useRouter();

    // Fetch user data from localStorage
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedUserName = localStorage.getItem("userName");
        setUserId(storedUserId);
        setUserName(storedUserName);
    }, []);

    // Fetch subcategories
    useEffect(() => {
        setLoading(true);
        fetch(`/api/admin/getallsubcategory`)
            .then((res) => res.json())
            .then((data) => {
                if (data?.subcategories && Array.isArray(data.subcategories)) {
                    setSubcategories(data.subcategories);
                } else {
                    console.error("Invalid data format: Expected an object with a 'subcategories' array", data);
                    setSubcategories([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching subcategories:", error);
                setSubcategories([]);
            })
            .finally(() => setLoading(false));
    }, []);

    // Fetch sections for the selected subcategory
    useEffect(() => {
        const fetchSections = async () => {
            if (!subcategoryId) return;
            setLoading(true);
            try {
                const response = await axios.get(`/api/admin/allsection`, {
                    params: { subcategoryId },
                });
                setSections(response.data.sections || []);
                if (response.data.sections?.length > 0) {
                    handleSectionClick(response.data.sections[0]); // Default open first section
                }
            } catch (error) {
                console.error("Error fetching sections:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSections();
    }, [subcategoryId]);

    // Handle section click
    const handleSectionClick = (section) => {
        if (completedSections.has(section._id)) return;

        setSelectedSection(section);
        setQuestions(section.questions);
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            ...section?.questions?.reduce((acc, q) => ({ ...acc, [q._id]: prevAnswers[q._id] || null }), {}),
        }));
    };

    // Handle test submission
    const handleSubmitTest = async () => {
        if (!selectedSection || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const responses = questions.map((q) => ({
                questionId: q._id,
                questionText: q.questionText,
                answer: answers[q._id] !== undefined ? answers[q._id] : null,
                correctOptionIndex: q.questionType !== "direct" ? q.correctOptionIndex : null,
                directAnswer: q.questionType === "direct" ? q.directAnswer : null,
            }));

            const response = await axios.post("/api/user/submittest", {
                userId,
                sectionId: selectedSection._id,
                responses,
            });

            if (response.status === 201) {
                alert("Test submitted successfully!");
                setCompletedSections((prev) => new Set([...prev, selectedSection._id]));
                setResults(response.data);
                setSelectedSection(null);
            }
        } catch (error) {
            console.error("Error submitting test:", error);
            alert("Failed to submit test. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Download results as PDF
    const downloadResults = () => {
        if (!results) {
            alert("No test data available to download.");
            return;
        }

        const doc = new jsPDF();
        let y = 10;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Test Results Report", 10, y);
        y += 10;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`User ID: ${userId}`, 10, y);
        y += 8;

        doc.text(`User Name: ${userName}`, 10, y);
        y += 8;

        results.responses.forEach((response, index) => {
            if (y > 270) {
                doc.addPage();
                y = 10;
            }

            doc.text(`Q${index + 1}: ${response.questionText}`, 10, y);
            y += 6;

            doc.text(`Your Answer: ${response.answer || "Not Answered"}`, 10, y);
            y += 6;
        });

        doc.save(`test_results_${userId}.pdf`);
    };

    // Pagination logic
    const totalPages = Math.ceil(questions?.length / questionsPerPage);
    const startIndex = currentPage * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const displayedQuestions = questions?.slice(startIndex, endIndex);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex h-screen bg-gray-300">
            <pre>{JSON.stringify(displayedQuestions, null, 2)}</pre>
            {/* Left Sidebar: Subcategories */}
            <div className="w-1/4 p-4 bg-gray-100">
                <h2 className="text-lg font-bold mb-4">Subcategories</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : subcategories.length > 0 ? (
                    <ul>
                        {subcategories.map((subcategory) => (
                            <li
                                key={subcategory._id}
                                className={`p-2 cursor-pointer rounded ${selectedSection?._id === subcategory._id
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-200"
                                    }`}
                                onClick={() => handleSectionClick(subcategory)}
                            >
                                {subcategory.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No subcategories available</p>
                )}
            </div>

            {/* Main Content: Sections and Questions */}
            <div className="w-3/4 p-4 bg-gray-200">
                <h2 className="text-lg font-bold mb-4">
                    {selectedSection ? `Questions for ${selectedSection.name}` : "Select a Subcategory"}
                </h2>
                {loading ? (
                    <p>Loading...</p>
                ) : selectedSection ? (
                    <div>
                        {displayedQuestions?.map((question, index) => (
                            <div key={question._id} className="mb-4">
                                <p className="text-lg font-semibold">
                                    Q{startIndex + index + 1}: {question.questionText}
                                </p>
                                {question.questionType === "direct" ? (
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        placeholder="Enter your answer"
                                        value={answers[question._id] || ""}
                                        onChange={(e) =>
                                            setAnswers((prev) => ({ ...prev, [question._id]: e.target.value }))
                                        }
                                    />
                                ) : (
                                    <ul>
                                        {question.options.map((option, optIndex) => (
                                            <li key={optIndex}>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`mcq-${question._id}`}
                                                        value={option}
                                                        checked={answers[question._id] === option}
                                                        onChange={() =>
                                                            setAnswers((prev) => ({ ...prev, [question._id]: option }))
                                                        }
                                                    />
                                                    {option}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageClick(index)}
                                    className={`px-4 py-2 rounded ${currentPage === index ? "bg-blue-500 text-white" : "bg-gray-300"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage === totalPages - 1}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Next
                            </button>
                        </div>

                        <button
                            onClick={handleSubmitTest}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Submit Test
                        </button>
                    </div>
                ) : (
                    <p>No sections available</p>
                )}

                {results && (
                    <button
                        onClick={downloadResults}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Download Results
                    </button>
                )}
            </div>
        </div>
    );
};

const SectionPage = () => (
    <Suspense fallback={<p>Loading...</p>}>
        <SectionPageContent />
    </Suspense>
);

export default SectionPage;