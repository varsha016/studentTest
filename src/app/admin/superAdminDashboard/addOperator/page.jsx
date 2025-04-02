'use client';
import { useState } from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AddOperatorPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        permissions: {
            addQuestion: false,
            updateQuestion: false,
            addCategory: false,
            updateCategory: false,
        },
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                permissions: { ...prev.permissions, [name]: checked },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('/api/admin/addoperator', formData);
            setSuccess('Operator added successfully!');
            // setTimeout(() => router.push('/operator/list'), 1500);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Add New Operator</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-3 mb-4 border rounded" required />
                    <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 mb-4 border rounded" required />
                    <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 mb-4 border rounded" required />

                    <h2 className="text-lg font-semibold mb-2">Permissions</h2>
                    {Object.keys(formData.permissions).map((key) => (
                        <label key={key} className="flex items-center mb-2">
                            <input type="checkbox" name={key} checked={formData.permissions[key]} onChange={handleChange} className="mr-2" />
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                    ))}

                    <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600">Add Operator</button>
                </form>
            </div>
        </div>
    );
}
