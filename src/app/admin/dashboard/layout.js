// export default function DashboardLayout({ children }) {
//     return (
//         <div className="flex h-screen">
//             {/* Sidebar */}
//             <div className="bg-gray-800 text-white w-64 p-4">
//                 <h2 className="text-lg font-bold mb-4">Admin Dashboard</h2>
//                 <ul>
//                     <li className="mb-2">
//                         <a href="/admin/dashboard/addtitlecategory" className="hover:underline">
//                             Add Title Category
//                         </a>
//                     </li>
//                     <li className="mb-2">
//                         <a href="/admin/dashboard/addcategory" className="hover:underline">
//                             Add Category
//                         </a>
//                     </li>
//                     <li className="mb-2">
//                         <a href="/admin/dashboard/addSection" className="hover:underline">
//                             Add Section
//                         </a>
//                     </li>
//                     <li className="mb-2">
//                         <a href="/admin/dashboard/addsubcategory" className="hover:underline">
//                             Add Subcategory
//                         </a>
//                     </li>
//                     <li className="mb-2">
//                         <a href="/admin/dashboard/addquestion" className="hover:underline">
//                             Add Question
//                         </a>
//                     </li>
//                     <li className="mb-2">
//                         <a href="/admin/dashboard/addoption" className="hover:underline">
//                             Add Option
//                         </a>
//                     </li>
//                 </ul>
//             </div>

//             {/* Main Content */}
//             <div className="flex-1 p-6">
//                 {children}
//             </div>
//         </div>
//     );
// }


"use client";

import React, { useState } from "react";

export default function DashboardLayout({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex h-screen bg-black ">
            {/* Sidebar with Toggle */}
            <div className={`bg-gray-800 text-white ${isOpen ? "w-64" : "w-16"} transition-all duration-300 p-4`}>
                <button
                    className="p-2 text-white bg-gray-700 w-full text-left mb-4"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "Close" : "Open"}
                </button>

                {isOpen && (
                    <>
                        <h2 className="text-lg font-bold mb-4">Admin Dashboard</h2>
                        <ul>
                            <li className="mb-2">
                                <a href="/admin/dashboard/addtitlecategory" className="hover:underline">
                                    Add Title Category
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/admin/dashboard/addcategory" className="hover:underline">
                                    Add Category
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/admin/dashboard/addSection" className="hover:underline">
                                    Add Section
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/admin/dashboard/addsubcategory" className="hover:underline">
                                    Add Subcategory
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/admin/dashboard/addquestion" className="hover:underline">
                                    Add Question
                                </a>
                            </li>

                        </ul>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">{children}</div>
        </div>
    );
}
