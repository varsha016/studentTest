


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
            {/* <pre>{JSON.stringify(displayedQuestions, null, 2)}</pre> */}
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
                                    Q{startIndex + index + 1}:{" "}
                                    <span
                                        className="prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: question?.questionText }}
                                    />
                                    {/* Q{startIndex + index + 1}: {question.questionText} */}
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