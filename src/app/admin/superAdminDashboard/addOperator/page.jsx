


'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Switch } from '@headlessui/react';

export default function AddOperatorPage() {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '', // ✅ New
        contactNumber: '', // ✅ New
        email: '',
        password: '',
        permissions: {
            addQuestion: false,
            updateQuestion: false,
            addCategory: false,
            updateCategory: false,
            addTitleCategory: false,
            updateTitleCategory: false,
            addEditCategory: false,
            addEditSections: false,
            addOperators: false,
            editOperators: false,
            // addEditQuestions: false,
            // deleteCategory: false,
            // deleteQuestions: false,
            approveRejectQuestion: false,
            viewAnalytics: false,
        },
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggle = (perm) => {
        setFormData((prev) => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [perm]: !prev.permissions[perm],
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        console.log(formData, 'formData');

        try {
            await axios.post('/api/superadmin/addoperator', formData);
            setSuccess('Operator added successfully!');
            setFormData({
                name: "",
                lastName: "",
                contactNumber: "",
                email: "",
                password: "",
                permissions: {
                    addQuestion: null,
                    updateQuestion: null,
                    addCategory: null,
                    updateCategory: null,
                    addTitleCategory: null,
                    updateTitleCategory: null,
                    addEditCategory: null,
                    addEditSections: null,
                    addOperators: null,
                    editOperators: null,
                    // addEditQuestions: null,
                    // deleteCategory: null,
                    // deleteQuestions: null,
                    approveRejectQuestion: null,
                    viewAnalytics: null,
                },
            })
            router.push("/admin/superAdminDashboard/alloperator");


        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl flex">
                {/* Left: Operator Form */}
                <div className="w-1/2 pr-4 border-r py-32">
                    <h2 className="text-xl font-bold mb-4">Create New Operator</h2>
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    {success && <p className="text-green-500 mb-2">{success}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="name"
                            type="text"
                            placeholder="First Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            name="contactNumber"
                            type="text"
                            placeholder="Contact Number"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                        >
                            Create User
                        </button>
                    </form>
                </div>

                {/* Right: Permissions */}
                <div className="w-1/2 pl-4">
                    <h2 className="text-xl font-bold mb-4">Assign Role and Permissions</h2>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        {Object.keys(formData.permissions).map((key) => (
                            <div key={key} className="flex items-center justify-between border-b pb-2">
                                <span className="text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1')}
                                </span>
                                <Switch
                                    checked={formData.permissions[key]}
                                    onChange={() => handleToggle(key)}
                                    className={`${formData.permissions[key] ? 'bg-green-500' : 'bg-gray-300'
                                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                                >
                                    <span
                                        className={`${formData.permissions[key]
                                            ? 'translate-x-6'
                                            : 'translate-x-1'
                                            } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                                    />
                                </Switch>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
