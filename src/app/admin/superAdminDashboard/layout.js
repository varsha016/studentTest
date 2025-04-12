


"use client";

import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    // const [adminName, setAdminName] = useState("Super Admin");
    const router = useRouter();

    useEffect(() => {
        // const data = localStorage.getItem("operatorInfo");
        // if (data) {
        //     try {
        //         const parsed = JSON.parse(data);
        //         console.log(parsed)

        //         setAdminName(parsed?.name || "Super Admin");
        //     } catch (error) {
        //         console.error("Invalid operatorInfo");
        //     }
        // }

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/admin/login"); // Redirect if token not found
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        // localStorage.removeItem("operatorInfo");
        router.push("/admin/AdminLogin")
    };

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 bg-gray-800 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 md:relative md:w-64 w-64 transition-transform duration-300 ease-in-out z-50`}
            >
                {/* Sidebar Toggle */}
                <button
                    className="p-4 text-white md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>

                <div className="p-4">
                    <h2 className="text-lg font-bold mb-2">Super Admin Dashboard</h2>
                    {/* <p className="text-sm text-gray-300">Welcome, {adminName}</p> */}
                </div>

                <ul className="p-4 space-y-4">
                    <li>
                        <a href="/admin/superAdminDashboard/sAdminDashboard" className="hover:text-blue-400">
                            Record
                        </a>
                    </li>
                    <li>
                        <a href="/admin/superAdminDashboard/allInfo" className="hover:text-blue-400">
                            AllData
                        </a>
                    </li>
                    <li>
                        <a href="/admin/superAdminDashboard/viewQuestion" className="hover:text-blue-400">
                            View Questions
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

                <button
                    onClick={handleLogout}
                    className="mt-6 ml-4 flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                >
                    <FaSignOutAlt />
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto w-full text-gray-800">
                {/* Mobile Sidebar Toggle Button */}
                <button
                    className="md:hidden fixed top-4 left-4 text-white bg-gray-700 p-2 rounded-full z-50"
                    onClick={() => setIsOpen(true)}
                >
                    <FaBars size={24} />
                </button>

                {children}
            </div>
        </div>
    );
}
