




'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';

const SectionForm = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [formData, setFormData] = useState({
        categoryId: '',
        subCategoryId: '',
        name: '',
        questionIds: [],
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCategories();
        // fetchQuestions();
        fetchApprovedQuestions();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/api/admin/getallcategory');
            setCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubCategories = async (categoryId) => {
        try {
            const { data } = await axios.get(`/api/admin/getallsubcategory?id=${categoryId}`);
            setSubCategories(data || []);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };


    const fetchApprovedQuestions = async () => {
        try {
            const response = await axios.get("/api/admin/fetchApprovedQuestions");
            console.log("Approved Questions:", response.data.questions);
            setQuestions(response.data?.questions || []);
        } catch (error) {
            console.error("Error fetching approved questions:", error);
        }
    };




    // const fetchQuestions = async () => {
    //     try {
    //         const res = await axios.get('/api/admin/getallquestion');
    //         setQuestions(res.data?.data || []);
    //     } catch (error) {
    //         console.error('Error fetching questions:', error);
    //     }
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === 'categoryId') fetchSubCategories(value);
    };

    // const handleQuestionSelect = (questionId) => {
    //     setFormData((prev) => {
    //         const updatedQuestionIds = prev.questionIds.includes(questionId)
    //             ? prev.questionIds.filter((id) => id !== questionId)
    //             : [...prev.questionIds, questionId];

    //         if (updatedQuestionIds.length > 50) {
    //             setMessage('You can only select up to 50 questions per section.');
    //             return prev;
    //         }
    //         setMessage('');
    //         return { ...prev, questionIds: updatedQuestionIds };
    //     });
    // };


    const handleQuestionSelect = (questionId) => {
        setFormData((prev) => {
            const updatedQuestionIds = prev.questionIds.includes(questionId)
                ? prev.questionIds.filter((id) => id !== questionId)
                : [...prev.questionIds, questionId];

            if (updatedQuestionIds.length > 50) {
                setMessage('You can only select up to 50 questions per section.');
                return prev;
            }
            setMessage('');
            return { ...prev, questionIds: updatedQuestionIds };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (formData.questionIds.length === 0) {
            setMessage('Please select at least one question.');
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post('/api/admin/addsection', formData);
            setMessage(data.message);
            setFormData({ categoryId: '', subCategoryId: '', name: '', questionIds: [] });
        } catch (error) {
            console.error('Error creating section:', error);
            setMessage(error.response?.data?.message || 'Failed to create section');
        } finally {
            setLoading(false);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 5;
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const currentQuestions = questions.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            {/* <pre>{JSON.stringify(questions, null, 2)}</pre> */}
            {message && <p className="text-center mt-4 text-green-500">{message}</p>}
            <h2 className="text-2xl font-bold mb-4">Create Section</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Category</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2 border rounded" required>
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block font-medium">SubCategory</label>
                    <select name="subCategoryId" value={formData.subCategoryId} onChange={handleChange} className="w-full p-2 border rounded" required>
                        <option value="">Select SubCategory</option>
                        {subCategories.map((sub) => (
                            <option key={sub._id} value={sub._id}>{sub.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block font-medium">Section Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block font-medium">Select Questions (Max: 50)</label>
                    <div className="grid grid-cols-2 gap-2 border p-2 rounded">
                        {currentQuestions.map((q) => (
                            <label key={q._id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.questionIds.includes(q._id)}
                                    onChange={() => handleQuestionSelect(q._id)}
                                />
                                <span>{q.questionText}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Previous</button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Next</button>
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
                    {loading ? 'Creating Section...' : 'Create Section'}
                </button>

            </form>
        </div>
    );
};

export default SectionForm;

