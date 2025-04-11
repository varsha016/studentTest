"use client";
import { useState } from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function OperatorLoginPage() {
    const [formData, setFormData] = useState({ name: "john", email: 'john@gmail.com', password: '123' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    // const baseURL = 'http://localhost:3000/api';
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${baseURL}/admin/operatorlogin`, formData);
            console.log(response, "response");

            localStorage.setItem('operatorToken', response.data.result.token);
            localStorage.setItem('operatorInfo', JSON.stringify(response.data.result));
            router.push('/admin/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Operator Login</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {/* <input
                        name="name"
                        type="text"
                        placeholder="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 border rounded"
                        required
                    /> */}
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 border rounded"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 border rounded"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
