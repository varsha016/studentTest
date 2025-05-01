


'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Trash2, Edit, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TitleCategoryList = () => {
    const [titleCategories, setTitleCategories] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [subcategoryMap, setSubcategoryMap] = useState({});
    const [questionsMap, setQuestionsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState("");
    const [openTitles, setOpenTitles] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState({ type: "", id: "" });
    const [editModal, setEditModal] = useState({ type: '', id: '', value: '' });
    const [newValue, setNewValue] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
            fetchTitleCategories();
        }
    }, []);
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //         setToken(token);
    //         fetchTitleCategories();
    //     }
    // }, [token]);

    const fetchTitleCategories = async () => {
        try {
            const response = await axios.get(`/api/admin/getalltitlecategory`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const titles = response.data;
            setTitleCategories(titles);

            const categoryData = {};
            for (let t of titles) {
                const catRes = await axios.get(`/api/admin/getCategoriesByTitleId/${t._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                categoryData[t._id] = catRes.data;
            }
            setCategoryMap(categoryData);

            const subMap = {};
            const questionMap = {};
            for (let [titleId, categories] of Object.entries(categoryData)) {
                for (let cat of categories) {
                    const subRes = await axios.get(`/api/admin/getSubcategoriesByCategoryId/${cat._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    subMap[cat._id] = subRes.data;

                    for (let sub of subRes.data) {
                        const qRes = await axios.post(`/api/admin/getQuestionsBySubcategories`, {
                            subcategoryIds: [sub._id]
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        questionMap[sub._id] = qRes.data;
                    }
                }
            }

            setSubcategoryMap(subMap);
            setQuestionsMap(questionMap);

        } catch (error) {
            console.error("Error fetching nested data:", error);
        } finally {
            setLoading(false);
        }
    };



    const toggleTitle = (id) => {
        setOpenTitles(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDeleteClick = (type, id) => {
        setDeleteInfo({ type, id });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setProcessing(true);
        try {
            await axios.delete(`/api/superadmin/deleteItem/${deleteInfo.type}/${deleteInfo.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`${deleteInfo.type} deleted successfully`);
            fetchTitleCategories();
        } catch (err) {
            toast.error(`Failed to delete ${deleteInfo.type}`);
            console.error(`Error deleting ${deleteInfo.type}:`, err);
        } finally {
            setProcessing(false);
            setShowDeleteModal(false);
        }
    };

    const handleEditClick = (type, id, currentValue) => {
        setEditModal({ type, id, value: currentValue });
        setNewValue(currentValue);
    };

    const handleUpdate = async () => {
        setProcessing(true);
        try {
            let endpoint = '';
            let payload = {};

            switch (editModal.type) {
                case 'TitleCategory':
                    endpoint = `/api/superadmin/updateTitleCategory/${editModal.id}`;
                    payload = { title: newValue };
                    break;
                case 'Category':
                    endpoint = `/api/superadmin/updateCategory/${editModal.id}`;
                    payload = { name: newValue };
                    break;
                case 'SubCategory':
                    endpoint = `/api/superadmin/updateSubCategory/${editModal.id}`;
                    payload = { name: newValue };
                    break;
                case 'Question':
                    endpoint = `/api/superadmin/updateQuestion/${editModal.id}`;
                    payload = { questionText: newValue };

                    break;
                default:
                    return;
            }

            await axios.put(endpoint, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Updated successfully!');
            setEditModal({ type: '', id: '', value: '' });
            fetchTitleCategories();
        } catch (err) {
            toast.error('Failed to update');
            console.error('Update error:', err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">All Data Management</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {titleCategories.map((title) => (
                            <motion.div
                                key={title._id}
                                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div
                                    className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-700 transition-colors"
                                    onClick={() => toggleTitle(title._id)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <h2 className="text-xl font-bold text-blue-300">{title.title}</h2>
                                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                            {(categoryMap[title._id] || []).length} Categories
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick('TitleCategory', title._id, title.title);
                                            }}
                                            className="text-blue-400 hover:text-blue-300 p-1 rounded-full hover:bg-gray-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick('TitleCategory', title._id);
                                            }}
                                            className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        {openTitles[title._id] ? (
                                            <ChevronUp className="text-gray-400" />
                                        ) : (
                                            <ChevronDown className="text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {openTitles[title._id] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="px-5"
                                        >
                                            <div className="border-t border-gray-700 pt-4 pb-6 space-y-4">
                                                {(categoryMap[title._id] || []).map((cat) => (
                                                    <motion.div
                                                        key={cat._id}
                                                        className="bg-gray-750 rounded-lg p-4 shadow"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                    >
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h3 className="text-lg font-semibold text-purple-300">
                                                                {cat.name}
                                                            </h3>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleEditClick('Category', cat._id, cat.name)}
                                                                    className="text-blue-400 hover:text-blue-300 p-1 rounded-full hover:bg-gray-600 transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteClick('Category', cat._id)}
                                                                    className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-600 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="ml-4 space-y-3">
                                                            {(subcategoryMap[cat._id] || []).map((sub) => (
                                                                <motion.div
                                                                    key={sub._id}
                                                                    className="bg-gray-700 rounded-md p-3"
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    transition={{ delay: 0.2 }}
                                                                >
                                                                    <div className="flex justify-between items-center mb-2">
                                                                        <h4 className="text-sm font-medium text-yellow-300">
                                                                            {sub.name}
                                                                        </h4>
                                                                        <div className="flex space-x-2">
                                                                            <button
                                                                                onClick={() => handleEditClick('SubCategory', sub._id, sub.name)}
                                                                                className="text-blue-400 hover:text-blue-300 p-1 rounded-full hover:bg-gray-600 transition-colors"
                                                                                title="Edit"
                                                                            >
                                                                                <Edit size={14} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteClick('SubCategory', sub._id)}
                                                                                className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-600 transition-colors"
                                                                                title="Delete"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {/* <div className="ml-4 mt-2 space-y-2">
                                                                        {(questionsMap[sub._id] || []).length > 0 ? (
                                                                            questionsMap[sub._id].map((q, idx) => (
                                                                                <motion.div
                                                                                    key={q._id}
                                                                                    className="bg-gray-650 rounded-sm p-2 text-sm text-gray-300 flex justify-between items-center"
                                                                                    initial={{ opacity: 0 }}
                                                                                    animate={{ opacity: 1 }}
                                                                                    transition={{ delay: 0.3 }}
                                                                                >
                                                                                    <span className="truncate">

                                                                                        <span
                                                                                            className="prose prose-sm max-w-none"
                                                                                            dangerouslySetInnerHTML={{ __html: q?.questionText }}
                                                                                        />
                                                                                    </span>
                                                                                    <div className="flex space-x-1 ml-2">

                                                                                        <button
                                                                                            onClick={() => handleEditClick('Question', q._id, q.questionText)}
                                                                                            className="text-blue-400 hover:text-blue-300 p-1 rounded-full hover:bg-gray-600 transition-colors"
                                                                                            title="Edit"
                                                                                        >
                                                                                            <Edit size={12} />
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => handleDeleteClick('Question', q._id)}
                                                                                            className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-600 transition-colors"
                                                                                            title="Delete"
                                                                                        >
                                                                                            <Trash2 size={12} />
                                                                                        </button>
                                                                                    </div>
                                                                                </motion.div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="text-xs text-gray-500 italic">No questions found</div>
                                                                        )}
                                                                    </div> */}
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to delete this {deleteInfo.type.toLowerCase()}? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                                    disabled={processing}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {editModal.type && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-4">
                                Edit {editModal.type}
                            </h3>
                            <input
                                type="text"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                                autoFocus
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setEditModal({ type: '', id: '', value: '' })}
                                    className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                                    disabled={processing}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TitleCategoryList;