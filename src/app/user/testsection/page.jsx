"use client";
import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUp, Check, X, Save, BookOpen } from "lucide-react";
import jsPDF from "jspdf";
import Loading from "../Loading/page";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const SectionPageContent = () => {
    const searchParams = useSearchParams();
    const [downloading, setDownloading] = useState(false);
    const subcategoryId = searchParams.get("id") || "No value";
    const [userData, setUserData] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [completedSections, setCompletedSections] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showExplanation, setShowExplanation] = useState({});
    const [savedQuestions, setSavedQuestions] = useState([]);

    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setToken(token)
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);
        const storedUserName = localStorage.getItem("userName");
        setUserName(storedUserName);
    }, []);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/admin/getallsubcategory`);
                if (!response.ok) throw new Error('Failed to fetch subcategories');

                const data = await response.json();
                // Handle both array and object response formats
                const subcategoriesData = data?.subcategories || data?.data || data || [];
                setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
                setSubcategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSubcategories();
    }, [router]);

    useEffect(() => {
        const fetchSections = async () => {
            if (!subcategoryId) return;
            setLoading(true);
            try {
                const response = await axios.get(`/api/admin/allsection`, {
                    params: { subcategoryId },
                });
                setLoading(false);
                setSections(response.data.sections);
                if (response.data.sections.length > 0) {
                    handleSectionClick(response.data.sections[0]); // Default open first section
                }
            } catch (error) {
                console.error("Error fetching sections:", error);
            }
        };

        fetchSections();
    }, [subcategoryId]);

    const handleSectionClick = (section) => {
        if (completedSections.has(section._id)) return;

        setSelectedSection(section);
        setQuestions(section.questions);
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            ...section.questions.reduce((acc, q) => ({ ...acc, [q._id]: prevAnswers[q._id] || null }), {}),
        }));
    };

    const handleSubmitTest = async () => {
        if (!selectedSection || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const responses = questions?.map((q) => {
                const isDirectAnswer = q.questionType === "direct";

                return {
                    questionId: q._id,
                    questionText: q.questionText,
                    answer: answers[q._id] !== undefined ? answers[q._id] : null,
                    correctOptionIndex: !isDirectAnswer ? q.correctOptionIndex : null,
                    directAnswer: isDirectAnswer ? q.directAnswer : null,
                };
            });

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


    const handleSaveQuestion = (question) => {
        const savedQuestion = {
            ...question,
            userAnswer: answers[question._id], // Include the user's answer
        };

        // Ensure it fetches the previous data safely
        const currentQuestions = JSON.parse(localStorage.getItem("savedQuestions")) || [];
        const updatedSavedQuestions = [...currentQuestions, savedQuestion];

        // Update localStorage
        localStorage.setItem("savedQuestions", JSON.stringify(updatedSavedQuestions));
        setSavedQuestions(updatedSavedQuestions);

        alert("Question saved!");
    };

    const handleShowExplanation = (questionId) => {
        setShowExplanation((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
        }));
    };

    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 2;
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const startIndex = currentPage * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const displayedQuestions = questions.slice(startIndex, endIndex);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };


    // const downloadQuestions = async () => {
    //     try {
    //         // Fetch all questions using Axios
    //         const response = await axios.get("/api/admin/getallquestion?status=approved");

    //         if (!response.data.success) {
    //             alert("Failed to fetch questions.");
    //             return;
    //         }

    //         const questions = response.data.data;

    //         if (!questions.length) {
    //             alert("No questions available to download.");
    //             return;
    //         }

    //         // Initialize jsPDF
    //         const doc = new jsPDF();
    //         let yOffset = 10;

    //         doc.setFontSize(12);
    //         doc.text("Question Bank", 105, yOffset, { align: "center" });

    //         // Iterate over questions and add them to the PDF
    //         questions.forEach((question, index) => {
    //             yOffset += 10;

    //             if (yOffset > 280) {
    //                 doc.addPage();
    //                 yOffset = 10;
    //             }

    //             doc.setFontSize(10);
    //             doc.text(`Q${index + 1}: ${question.questionText}`, 10, yOffset);

    //             if (question.options?.length) {
    //                 question.options.forEach((option, optIndex) => {
    //                     yOffset += 6;
    //                     doc.text(`  ${String.fromCharCode(65 + optIndex)}. ${option}`, 15, yOffset);
    //                 });
    //             }

    //             yOffset += 8;
    //         });

    //         // Save PDF
    //         doc.save("Questions.pdf");
    //         // alert("Questions downloaded as PDF!");
    //     } catch (error) {
    //         console.error("Error downloading questions:", error);
    //         alert("Error occurred while downloading questions.");
    //     }
    // };

    // const downloadQuestions = async () => {

    //     try {
    //         // Fetch only approved questions
    //         const response = await axios.get("/api/admin/getallquestion?status=approved",
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         const questions = response.data;

    //         if (!Array.isArray(questions) || questions.length === 0) {
    //             alert("No approved questions available to download.");
    //             return;
    //         }

    //         const doc = new jsPDF();
    //         let yOffset = 10;

    //         doc.setFontSize(12);
    //         doc.text("Approved Question Bank", 105, yOffset, { align: "center" });

    //         questions.forEach((question, index) => {
    //             yOffset += 10;

    //             if (yOffset > 280) {
    //                 doc.addPage();
    //                 yOffset = 10;
    //             }

    //             doc.setFontSize(10);
    //             doc.text(`Q${index + 1}: ${stripHtml(question.questionText)}`, 10, yOffset);

    //             if (question.options?.length) {
    //                 question.options.forEach((option, optIndex) => {
    //                     yOffset += 6;
    //                     doc.text(`  ${String.fromCharCode(65 + optIndex)}. ${option}`, 15, yOffset);
    //                 });
    //             }

    //             yOffset += 8;
    //         });

    //         doc.save("Approved_Questions.pdf");

    //     } catch (error) {
    //         console.error("Error downloading approved questions:", error);
    //         alert("Error occurred while downloading approved questions.");
    //     }
    // };

    // Utility to strip HTML tags
    // function stripHtml(html) {
    //     const tempDiv = document.createElement("div");
    //     tempDiv.innerHTML = html;
    //     return tempDiv.textContent || tempDiv.innerText || "";
    // }
    const downloadQuestions = async () => {
        setDownloading(true); // start loading
        toast.info("Preparing your download...", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
        });

        try {
            const response = await axios.get(
                "/api/admin/getallquestion?status=approved",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const questions = response.data;

            if (!Array.isArray(questions) || questions.length === 0) {
                toast.warn("No approved questions available to download.");
                setDownloading(false);
                return;
            }

            const doc = new jsPDF();
            let yOffset = 10;

            doc.setFontSize(12);
            doc.text("Approved Question Bank", 105, yOffset, { align: "center" });

            questions.forEach((question, index) => {
                yOffset += 10;
                if (yOffset > 280) {
                    doc.addPage();
                    yOffset = 10;
                }

                doc.setFontSize(10);
                doc.text(`Q${index + 1}: ${stripHtml(question.questionText)}`, 10, yOffset);

                if (question.options?.length) {
                    question.options.forEach((option, optIndex) => {
                        yOffset += 6;
                        doc.text(`  ${String.fromCharCode(65 + optIndex)}. ${option}`, 15, yOffset);
                    });
                }

                yOffset += 8;
            });

            doc.save("Downloaded_Questions.pdf");
            toast.success("Download complete!");

        } catch (error) {
            console.error("Error downloading approved questions:", error);
            toast.error("Error occurred while downloading.");
        } finally {
            setDownloading(false); // end loading
        }
    };

    // Utility to strip HTML tags
    function stripHtml(html) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    }


    return (
        <div className="flex h-screen">
            <div className="p-6 bg-gray-100 rounded-lg shadow-sm max-w-md mx-auto overflow-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Sub Categories</h2>

                {loading ? (
                    // Skeleton Loader
                    <ul className="space-y-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <li
                                key={index}
                                className="p-3 bg-gray-300 animate-pulse rounded-lg"
                            ></li>
                        ))}
                    </ul>
                ) : subcategories.length > 0 ? (
                    <ul className="space-y-2">
                        {subcategories?.map((category) => (
                            <li
                                key={category._id}
                                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-300"
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No categories available</p>
                )}
            </div>


            <main className="w-3/4 p-6 bg-gray-200 overflow-y-scroll flex flex-col items-center">
                {loading && <Loading />}
                <h2 className="text-lg font-bold mb-4">Each Section Contains Maximum 50 Questions</h2>
                <aside>
                    <ul className="flex gap-3">
                        {sections?.length > 0 ? (
                            sections?.map((section) => (
                                <li
                                    key={section._id}
                                    className={`p-2 font-bold rounded cursor-pointer ${selectedSection?._id === section._id ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                                    onClick={() => handleSectionClick(section)}
                                >
                                    {section.name}
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500"> Wait for the sections to load.</p>
                        )}
                    </ul>
                </aside>
                <div className="w-full max-w-3xl mt-6">
                    {selectedSection ? (
                        <div className="w-full bg-white p-6 shadow-md rounded">
                            {questions.length > 0 ? (
                                <div>
                                    {displayedQuestions?.map((question, index) => (
                                        <div key={question._id} className="mb-6 border-b pb-4">
                                            <p className="text-lg font-semibold">
                                                Q{startIndex + index + 1}:{" "}
                                                <span
                                                    className="prose prose-sm max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: question?.questionText }}
                                                />
                                            </p>

                                            {question.questionType === "direct" ? (
                                                <ul className="mt-2 space-y-2">
                                                    <li className="p-2 bg-gray-200 rounded">
                                                        <label className="flex items-center space-x-2 w-full">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 border rounded"
                                                                placeholder="Enter your answer"
                                                                value={answers[question._id] || ""}
                                                                onChange={(e) =>
                                                                    setAnswers((prev) => ({ ...prev, [question._id]: e.target.value }))
                                                                }
                                                            />
                                                        </label>
                                                    </li>
                                                </ul>
                                            ) : (
                                                <ul className="mt-2 space-y-2">
                                                    {question.options?.map((option, optIndex) => {
                                                        const isCorrect = optIndex === question.correctOptionIndex;
                                                        const isSelected = answers[question._id] === option;
                                                        return (
                                                            <li
                                                                key={optIndex}
                                                                className={`p-2 rounded ${isSelected ? (isCorrect ? "bg-green-100" : "bg-red-100") : "bg-gray-200"}`}
                                                            >
                                                                <div className="flex justify-between">
                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name={`mcq-${question._id}`}
                                                                            value={option}
                                                                            checked={isSelected}
                                                                            onChange={() =>
                                                                                setAnswers((prev) => ({ ...prev, [question._id]: option }))
                                                                            }
                                                                        />
                                                                        <p>
                                                                            <span className={`${isSelected && isCorrect ? "font-bold" : ""}`}>
                                                                                {option}
                                                                            </span>

                                                                        </p>
                                                                    </label>
                                                                    {isSelected && (
                                                                        <span>
                                                                            {isCorrect ? <Check className="text-green-500" /> : <X className="text-red-500" />}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                            <div className="flex gap-4 mt-4">
                                                <button
                                                    onClick={() => handleShowExplanation(question._id)}
                                                    className="flex items-center space-x-2  hover:bg-blue-500 rounded-sm bg-blue-100  py-1 px-1  roundedbg-blue-500 hover:text-white"
                                                >
                                                    {/* <BookOpen className="w-4 h-4" /> */}
                                                    <span>Explanation</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSaveQuestion(question)}
                                                    className="flex items-center space-x-2  hover:bg-green-500 rounded-sm bg-green-100  py-1 px-1  roundedbg-green-500 hover:text-white"
                                                >
                                                    {/* <Save className="w-4 h-4" /> */}
                                                    <span>Save</span>
                                                </button>
                                            </div>
                                            {showExplanation[question._id] && (
                                                <div className="mt-2 p-2 bg-gray-100 rounded">
                                                    <p className="text-sm text-gray-700">{question.answerExplanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                                            disabled={currentPage === 0}
                                            className={`px-4 py-2 ${currentPage === 0 ? "bg-gray-300" : "bg-blue-500 text-white"} rounded`}
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePageClick(index)}
                                                className={`px-4 py-2 rounded ${currentPage === index ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                                            disabled={currentPage === totalPages - 1}
                                            className={`px-4 py-2 ${currentPage === totalPages - 1 ? "bg-gray-300" : "bg-blue-500 text-white"} rounded`}
                                        >
                                            Next
                                        </button>

                                    </div>
                                </div>
                            ) : (
                                <p>No questions available.</p>
                            )}
                        </div>
                    ) : (
                        <p className="animate-pulse text-lg text-cyan-400 font-semibold text-center mt-4">
                            <span>Select a section to begin.</span>
                        </p>
                    )}
                    <div>
                        <button
                            onClick={downloadQuestions}
                            className="px-4 py-2 mt-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                            disabled={downloading}
                        >
                            {downloading ? "Downloading..." : "Download Questions as PDF"}
                        </button>


                    </div>
                </div>
            </main>

        </div>
    );
};
const SectionPage = () => (
    <Suspense fallback={<p>Loading...</p>}>
        <SectionPageContent />
    </Suspense>
);

export default SectionPage;


