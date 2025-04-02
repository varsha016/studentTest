


// "use client";
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const OperatorsPage = () => {
//     const [operators, setOperators] = useState([]);
//     const [error, setError] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedOperator, setSelectedOperator] = useState(null);

//     useEffect(() => {
//         fetchOperators();
//     }, []);

//     const fetchOperators = async () => {
//         try {
//             const response = await axios.get('/api/admin/getoperator');
//             setOperators(response.data);
//         } catch (err) {
//             setError(err.response?.data?.message || err.message);
//         }
//     };

//     const handleDelete = async (operatorId) => {
//         if (!window.confirm('Are you sure you want to delete this operator?')) return;

//         try {
//             await axios.delete('/api/admin/deleteoperator', { data: { operatorId } });
//             alert('Operator deleted successfully');
//             fetchOperators();
//         } catch (err) {
//             setError(err.response?.data?.message || err.message);
//         }
//     };

//     const handleUpdate = (operator) => {
//         console.log(operator);
//         setSelectedOperator(operator);
//         setIsModalOpen(true);
//     };

//     const handleSave = async () => {
//         console.log(selectedOperator, 'selectedOperator');

//         try {
//             await axios.put('http://localhost:3000/api/admin/updateo', selectedOperator);
//             alert('Operator updated successfully');
//             setIsModalOpen(false);
//             fetchOperators();
//         } catch (err) {
//             setError(err.response?.data?.message || err.message);
//         }
//     };

//     return (
//         <div className="container mx-auto p-8">
//             <h1 className="text-2xl font-bold mb-4">Operator Details</h1>

//             {error && <p className="text-red-500">{error}</p>}

//             <table className="min-w-full bg-white border border-gray-300">
//                 <thead>
//                     <tr className="bg-gray-200">
//                         <th className="py-2 px-4 border">Name</th>
//                         <th className="py-2 px-4 border">Email</th>
//                         <th className="py-2 px-4 border">Add Question</th>
//                         <th className="py-2 px-4 border">Update Question</th>
//                         <th className="py-2 px-4 border">Add Category</th>
//                         <th className="py-2 px-4 border">Update Category</th>
//                         <th className="py-2 px-4 border">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {operators.length === 0 ? (
//                         <tr>
//                             <td colSpan="7" className="text-center py-4">No operators found</td>
//                         </tr>
//                     ) : (
//                         operators.map((operator) => (
//                             <tr key={operator._id} className="border-b">
//                                 <td className="py-2 px-4 border">{operator.name}</td>
//                                 <td className="py-2 px-4 border">{operator.email}</td>
//                                 <td className="py-2 px-4 border">{operator.permissionId?.addQuestion ? '🟢' : '🔴'}</td>
//                                 <td className="py-2 px-4 border">{operator.permissionId?.updateQuestion ? '🟢' : '🔴'}</td>
//                                 <td className="py-2 px-4 border">{operator.permissionId?.addCategory ? '🟢' : '🔴'}</td>
//                                 <td className="py-2 px-4 border">{operator.permissionId?.updateCategory ? '🟢' : '🔴'}</td>
//                                 <td className="py-2 px-4 border">
//                                     <button
//                                         onClick={() => handleUpdate(operator)}
//                                         className="bg-blue-500 text-white py-1 px-3 mr-2 rounded"
//                                     >
//                                         Update
//                                     </button>
//                                     <button
//                                         onClick={() => handleDelete(operator._id)}
//                                         className="bg-red-500 text-white py-1 px-3 rounded"
//                                     >
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))
//                     )}
//                 </tbody>
//             </table>

//             {isModalOpen && selectedOperator && (
//                 <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
//                     <div className="bg-white p-8 rounded-lg">
//                         <h2 className="text-xl font-bold mb-4">Update Operator</h2>
//                         <label className="block">Name:</label>
//                         <input
//                             type="text"
//                             value={selectedOperator.name}
//                             onChange={(e) => setSelectedOperator({ ...selectedOperator, name: e.target.value })}
//                             className="border p-2 w-full mb-4"
//                         />
//                         <label className="block">Email:</label>
//                         <input
//                             type="email"
//                             value={selectedOperator.email}
//                             onChange={(e) => setSelectedOperator({ ...selectedOperator, email: e.target.value })}
//                             className="border p-2 w-full mb-4"
//                         />
//                         <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 mr-2 rounded">Save</button>
//                         <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OperatorsPage;

"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OperatorsPage = () => {
    const [operators, setOperators] = useState([]);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState(null);

    useEffect(() => {
        fetchOperators();
    }, []);

    const fetchOperators = async () => {
        try {
            const response = await axios.get('/api/admin/getoperator');
            console.log("response", response);

            setOperators(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleDelete = async (operatorId) => {
        if (!window.confirm('Are you sure you want to delete this operator?')) return;

        try {
            await axios.delete('/api/admin/deleteoperator', { data: { operatorId } });
            alert('Operator deleted successfully');
            fetchOperators();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleUpdate = (operator) => {
        console.log(operator, "operator");

        setSelectedOperator({
            ...operator,
            operatorId: operator._id,
            permissions: {
                addQuestion: operator.permissionId?.addQuestion || false,
                updateQuestion: operator.permissionId?.updateQuestion || false,
                addCategory: operator.permissionId?.addCategory || false,
                updateCategory: operator.permissionId?.updateCategory || false,
            }
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        console.log(selectedOperator, "selectedOperator");
        try {
            // await axios.put('/api/admin/updateoperator', selectedOperator);
            const response = await axios.put('/api/superadmin/updateoperator', selectedOperator);
            console.log(response, "response");

            alert('Operator updated successfully');
            setIsModalOpen(false);
            fetchOperators();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handlePermissionChange = (permissionKey) => {
        setSelectedOperator((prev) => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [permissionKey]: !prev.permissions[permissionKey],
            },
        }));
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4 text-white">Operator Details</h1>

            {error && <p className="text-red-500">{error}</p>}

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 border">Name</th>
                        <th className="py-2 px-4 border">Email</th>
                        <th className="py-2 px-4 border">Add Question</th>
                        <th className="py-2 px-4 border">Update Question</th>
                        <th className="py-2 px-4 border">Add Category</th>
                        <th className="py-2 px-4 border">Update Category</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {operators.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center py-4">No operators found</td>
                        </tr>
                    ) : (
                        operators.map((operator) => (
                            <tr key={operator._id} className="border-b">
                                <td className="py-2 px-4 border">{operator.name}</td>
                                <td className="py-2 px-4 border">{operator.email}</td>
                                <td className="py-2 px-4 border">{operator.permissionId?.addQuestion ? '🟢' : '🔴'}</td>
                                <td className="py-2 px-4 border">{operator.permissionId?.updateQuestion ? '🟢' : '🔴'}</td>
                                <td className="py-2 px-4 border">{operator.permissionId?.addCategory ? '🟢' : '🔴'}</td>
                                <td className="py-2 px-4 border">{operator.permissionId?.updateCategory ? '🟢' : '🔴'}</td>
                                <td className="py-2 px-4 border">
                                    <button
                                        onClick={() => handleUpdate(operator)}
                                        className="bg-blue-500 text-white py-1 px-3 mr-2 rounded"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDelete(operator._id)}
                                        className="bg-red-500 text-white py-1 px-3 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {isModalOpen && selectedOperator && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Update Operator</h2>
                        <label className="block">Name:</label>
                        <input
                            type="text"
                            value={selectedOperator.name}
                            onChange={(e) => setSelectedOperator({ ...selectedOperator, name: e.target.value })}
                            className="border p-2 w-full mb-4"
                        />
                        <label className="block">Email:</label>
                        <input
                            type="email"
                            value={selectedOperator.email}
                            onChange={(e) => setSelectedOperator({ ...selectedOperator, email: e.target.value })}
                            className="border p-2 w-full mb-4"
                        />

                        <h3 className="font-bold mb-2">Permissions</h3>
                        {Object.keys(selectedOperator.permissions).map((key) => (
                            <label key={key} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={selectedOperator.permissions[key]}
                                    onChange={() => handlePermissionChange(key)}
                                    className="mr-2"
                                />
                                {key}
                            </label>
                        ))}

                        <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 mr-2 rounded">Save</button>
                        <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OperatorsPage;
