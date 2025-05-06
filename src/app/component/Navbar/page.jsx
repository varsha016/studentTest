



"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    const toggleDropdown = (idx) => {
        setOpenDropdown((p) => (p === idx ? null : idx));
    };

    // const handleCategoryClick = (id, name) => {
    //     console.log("clicked", id, name);

    //     router.push(`/user/solvetestsubcategory?id=${id}&name=${encodeURIComponent(name)}`);
    //     setOpenDropdown(null); // Close dropdown when category is clicked
    //     setIsOpen(false); // Close mobile menu if open
    //     return false;
    // };
    const handleCategoryClick = async (id, name) => {
        console.log("Category clicked:", id, name);
        setOpenDropdown(null); // close dropdown first
        setIsOpen(false);      // close sidebar immediately
        await router.push(`/user/solvetestsubcategory?id=${id}&name=${encodeURIComponent(name)}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        window.dispatchEvent(new Event("user-auth-changed"));
        setUserId(null);
        router.push("/user/login");
        setIsOpen(false);
    };
    const onMobileCategoryClick = (category) => {
        console.log("Mobile item clicked:", category._id, category.name);
        handleCategoryClick(category._id, category.name);
    };


    return (
        <>
            {/* Top Navbar - Desktop */}
            <header className="bg-blue-900 text-white shadow-md">
                <div className="container mx-auto flex justify-between items-center py-3 px-3 md:px-6">
                    {/* Left side - Logo and Nav */}
                    <div className="flex items-center flex-shrink-0">
                        {/* Mobile hamburger */}
                        <button className="lg:hidden text-2xl mr-4" onClick={toggleMenu}>
                            {isOpen ? <FaTimes /> : <FaBars />}
                        </button>

                        {/* Logo */}
                        <span className="text-2xl font-bold mr-6 hidden lg:inline-block">
                            <Link href="/">iqstudify</Link>
                        </span>

                        {/* Main nav - Desktop only */}
                        <nav className="hidden lg:flex" ref={dropdownRef}>
                            <ul className="flex items-center space-x-0">
                                {loading
                                    ? Array.from({ length: 4 }).map((_, i) => (
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
                                                className="flex items-center px-3 py-1 hover:text-yellow-400 whitespace-nowrap"
                                                onClick={() => toggleDropdown(idx)}
                                            >
                                                {t.title}
                                                {categoriesByTitle[t._id]?.length > 0 && (
                                                    <span className="ml-1">
                                                        {openDropdown === idx ? <FaChevronUp /> : <FaChevronDown />}
                                                    </span>
                                                )}
                                            </button>

                                            {categoriesByTitle[t._id]?.length > 0 && openDropdown === idx && (
                                                <ul className="absolute left-0 top-full mt-0 bg-white text-black shadow-md rounded w-56 z-50">
                                                    {categoriesByTitle[t._id].map((c) => (
                                                        <li
                                                            key={c._id}
                                                            className="p-2 hover:bg-blue-50 cursor-pointer"
                                                            // onClick={() => alert("Clicked!")}
                                                            onClick={() => handleCategoryClick(c._id, c.name)}
                                                        >
                                                            {c.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}

                                <li>
                                    <Link href="/user/exam" className="hover:text-yellow-400 whitespace-nowrap p-1">
                                        Exam
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Right side - Search and Auth */}
                    <div className="flex items-center gap-3 min-w-0">
                        <SearchBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                        {userId ? (
                            <ProfileDropdown key={userId} handleLogout={handleLogout} />
                        ) : (
                            <div className="hidden lg:flex items-center gap-3">
                                <Link
                                    href="/user/login"
                                    className="px-4 py-2 bg-amber-800 rounded hover:bg-amber-900 whitespace-nowrap"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/user/signup"
                                    className="px-4 py-2 bg-amber-800 rounded hover:bg-amber-900 whitespace-nowrap"
                                >
                                    SignUp
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>


            {/* Sidebar - Mobile only */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 lg:hidden z-50`}
            >
                <button
                    className="absolute top-4 right-4 text-2xl"
                    onClick={toggleMenu}
                >
                    <FaTimes />
                </button>

                <nav className="mt-16 px-4 space-y-4 overflow-y-auto h-[calc(100%-4rem)] pb-6">
                    <span
                        className="text-2xl font-bold"
                        onClick={() => setIsOpen(false)}
                    >
                        <Link href="/">iqstudify</Link>
                    </span>
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

                                {openDropdown === idx && categoriesByTitle[t._id]?.length > 0 && (
                                    <ul className="ml-4 mt-1 space-y-1">
                                        {categoriesByTitle[t._id].map((c) => (
                                            <li
                                                key={c._id}
                                                className="px-3 text-amber-300 py-1 rounded hover:bg-blue-700 cursor-pointer"
                                                onClick={() => {
                                                    console.log("Mobile item clicked:", c._id, c.name);
                                                    // handleCategoryClick(c._id, c.name);
                                                    onMobileCategoryClick(c)
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

                    <Link
                        href="/user/exam"
                        className="block py-2 px-2 hover:bg-blue-800 rounded"
                        onClick={toggleMenu}
                    >
                        Exam
                    </Link>

                    {!userId && (
                        <>
                            <Link
                                href="/user/login"
                                className="block py-2 px-2 hover:bg-blue-800 rounded"
                                onClick={toggleMenu}
                            >
                                Login
                            </Link>
                            <Link
                                href="/user/signup"
                                className="block py-2 px-2 hover:bg-blue-800 rounded"
                                onClick={toggleMenu}
                            >
                                SignUp
                            </Link>
                        </>
                    )}
                </nav >
            </div >

        </>
    );
}