


// "use client";

// import React, { useState } from "react";

// export default function DashboardLayout({ children }) {
//     const [isOpen, setIsOpen] = useState(true);

//     return (
//         <div className="flex h-screen bg-black ">
//             {/* Sidebar with Toggle */}
//             <div className={`bg-gray-800 text-white ${isOpen ? "w-64" : "w-16"} transition-all duration-300 p-4`}>
//                 <button
//                     className="p-2 text-white bg-gray-700 w-full text-left mb-4"
//                     onClick={() => setIsOpen(!isOpen)}
//                 >
//                     {isOpen ? "Close" : "Open"}
//                 </button>

//                 {isOpen && (
//                     <>
//                         <h2 className="text-lg font-bold mb-4">Operator Dashboard</h2>
//                         <ul>
//                             <li className="mb-2">
//                                 <a href="/admin/dashboard/addtitlecategory" className="hover:underline">
//                                     Add Title Category
//                                 </a>
//                             </li>
//                             <li className="mb-2">
//                                 <a href="/admin/dashboard/addcategory" className="hover:underline">
//                                     Add Category
//                                 </a>
//                             </li>
//                             <li className="mb-2">
//                                 <a href="/admin/dashboard/addSection" className="hover:underline">
//                                     Add Section
//                                 </a>
//                             </li>
//                             <li className="mb-2">
//                                 <a href="/admin/dashboard/addsubcategory" className="hover:underline">
//                                     Add Subcategory
//                                 </a>
//                             </li>
//                             <li className="mb-2">
//                                 <a href="/admin/dashboard/addquestion" className="hover:underline">
//                                     Add Question
//                                 </a>
//                             </li>
//                             <li className="mb-2">
//                                 <a href="/admin/dashboard/addedquestions" className="hover:underline">
//                                     Added Question
//                                 </a>
//                             </li>



//                         </ul>
//                     </>
//                 )}
//             </div>

//             {/* Main Content */}
//             <div className="flex-1 p-6">{children}</div>
//         </div>
//     );
// }

"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function DashboardLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { title: "Add Title Category", path: "/admin/dashboard/addtitlecategory" },
        { title: "Add Category", path: "/admin/dashboard/addcategory" },
        { title: "Add Section", path: "/admin/dashboard/addSection" },
        { title: "Add Subcategory", path: "/admin/dashboard/addsubcategory" },
        { title: "Add Question", path: "/admin/dashboard/addquestion" },
        { title: "Added Questions", path: "/admin/dashboard/addedquestions" },
    ];

    return (
        <div className="flex h-screen bg-black relative">
            {/* Mobile Overlay (closes menu when clicking outside) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Toggle Button */}
            <button
                className="sm:hidden p-3 text-white fixed top-4 left-4 bg-gray-800 rounded-md z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
            </button>

            {/* Sidebar */}
            <div
                className={`bg-gray-800 text-white transition-transform duration-300 p-4 h-full fixed top-0 left-0 z-40 
                ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"} 
                sm:translate-x-0 sm:w-64 sm:relative sm:block`}
            >
                <h2 className="text-lg font-bold mb-4">Operator Dashboard</h2>

                {/* Sidebar Menu */}
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index} className="mb-2">
                            <a href={item.path} className="hover:underline">
                                {item.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">{children}</div>
        </div>
    );
}


