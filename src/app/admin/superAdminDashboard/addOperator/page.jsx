// 'use client';
// import { useState } from 'react';

// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// export default function AddOperatorPage() {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         permissions: {
//             addQuestion: false,
//             updateQuestion: false,
//             addCategory: false,
//             updateCategory: false,
//         },
//     });
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const router = useRouter();

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         if (type === 'checkbox') {
//             setFormData((prev) => ({
//                 ...prev,
//                 permissions: { ...prev.permissions, [name]: checked },
//             }));
//         } else {
//             setFormData((prev) => ({ ...prev, [name]: value }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         try {
//             const response = await axios.post('/api/admin/addoperator', formData);
//             setSuccess('Operator added successfully!');
//             // setTimeout(() => router.push('/operator/list'), 1500);
//         } catch (error) {
//             setError(error.response?.data?.message || error.message);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
//             <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//                 <h1 className="text-2xl font-bold mb-6">Add New Operator</h1>
//                 {error && <p className="text-red-500 mb-4">{error}</p>}
//                 {success && <p className="text-green-500 mb-4">{success}</p>}
//                 <form onSubmit={handleSubmit}>
//                     <input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-3 mb-4 border rounded" required />
//                     <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 mb-4 border rounded" required />
//                     <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 mb-4 border rounded" required />

//                     <h2 className="text-lg font-semibold mb-2">Permissions</h2>
//                     {Object.keys(formData.permissions).map((key) => (
//                         <label key={key} className="flex items-center mb-2">
//                             <input type="checkbox" name={key} checked={formData.permissions[key]} onChange={handleChange} className="mr-2" />
//                             {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                         </label>
//                     ))}

//                     <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600">Add Operator</button>
//                 </form>
//             </div>
//         </div>
//     );
// }


// 'use client';

// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { Switch } from '@headlessui/react';

// export default function AddOperatorPage() {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         permissions: {
//             addQuestion: false,
//             updateQuestion: false,
//             addCategory: false,
//             updateCategory: false,
//         },
//     });

//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const router = useRouter();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleToggle = (perm) => {
//         setFormData((prev) => ({
//             ...prev,
//             permissions: {
//                 ...prev.permissions,
//                 [perm]: !prev.permissions[perm],
//             },
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         try {
//             const response = await axios.post('/api/admin/addoperator', formData);
//             setSuccess('Operator added successfully!');
//             // setTimeout(() => router.push('/operator/list'), 1500);
//         } catch (error) {
//             setError(error.response?.data?.message || error.message);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
//             <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 w-full max-w-xl">
//                 <h1 className="text-2xl font-bold mb-6 text-center">Add New Operator</h1>
//                 {error && <p className="text-red-500 mb-4">{error}</p>}
//                 {success && <p className="text-green-500 mb-4">{success}</p>}

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <input
//                         name="name"
//                         type="text"
//                         placeholder="Name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         required
//                     />
//                     <input
//                         name="email"
//                         type="email"
//                         placeholder="Email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         required
//                     />
//                     <input
//                         name="password"
//                         type="password"
//                         placeholder="Password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         required
//                     />

//                     <h2 className="text-lg font-semibold mt-6 mb-2">Permissions</h2>
//                     <div className="space-y-3">
//                         {Object.keys(formData.permissions).map((key) => (
//                             <div key={key} className="flex items-center justify-between border-b pb-2">
//                                 <span className="text-gray-700 capitalize">
//                                     {key.replace(/([A-Z])/g, ' $1')}
//                                 </span>
//                                 <Switch
//                                     checked={formData.permissions[key]}
//                                     onChange={() => handleToggle(key)}
//                                     className={`${formData.permissions[key] ? 'bg-blue-600' : 'bg-gray-300'}
//                     relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
//                                 >
//                                     <span
//                                         className={`${formData.permissions[key] ? 'translate-x-6' : 'translate-x-1'
//                                             } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
//                                     />
//                                 </Switch>
//                             </div>
//                         ))}
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-500 text-white py-3 rounded-lg mt-6 hover:bg-blue-600 transition duration-200"
//                     >
//                         Add Operator
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }


// 'use client';

// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { Switch } from '@headlessui/react';

// export default function AddOperatorPage() {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         permissions: {
//             addQuestion: false,
//             updateQuestion: false,
//             addCategory: false,
//             updateCategory: false,
//             approveRejectQuestion: false,
//             addOperators: false,
//             editOperators: false,
//             addEditCategory: false,
//             addEditTopics: false,
//             addEditQuestions: false,
//             deleteCategory: false,
//             deleteQuestions: false,
//             viewAnalytics: false,
//         },
//     });

//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const router = useRouter();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleToggle = (perm) => {
//         setFormData((prev) => ({
//             ...prev,
//             permissions: {
//                 ...prev.permissions,
//                 [perm]: !prev.permissions[perm],
//             },
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         try {
//             await axios.post('/api/admin/addoperator', formData);
//             setSuccess('Operator added successfully!');
//         } catch (error) {
//             setError(error.response?.data?.message || error.message);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//             <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl flex">
//                 {/* Left: Operator Form */}

//                 <div className="w-1/2 pr-4 border-r py-32">
//                     <h2 className="text-xl font-bold mb-4">Create New Operator</h2>
//                     {error && <p className="text-red-500 mb-2">{error}</p>}
//                     {success && <p className="text-green-500 mb-2">{success}</p>}
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <input
//                             name="name"
//                             type="text"
//                             placeholder="Full Name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                             required
//                         />
//                         <input
//                             name="email"
//                             type="email"
//                             placeholder="Email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                             required
//                         />
//                         <input
//                             name="password"
//                             type="password"
//                             placeholder="Password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                             required
//                         />
//                         <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
//                             Create User
//                         </button>
//                     </form>
//                 </div>

//                 {/* Right: Permissions */}
//                 <div className="w-1/2 pl-4">
//                     <h2 className="text-xl font-bold mb-4">Assign Role and Permissions</h2>
//                     <div className="space-y-3">
//                         {Object.keys(formData.permissions).map((key) => (
//                             <div key={key} className="flex items-center justify-between border-b pb-2">
//                                 <span className="text-gray-700 capitalize">
//                                     {key.replace(/([A-Z])/g, ' $1')}
//                                 </span>
//                                 <Switch
//                                     checked={formData.permissions[key]}
//                                     onChange={() => handleToggle(key)}
//                                     className={`${formData.permissions[key] ? 'bg-green-500' : 'bg-gray-300'}
//                     relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
//                                 >
//                                     <span
//                                         className={`${formData.permissions[key] ? 'translate-x-6' : 'translate-x-1'}
//                                             inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
//                                     />
//                                 </Switch>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


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
            approveRejectQuestion: false,
            addOperators: false,
            editOperators: false,
            addEditCategory: false,
            addEditTopics: false,
            addEditQuestions: false,
            deleteCategory: false,
            deleteQuestions: false,
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
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            Create User
                        </button>
                    </form>
                </div>

                {/* Right: Permissions */}
                <div className="w-1/2 pl-4">
                    <h2 className="text-xl font-bold mb-4">Assign Role and Permissions</h2>
                    <div className="space-y-3">
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
