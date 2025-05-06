"use client";

import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
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
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 2;

    const router = useRouter();

    // Fetch subcategories
    useEffect(() => {
        setLoading(true);
        fetch(`/api/admin/getallsubcategory`)
            .then((res) => res.json())
            .then((data) => {
                if (data?.subcategories && Array.isArray(data.subcategories)) {
                    setSubcategories(data.subcategories);
                } else {
                    setSubcategories([]);
                }
            })
            .catch(() => setSubcategories([]))
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
            } catch {
                setSections([]);
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

    // Submit test
    const handleSubmitTest = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/user/submittest", {
                answers,
                sectionId: selectedSection?._id,
            });
            if (response.status === 200) {
                alert("Test submitted successfully!");
                router.push("/user/dashboard"); // Redirect to dashboard or another page
            }
        } catch (error) {
            console.error("Error submitting test:", error);
            alert("Failed to submit the test. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const customStyles = {
        control: (base) => ({
            ...base,
            padding: '2px',
            borderRadius: '0.5rem',
            backgroundColor: '#f3f4f6', // Tailwind bg-gray-100
            border: 'none',
            boxShadow: 'none',
            ':hover': {
                backgroundColor: '#dbeafe', // Tailwind hover:bg-blue-100
            },
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#3b82f6' // Tailwind bg-blue-500
                : state.isFocused
                    ? '#dbeafe' // Tailwind hover:bg-blue-100
                    : '#f3f4f6', // Tailwind bg-gray-100
            color: state.isSelected ? 'white' : '#1f2937', // Tailwind text-white or text-gray-800
            cursor: 'pointer',
            padding: '10px',
        }),
    };
    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-r from-gray-100 to-gray-200">
            {/* Sidebar */}
            <div className="lg:w-1/4 w-full p-6 bg-white shadow-md overflow-auto">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Subcategories</h2>
                {loading ? (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <ul className="space-y-2 w-full">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <li
                                    key={index}
                                    className="p-3 bg-gray-300 animate-pulse rounded-lg"
                                ></li>
                            ))}
                        </ul>
                    </div>
                ) :
                    subcategories.length > 0 ? (
                        <>
                            {/* Mobile View: Select Dropdown (visible only on <lg) */}
                            {/* <div className="lg:hidden mb-4 w-full">
                                <select
                                    className=" max-w-64 p-3 border-none rounded-lg bg-gray-100 hover:bg-blue-100 focus:bg-blue-50 transition duration-300"
                                    // className="w-full p-3 rounded-lg bg-gray-100 hover:bg-blue-100 focus:bg-blue-50 transition duration-300"
                                    value={subcategoryId}
                                    onChange={(e) => {
                                        const selectedSubcategory = subcategories.find(
                                            (sub) => sub._id === e.target.value
                                        );
                                        if (selectedSubcategory) {
                                            handleSectionClick(selectedSubcategory);
                                        }
                                    }}
                                >
                                    <option value="" className="font-normal text-sm text-gray-700">Select a subcategory</option>
                                    {subcategories.map((category) => (
                                        <option
                                            key={category._id}
                                            value={category._id}
                                            title={category.name}
                                            className={`p-3  rounded-lg transition duration-300 cursor-pointer ${category._id === subcategoryId
                                                ? "bg-blue-600 text-sm text-white hover:bg-blue-800"
                                                : "bg-gray-100 text-sm hover:bg-blue-100"
                                                }`}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div> */}
                            <div className="lg:hidden mb-4 w-full">
                                <Select
                                    styles={customStyles}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    options={subcategories.map((category) => ({
                                        value: category._id,
                                        label: category.name,
                                    }))}
                                    value={subcategories.find((sub) => sub._id === subcategoryId) || null}
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            const selectedSubcategory = subcategories.find(
                                                (sub) => sub._id === selectedOption.value
                                            );
                                            if (selectedSubcategory) {
                                                handleSectionClick(selectedSubcategory);
                                            }
                                        }
                                    }}
                                    placeholder="Select a subcategory"
                                    isClearable
                                />
                            </div>

                            {/* Desktop View: Clickable List (visible only on lg and above) */}
                            <div className="hidden lg:block max-h-48 overflow-y-auto pr-2">
                                <ul className="space-y-2">
                                    {subcategories.map((category) => (
                                        <li
                                            key={category._id}
                                            className={`p-3 rounded-lg cursor-pointer transition duration-300 ${category._id === subcategoryId
                                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                                : "bg-gray-100 hover:bg-blue-100"
                                                }`}
                                            onClick={() => handleSectionClick(category)}
                                        >
                                            {category.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )
                        : (
                            <p className="text-gray-500">No subcategories available</p>
                        )}
            </div>

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
                                        {question.options
                                            .filter(option => option && option.trim() !== '') // Filter out empty or whitespace-only options
                                            .map((option, optIndex) => (
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
                                                        <span>
                                                            <div
                                                                className="prose prose-sm max-w-none"
                                                                dangerouslySetInnerHTML={{ __html: option }}
                                                            />
                                                        </span>
                                                    </label>
                                                </li>
                                            ))}
                                    </ul>
                                )}
                            </div>
                        ))}

                        {/* Pagination and Submit Button */}
                        <div className="flex justify-between items-center mt-6">
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
                            {currentPage === totalPages - 1 ? (
                                <button
                                    onClick={handleSubmitTest}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </button>
                            ) : (
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
                            )}
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