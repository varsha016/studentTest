'use client';

import { useEffect, useState } from "react";

const SavedPage = () => {
    const [savedQuestions, setSavedQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all saved questions from localStorage when the component mounts
    useEffect(() => {
        const savedQuestionsFromStorage = JSON.parse(localStorage.getItem("savedQuestions")) || [];
        setSavedQuestions(savedQuestionsFromStorage);
        setLoading(false);
    }, []);

    // Function to delete a question
    const handleDelete = (indexToDelete) => {
        const updatedQuestions = savedQuestions.filter((_, index) => index !== indexToDelete);
        setSavedQuestions(updatedQuestions);
        localStorage.setItem("savedQuestions", JSON.stringify(updatedQuestions));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">Saved Questions</h1>
            {savedQuestions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedQuestions.map((question, index) => (
                        <div key={`${index}-${question.questionText}`} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-2">
                                {/* Q{index + 1}: {question.questionText} */}
                                Q{startIndex + index + 1}:{" "}
                                <span
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: question?.questionText }}
                                />
                            </h2>
                            {question.questionType === "mcq" ? (
                                <ul className="space-y-2">
                                    {question.options.map((option, optIndex) => {
                                        const isCorrect = optIndex === question.correctOptionIndex;
                                        const isSelected = question.userAnswer === option;

                                        return (
                                            <li
                                                key={optIndex}
                                                className={`p-2 rounded ${isSelected
                                                    ? isCorrect
                                                        ? "bg-green-100 font-bold"
                                                        : "bg-red-100"
                                                    : "bg-gray-100"
                                                    }`}
                                            >
                                                {option}
                                                {isSelected && (
                                                    <span className="ml-2">
                                                        {isCorrect ? "✅" : "❌"}
                                                    </span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="p-2 bg-gray-100 rounded">
                                    <strong>Your Answer:</strong> {question.userAnswer || "Not Answered"}
                                </p>
                            )}
                            <div className="mt-4">
                                <p className="text-sm text-gray-700">
                                    <strong>Explanation:</strong> {question.answerExplanation}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(index)}
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No questions saved yet.</p>
            )}
        </div>
    );
};

export default SavedPage;







