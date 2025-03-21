"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import ProfileDropdown from "../../user/profiledropdown/page";

const menuItems = [
    { label: "Home", dropdown: [], link: "/" },
    { label: "Engineering MCQ", dropdown: ["Computer Engineering", "Civil Engineering"] },
    { label: "Programming MCQ", dropdown: ["HTML", "CSS", "Javascript", "PHP"] },
    { label: "More", dropdown: ["Commerce", "Science", "History"] },
    { label: "exam", dropdown: [], link: "/user/exam" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };
    // console.log(userId, "userId");

    return (
        <>
            <div className="flex justify-between items-center py-4 px-6">
                <h6 className="text-2xl font-bold tracking-wide text-blue-300 hover:text-blue-600">
                    Exam Portal
                </h6>
                <div className="flex items-center gap-4 text-gray-500 font-bold">
                    <Link href="#" className="hover:text-yellow-400">CONTACT US</Link>
                    <Link href="#" className="hover:text-yellow-400">ASK QUESTION</Link>
                    {!userId ? (
                        <Link href="/user/login" className="hover:text-yellow-400">LOGIN</Link>
                    ) : null}
                </div>
            </div>

            <header className="bg-blue-900 text-white shadow-md rounded-0">
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    <button className="lg:hidden text-2xl" onClick={toggleMenu}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <nav className={`lg:flex ${isOpen ? "block" : "hidden"} w-full lg:w-auto`}>
                        <ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0" ref={dropdownRef}>
                            {menuItems.map((item, index) => (
                                // <li key={index} className="relative">
                                //     <button onClick={() => toggleDropdown(index)} className="hover:text-yellow-400 flex items-center gap-2">
                                //         {item.label}
                                //         {item.dropdown.length > 0 && (openDropdown === index ? <FaChevronUp /> : <FaChevronDown />)}
                                //     </button>
                                //     {openDropdown === index && item.dropdown.length > 0 && (
                                //         <ul className="absolute left-0 bg-white text-black shadow-lg rounded-md w-56">
                                //             {item.dropdown.map((subItem, subIndex) => (
                                //                 <li key={subIndex} className="hover:bg-blue-100 p-2">
                                //                     <Link href={`#${subItem.toLowerCase()}`}>{subItem}</Link>
                                //                 </li>
                                //             ))}
                                //         </ul>
                                //     )}
                                // </li>
                                <li key={index} className="relative">
                                    {item.link ? (
                                        <Link href={item.link} className="hover:text-yellow-400 flex items-center gap-2">
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <button onClick={() => toggleDropdown(index)} className="hover:text-yellow-400 flex items-center gap-2">
                                            {item.label}
                                            {item.dropdown.length > 0 && (openDropdown === index ? <FaChevronUp /> : <FaChevronDown />)}
                                        </button>
                                    )}

                                    {openDropdown === index && item.dropdown.length > 0 && (
                                        <ul className="absolute left-0 bg-white text-black shadow-lg rounded-md w-56">
                                            {item.dropdown.map((subItem, subIndex) => (
                                                <li key={subIndex} className="hover:bg-blue-100 p-2">
                                                    <Link href={`#${subItem.toLowerCase()}`}>{subItem}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>

                            ))}
                        </ul>
                    </nav>

                    {/* Show ProfileDropdown only if user is logged in */}
                    <ProfileDropdown />
                </div>
            </header>
        </>
    );
}
