"use client";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // For icons

export default function DashboardLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex h-screen bg-black">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 bg-gray-800 text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:w-64 w-64 transition-transform duration-300 ease-in-out z-50`}>
                {/* Sidebar Toggle */}
                <button
                    className="p-4 text-white md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>

                <h2 className="text-lg font-bold mb-2 mt-3 p-4">Super Admin Dashboard</h2>

                <ul className="p-4 space-y-4">
                    <li>
                        <a href="/admin/superAdminDashboard/sAdminDashboard" className="hover:text-blue-400">
                            Record
                        </a>
                    </li>
                    <li>
                        <a href="/admin/superAdminDashboard/viewQuestion" className="hover:text-blue-400">
                            viewQuestions
                        </a>
                    </li>
                    <li>
                        <a href="/admin/superAdminDashboard/addOperator" className="hover:text-blue-400">
                            Add Operator
                        </a>
                    </li>
                    <li>
                        <a href="/admin/superAdminDashboard/alloperator" className="hover:text-blue-400">
                            Operators Data
                        </a>
                    </li>
                    <li>
                        <a href="/admin/superAdminDashboard/forapprove" className="hover:text-blue-400">
                            For Approve
                        </a>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto w-full">
                {/* Mobile Sidebar Toggle Button */}
                <button
                    className="md:hidden fixed top-4 left-4 text-white bg-gray-700 p-2 rounded-full"
                    onClick={() => setIsOpen(true)}
                >
                    <FaBars size={24} />
                </button>

                {children}
            </div>
        </div>
    );
}


// "use client";
// import React, { useState } from "react";
// import { FaBars, FaTimes } from "react-icons/fa";

// export default function DashboardLayout({ children }) {
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//         <div className="flex h-screen bg-black relative">
//             {/* Sidebar */}
//             <div className={`fixed inset-y-0 left-0 bg-gray-800 text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:w-64 w-64 transition-transform duration-300 ease-in-out z-50`}>
//                 {/* Sidebar Header */}
//                 <div className="flex items-center justify-between p-4 md:hidden">
//                     <h2 className="text-lg font-bold">Super Admin Dashboard</h2>
//                     <button onClick={() => setIsOpen(false)} className="text-white">
//                         <FaTimes size={24} />
//                     </button>
//                 </div>

//                 {/* Sidebar Links */}
//                 <ul className="p-4 space-y-4">
//                     <li>
//                         <a href="/admin/superAdminDashboard/addOperator" className="hover:text-blue-400">
//                             Add Operator
//                         </a>
//                     </li>
//                     <li>
//                         <a href="/admin/superAdminDashboard/alloperator" className="hover:text-blue-400">
//                             Operators Data
//                         </a>
//                     </li>
//                     <li>
//                         <a href="/admin/superAdminDashboard/forapprove" className="hover:text-blue-400">
//                             For Approve
//                         </a>
//                     </li>
//                 </ul>
//             </div>

//             {/* Overlay when sidebar is open */}
//             {isOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40" onClick={() => setIsOpen(false)}></div>
//             )}

//             {/* Main Content */}
//             <div className="flex-1 p-6 overflow-auto w-full">
//                 {/* Mobile Sidebar Toggle Button */}
//                 {!isOpen && (
//                     <button className="md:hidden fixed top-4 left-4 text-white bg-gray-700 p-2 rounded-full" onClick={() => setIsOpen(true)}>
//                         <FaBars size={24} />
//                     </button>
//                 )}

//                 {children}
//             </div>
//         </div>
//     );
// }
