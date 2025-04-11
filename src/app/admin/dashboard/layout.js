// "use client";
"use client"
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useRouter, usePathname } from "next/navigation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DashboardLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [operatorName, setOperatorName] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { title: "Add Title Category", path: "/admin/dashboard/addtitlecategory" },
        // { title: "All Data", path: "/admin/dashboard/alldata" },
        { title: "Add Category", path: "/admin/dashboard/addcategory" },
        { title: "Add Section", path: "/admin/dashboard/addSection" },
        // { title: "Add Subcategory", path: "/admin/dashboard/addsubcategory" },
        { title: "Subcategories", path: "/admin/dashboard/subcategories" },
        // { title: "Edit Subcategory", path: "/admin/dashboard/editsubcategory" },
        // { title: "Add Question", path: "/admin/dashboard/addquestion" },
        { title: "Questions", path: "/admin/dashboard/addedquestions" },
    ];

    useEffect(() => {
        const operator = localStorage.getItem("operatorInfo");
        if (operator) {
            try {
                const parsed = JSON.parse(operator);
                console.log(parsed, "parsed");

                setOperatorName(parsed?.name || "Operator");
            } catch (err) {
                console.error("Invalid operatorInfo in storage");
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("operatorInfo");
        localStorage.removeItem("operatorToken");
        router.push("/admin/OperatorLogin");
    };

    return (
        <>
            <div className="flex h-screen bg-black text-gray-600 md:text-gray-800 relative overflow-hidden">
                {/* Overlay for mobile */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}

                {/* Toggle Button (only visible on mobile) */}
                <button
                    className="md:hidden p-3 text-white fixed top-4 left-4 bg-gray-800 rounded-md z-50"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
                </button>

                {/* Sidebar */}
                <div
                    className={`bg-gray-800 text-white p-4 transition-transform duration-300 h-full fixed top-0 left-0 z-40 w-64 
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0 md:relative md:block overflow-y-auto`}
                >
                    <h2 className="text-xl font-bold mb-4">Operator Dashboard</h2>
                    <p className="mb-4 text-sm text-gray-300">Welcome, {operatorName}</p>

                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index} className="mb-2">
                                <a
                                    href={item.path}
                                    className={`block px-2 py-1 rounded hover:bg-gray-700 ${pathname === item.path ? "bg-gray-700 font-semibold text-yellow-400" : ""
                                        }`}
                                >
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 mt-8 text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        Logout
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 overflow-auto h-screen ">{children}</div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{ zIndex: 9999 }}
            />
        </>
    );
}
