"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import ProfileDropdown from "../../user/profiledropdown/page";
import SearchBar from "../searchbar/page";
import axios from "axios";
import { useRouter } from "next/navigation";

// detect touch devices (mobile/tablet)
const isTouchDevice = () =>
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [titleCategories, setTitleCategories] = useState([]);
    const [categoriesByTitle, setCategoriesByTitle] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const router = useRouter();
    // const [userId, setUserId] = useState(localStorage.getItem("userId"));

    useEffect(() => {
        const handleAuthChange = () => {
            const updatedUserId = localStorage.getItem("userId");
            setUserId(updatedUserId);
        };
        window.addEventListener("user-auth-changed", handleAuthChange);
        return () => {
            window.removeEventListener("user-auth-changed", handleAuthChange);
        };
    }, []);


    // fetch userId & categories on mount
    useEffect(() => {
        setUserId(localStorage.getItem("userId"));
        fetchAllTitleCategories();

        const storageHandler = () => setUserId(localStorage.getItem("userId"));
        window.addEventListener("storage", storageHandler);
        window.addEventListener("user-auth-changed", storageHandler);
        return () => {
            window.removeEventListener("storage", storageHandler);
            window.removeEventListener("user-auth-changed", storageHandler);
        };
    }, []);


    const fetchAllTitleCategories = async () => {
        try {
            const { data } = await axios.get("/api/admin/getalltitlecategory");
            setTitleCategories(data);
            // then fetch each group of categories
            const byTitle = {};
            await Promise.all(
                data.map(async (t) => {
                    const res = await axios.get(
                        `/api/admin/getallcategory?titleCategory=${encodeURIComponent(t._id)}`
                    );
                    byTitle[t._id] = Array.isArray(res.data?.data) ? res.data.data : [];
                })
            );
            setCategoriesByTitle(byTitle);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleMenu = () => setIsOpen((p) => !p);
    const toggleDropdown = (idx) => setOpenDropdown((p) => (p === idx ? null : idx));

    const handleCategoryClick = (id, name) => {
        router.push(`/user/solvetestsubcategory?id=${id}&name=${encodeURIComponent(name)}`);
        setIsOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        window.dispatchEvent(new Event("user-auth-changed"));
        setUserId(null);
        router.push("/user/login");
        setIsOpen(false);
    };

    return (
        <>
            {/* Top Navbar */}
            <header className="bg-blue-900 text-white shadow-md">
                <div className="container mx-auto flex justify-between items-center py-3 px-3 md:px-6">
                    {/* Mobile hamburger */}
                    <button className="lg:hidden text-2xl" onClick={toggleMenu}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    {/* Main nav (desktop & mobile) */}
                    <nav className={`${isOpen ? "block" : "hidden"} lg:flex w-full lg:w-auto mt-4 lg:mt-0`}>
                        <ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-2 lg:space-y-0">
                            {loading
                                ? // skeleton loaders
                                Array.from({ length: 4 }).map((_, i) => (
                                    <li key={i} className="w-24 h-6 bg-gray-300 rounded animate-pulse" />
                                ))
                                : titleCategories.map((t, idx) => (
                                    <li
                                        key={t._id}
                                        className="relative"
                                        onMouseEnter={() => !isTouchDevice() && setOpenDropdown(idx)}
                                        onMouseLeave={() => !isTouchDevice() && setOpenDropdown(null)}
                                    >
                                        <button
                                            className="flex items-center px-3 py-1 hover:text-yellow-400 w-full lg:w-auto justify-between"
                                            onClick={() => toggleDropdown(idx)}
                                        >
                                            {t.title}
                                            {categoriesByTitle[t._id]?.length > 0 && (
                                                <span className="ml-2">
                                                    {openDropdown === idx ? <FaChevronUp /> : <FaChevronDown />}
                                                </span>
                                            )}
                                        </button>

                                        {categoriesByTitle[t._id]?.length > 0 && openDropdown === idx && (
                                            <ul className="absolute left-0 top-full mt-0 bg-white text-black shadow-md rounded w-56 z-50">
                                                {categoriesByTitle[t._id].map((c) => (
                                                    <li
                                                        key={c._id}
                                                        className="p-2 hover:bg-blue-100 cursor-pointer"
                                                        onClick={() => handleCategoryClick(c._id, c.name)}
                                                    >
                                                        {c.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}

                            {/* Exam link */}
                            <li>
                                <Link href="/user/exam" className="flex items-center px-3 py-1 hover:text-yellow-400">
                                    Exam
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Search & Profile/Login */}
                    <div className="flex items-center gap-3">
                        <SearchBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                        {userId ? (
                            <ProfileDropdown key={userId} handleLogout={handleLogout} />
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/user/login"
                                    className="px-4 py-2 bg-amber-800 rounded hover:bg-amber-900"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/user/signup"
                                    className="px-4 py-2 bg-amber-800 rounded hover:bg-amber-900"
                                >
                                    SignUp
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Sidebar (mobile only) */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 lg:hidden z-50`}
            >
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-2xl"
                    onClick={toggleMenu}
                >
                    <FaTimes />
                </button>

                {/* Navigation */}
                <nav className="mt-16 px-4 space-y-4 overflow-y-auto h-[calc(100%-4rem)] pb-6">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="w-24 h-6 bg-gray-300 rounded animate-pulse" />
                        ))
                    ) : (
                        titleCategories.map((t, idx) => (
                            <div key={t._id}>
                                <button
                                    className="w-full flex items-center justify-between py-2 px-2 rounded hover:bg-blue-800"
                                    onClick={() => toggleDropdown(idx)}
                                >
                                    <span>{t.title}</span>
                                    {categoriesByTitle[t._id]?.length > 0 && (
                                        <span>
                                            {openDropdown === idx ? <FaChevronUp /> : <FaChevronDown />}
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown */}
                                {openDropdown === idx && categoriesByTitle[t._id]?.length > 0 && (
                                    <ul className="ml-4 mt-1 space-y-1">
                                        {categoriesByTitle[t._id].map((c) => (
                                            <li
                                                key={c._id}
                                                className="px-3 text-amber-300 py-1 rounded hover:bg-blue-700 cursor-pointer"
                                                onClick={() => {
                                                    handleCategoryClick(c._id, c.name);
                                                    setTimeout(() => setIsOpen(false), 100);
                                                }}
                                            >
                                                {c.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))
                    )}

                    {/* Exam Link */}
                    <Link
                        href="/user/exam"
                        className="block py-2 px-2 hover:bg-blue-800 rounded"
                        onClick={toggleMenu}
                    >
                        Exam
                    </Link>

                    {/* Login Link */}
                    {!userId && (
                        <Link
                            href="/user/login"
                            className="block py-2 px-2 hover:bg-blue-800 rounded"
                            onClick={toggleMenu}
                        >
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </>
    );
}
