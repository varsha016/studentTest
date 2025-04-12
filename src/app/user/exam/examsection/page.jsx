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

    // Pagination logic
    const totalPages = Math.ceil(questions?.length / questionsPerPage);
    const startIndex = currentPage * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const displayedQuestions = questions?.slice(startIndex, endIndex);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-r from-gray-100 to-gray-200">
            {/* Sidebar */}
            <div className="lg:w-1/4 w-full p-6 bg-white shadow-md overflow-auto">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Subcategories</h2>
                {loading ? (
                    <div className="flex flex-col items-center space-y-4">
                        {/* Spinner */}
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        {/* Skeleton loader */}
                        <ul className="space-y-2 w-full">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <li
                                    key={index}
                                    className="p-3 bg-gray-300 animate-pulse rounded-lg"
                                ></li>
                            ))}
                        </ul>
                    </div>
                ) : subcategories.length > 0 ? (
                    <ul className="space-y-2">
                        {subcategories?.map((subcategory) => (
                            <li
                                key={subcategory._id}
                                className={`p-3 bg-gray-100 hover:bg-blue-100 rounded-lg transition duration-300 cursor-pointer ${selectedSection?._id === subcategory._id ? "bg-blue-500 text-white" : ""
                                    }`}
                                onClick={() => handleSectionClick(subcategory)}
                            >
                                {subcategory.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No subcategories available</p>
                )}
            </div>

            {/* <div className="lg:w-1/4 w-full p-6 bg-white shadow-md overflow-auto">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Subcategories</h2>
                {loading ? (
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
                        {subcategories?.map((subcategory) => (
                            <li
                                key={subcategory._id}
                                className={`p-3 bg-gray-100 hover:bg-blue-100 rounded-lg transition duration-300 cursor-pointer ${selectedSection?._id === subcategory._id ? "bg-blue-500 text-white" : ""
                                    }`}
                                onClick={() => handleSectionClick(subcategory)}
                            >
                                {subcategory.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No subcategories available</p>
                )}
            </div> */}

            {/* Main Content */}
            <main className="lg:w-3/4 w-full p-6 bg-gray-50 overflow-y-scroll">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    {selectedSection ? `Questions for ${selectedSection.name}` : "Select a Subcategory"}
                </h2>
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : selectedSection ? (
                    <div>
                        {displayedQuestions?.map((question, index) => (
                            <div key={question._id} className="mb-6 border-b pb-4">
                                <p className="text-lg font-semibold text-gray-800">
                                    Q{startIndex + index + 1}:{" "}
                                    <span
                                        className="prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: question?.questionText }}
                                    />
                                </p>
                                {question.questionType === "direct" ? (
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-lg"
                                        placeholder="Enter your answer"
                                        value={answers[question._id] || ""}
                                        onChange={(e) =>
                                            setAnswers((prev) => ({ ...prev, [question._id]: e.target.value }))
                                        }
                                    />
                                ) : (
                                    <ul className="mt-2 space-y-2">
                                        {question.options.map((option, optIndex) => (
                                            <li key={optIndex} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name={`mcq-${question._id}`}
                                                        value={option}
                                                        checked={answers[question._id] === option}
                                                        onChange={() =>
                                                            setAnswers((prev) => ({ ...prev, [question._id]: option }))
                                                        }
                                                    />
                                                    <span>{option}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className={`px-4 py-2 rounded-lg ${currentPage === 0
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageClick(index)}
                                    className={`px-4 py-2 rounded-lg ${currentPage === index
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-300 hover:bg-blue-400 hover:text-white"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage === totalPages - 1}
                                className={`px-4 py-2 rounded-lg ${currentPage === totalPages - 1
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-lg text-gray-500 mt-4">
                        Select a subcategory to view questions.
                    </p>
                )}
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