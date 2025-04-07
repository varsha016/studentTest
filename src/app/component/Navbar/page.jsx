// "use client";

// import Link from "next/link";
// import { useState, useRef, useEffect } from "react";
// import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import ProfileDropdown from "../../user/profiledropdown/page";
// import SearchBar from "../searchbar/page";

// const menuItems = [
//     { label: "Home", dropdown: [], link: "/" },
//     { label: "Engineering MCQ", dropdown: ["Computer Engineering", "Civil Engineering"] },
//     { label: "Programming MCQ", dropdown: ["HTML", "CSS", "Javascript", "PHP"] },
//     { label: "More", dropdown: ["Commerce", "Science", "History"] },
//     { label: "exam", dropdown: [], link: "/user/exam" },
// ];

// export default function Navbar() {
//     const [isOpen, setIsOpen] = useState(false);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const dropdownRef = useRef(null);
//     const [userId, setUserId] = useState(null);

//     useEffect(() => {
//         const storedUserId = localStorage.getItem("userId");
//         setUserId(storedUserId);

//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setOpenDropdown(null);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const toggleMenu = () => {
//         setIsOpen((prev) => !prev);
//     };

//     const toggleDropdown = (index) => {
//         setOpenDropdown(openDropdown === index ? null : index);
//     };
//     // console.log(userId, "userId");

//     return (
//         <>
//             <div className="flex justify-between items-center py-4 px-6">
//                 <h6 className="text-2xl font-bold tracking-wide text-blue-300 hover:text-blue-600">
//                     Exam Portal
//                 </h6>
//                 <div className="flex items-center gap-4 text-gray-500 font-bold">
//                     <Link href="#" className="hover:text-yellow-400">CONTACT US</Link>
//                     <Link href="#" className="hover:text-yellow-400">ASK QUESTION</Link>
//                     {!userId ? (
//                         <Link href="/user/login" className="hover:text-yellow-400">LOGIN</Link>
//                     ) : null}
//                 </div>
//             </div>

//             <header className="bg-blue-900 text-white shadow-md rounded-0">
//                 <div className="container mx-auto flex justify-between items-center py-4 px-6">
//                     <button className="lg:hidden text-2xl" onClick={toggleMenu}>
//                         {isOpen ? <FaTimes /> : <FaBars />}
//                     </button>

//                     <nav className={`lg:flex ${isOpen ? "block" : "hidden"} w-full lg:w-auto`}>
//                         <ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0" ref={dropdownRef}>
//                             {menuItems.map((item, index) => (
//                                 // <li key={index} className="relative">
//                                 //     <button onClick={() => toggleDropdown(index)} className="hover:text-yellow-400 flex items-center gap-2">
//                                 //         {item.label}
//                                 //         {item.dropdown.length > 0 && (openDropdown === index ? <FaChevronUp /> : <FaChevronDown />)}
//                                 //     </button>
//                                 //     {openDropdown === index && item.dropdown.length > 0 && (
//                                 //         <ul className="absolute left-0 bg-white text-black shadow-lg rounded-md w-56">
//                                 //             {item.dropdown.map((subItem, subIndex) => (
//                                 //                 <li key={subIndex} className="hover:bg-blue-100 p-2">
//                                 //                     <Link href={`#${subItem.toLowerCase()}`}>{subItem}</Link>
//                                 //                 </li>
//                                 //             ))}
//                                 //         </ul>
//                                 //     )}
//                                 // </li>
//                                 <li key={index} className="relative">
//                                     {item.link ? (
//                                         <Link href={item.link} className="hover:text-yellow-400 flex items-center gap-2">
//                                             {item.label}
//                                         </Link>
//                                     ) : (
//                                         <button onClick={() => toggleDropdown(index)} className="hover:text-yellow-400 flex items-center gap-2">
//                                             {item.label}
//                                             {item.dropdown.length > 0 && (openDropdown === index ? <FaChevronUp /> : <FaChevronDown />)}
//                                         </button>
//                                     )}

//                                     {openDropdown === index && item.dropdown.length > 0 && (
//                                         <ul className="absolute left-0 bg-white text-black shadow-lg rounded-md w-56">
//                                             {item.dropdown.map((subItem, subIndex) => (
//                                                 <li key={subIndex} className="hover:bg-blue-100 p-2">
//                                                     <Link href={`#${subItem.toLowerCase()}`}>{subItem}</Link>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     )}
//                                 </li>

//                             ))}
//                         </ul>
//                     </nav>
//                     <SearchBar />
//                     {/* Show ProfileDropdown only if user is logged in */}
//                     <ProfileDropdown />
//                 </div>
//             </header>
//         </>
//     );
// }


// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { FaBars, FaTimes } from "react-icons/fa";
// import ProfileDropdown from "../../user/profiledropdown/page";
// import SearchBar from "../searchbar/page";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// export default function Navbar() {
//     const [isOpen, setIsOpen] = useState(false);
//     const [userId, setUserId] = useState(null);
//     const [loading, setLoading] = useState(true); // Add loading state
//     const [titleCategories, setTitleCategories] = useState([]);
//     const [categoriesByTitle, setCategoriesByTitle] = useState({});
//     const [isExpanded, setIsExpanded] = useState(false);
//     const router = useRouter();

//     useEffect(() => {
//         const storedUserId = localStorage.getItem("userId");
//         setUserId(storedUserId);

//         fetchAllTitleCategories();
//     }, []);

//     const fetchAllTitleCategories = async () => {
//         try {
//             const response = await axios.get("/api/admin/getalltitlecategory");
//             setTitleCategories(response.data);
//             fetchAllCategories(response.data);
//             setLoading(false);
//         } catch (error) {
//             console.error("Error fetching title categories:", error);
//         }
//     };

//     const fetchAllCategories = async (titleCategories) => {
//         try {
//             const categoryData = {};
//             await Promise.all(
//                 titleCategories.map(async (titleCategory) => {
//                     const response = await axios.get(
//                         `/api/admin/getallcategory?titleCategory=${encodeURIComponent(titleCategory._id)}`
//                     );
//                     categoryData[titleCategory._id] = response.data?.categories || [];
//                 })
//             );
//             setCategoriesByTitle(categoryData);
//         } catch (error) {
//             console.error("Error fetching categories:", error);
//         }
//     };

//     const toggleMenu = () => {
//         setIsOpen((prev) => !prev);
//     };


//     const handleCategoryClick = (categoryId, categoryName) => {
//         router.push(`/user/solvetestsubcategory?id=${categoryId}&name=${encodeURIComponent(categoryName)}`);
//     };

//     return (
//         <>
//             <div className="flex justify-between items-center py-2 px-2">
//                 <h6 className="text-2xl font-bold tracking-wide text-blue-300 hover:text-blue-600">
//                     Exam Portal
//                 </h6>
//                 <div className="flex items-center gap-4 text-gray-500 font-bold">
//                     <Link href="#" className="hover:text-yellow-400">CONTACT US</Link>
//                     <Link href="#" className="hover:text-yellow-400">ASK QUESTION</Link>
//                     {!userId ? (
//                         <Link href="/user/login" className="hover:text-yellow-400">LOGIN</Link>
//                     ) : null}
//                 </div>
//             </div>

//             <header className="bg-blue-900 text-white shadow-md rounded-0 ">
//                 <div className="container mx-auto flex justify-between items-center py-4 px-6">
//                     <button className="lg:hidden text-2xl" onClick={toggleMenu}>
//                         {isOpen ? <FaTimes /> : <FaBars />}
//                     </button>
//                     <nav className={`lg:flex ${isOpen ? "block" : "hidden"} w-full lg:w-auto`}>
//                         <ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
//                             {loading
//                                 ? Array.from({ length: 4 }).map((_, index) => (
//                                     <li key={index} className="relative group">
//                                         <div className="w-24 h-6 bg-gray-300 rounded-md animate-pulse"></div>
//                                         <ul className="absolute left-0 w-56">
//                                             {Array.from({ length: 0 }).map((_, subIndex) => (
//                                                 <li
//                                                     key={subIndex}
//                                                     className="h-5 w-44 bg-gray-300 mt-2 rounded-md animate-pulse"
//                                                 ></li>
//                                             ))}
//                                         </ul>
//                                     </li>
//                                 ))
//                                 : titleCategories.map((titleCategory) => (
//                                     <li key={titleCategory._id} className="relative group">
//                                         <button className="hover:text-yellow-400">
//                                             {titleCategory.title}
//                                         </button>
//                                         {categoriesByTitle[titleCategory._id]?.length > 0 && (
//                                             <ul className="absolute left-0 bg-white text-black shadow-lg rounded-md w-56 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-300">
//                                                 {categoriesByTitle[titleCategory._id].map((category) => (
//                                                     <li
//                                                         key={category._id}
//                                                         className="hover:bg-blue-100 p-2 cursor-pointer"
//                                                         onClick={() =>
//                                                             handleCategoryClick(category._id, category.name)
//                                                         }
//                                                     >
//                                                         {category.name}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         )}
//                                     </li>
//                                 ))}
//                         </ul>
//                     </nav>

//                     {/* <nav className={`lg:flex ${isOpen ? "block" : "hidden"} w-full lg:w-auto`}>
//                         <ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
//                             {titleCategories.map((titleCategory) => (
//                                 <li key={titleCategory._id} className="relative group">

//                                     <button className="hover:text-yellow-400">
//                                         {titleCategory.title}
//                                     </button>
//                                     {categoriesByTitle[titleCategory._id]?.length > 0 && (
//                                         <ul className="absolute left-0 bg-white text-black shadow-lg rounded-md w-56 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-300">
//                                             {categoriesByTitle[titleCategory._id].map((category) => (
//                                                 <li
//                                                     key={category._id}
//                                                     className="hover:bg-blue-100 p-2 cursor-pointer"
//                                                     onClick={() => handleCategoryClick(category._id, category.name)}
//                                                 >
//                                                     {category.name}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     )}
//                                 </li>
//                             ))}
//                         </ul>
//                     </nav> */}

//                     <SearchBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
//                     <ProfileDropdown />
//                 </div>
//             </header>
//         </>
//     );
// }

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import ProfileDropdown from "../../user/profiledropdown/page";
import SearchBar from "../searchbar/page";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [titleCategories, setTitleCategories] = useState([]);
    const [categoriesByTitle, setCategoriesByTitle] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);
        fetchAllTitleCategories();
    }, []);

    const fetchAllTitleCategories = async () => {
        try {
            const response = await axios.get("/api/admin/getalltitlecategory");
            setTitleCategories(response.data);
            fetchAllCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching title categories:", error);
        }
    };

    const fetchAllCategories = async (titleCategories) => {
        try {
            const categoryData = {};
            await Promise.all(
                titleCategories.map(async (titleCategory) => {
                    const response = await axios.get(
                        `/api/admin/getallcategory?titleCategory=${encodeURIComponent(titleCategory._id)}`
                    );
                    categoryData[titleCategory._id] = response.data?.categories || [];
                })
            );
            setCategoriesByTitle(categoryData);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    const handleCategoryClick = (categoryId, categoryName) => {
        router.push(`/user/solvetestsubcategory?id=${categoryId}&name=${encodeURIComponent(categoryName)}`);
    };

    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    return (
        <>
            {/* Top Bar */}
            <div className="flex justify-between items-center py-2 px-4 md:px-6 bg-gray-100 hover:bg-gray-200">
                <h6 className="text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-800">
                    Exam Portal
                </h6>
                <div className="flex items-center gap-3 text-gray-600 font-semibold">
                    <Link href="#" className="hover:text-yellow-500">CONTACT US</Link>
                    <Link href="#" className="hover:text-yellow-500">ASK QUESTION</Link>
                    {!userId && (
                        <Link href="/user/login" className="hover:text-yellow-500">LOGIN</Link>
                    )}
                </div>
            </div>

            {/* Navbar */}
            <header className="bg-blue-900 text-white shadow-md">
                <div className="container mx-auto flex justify-between items-center py-3 px-4 md:px-6">
                    {/* Menu Toggle Button for Mobile */}
                    <button className="lg:hidden text-2xl" onClick={toggleMenu}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    {/* Navigation Menu */}
                    <nav className={`lg:flex ${isOpen ? "block" : "hidden"} w-full lg:w-auto mt-4 lg:mt-0`}>
                        <ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-2 lg:space-y-0">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <li key={index} className="relative group">
                                        <div className="w-24 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                                    </li>
                                ))
                            ) : (
                                titleCategories.map((titleCategory, index) => (
                                    <li key={titleCategory._id} className="relative group">
                                        <button
                                            className="hover:text-yellow-400 flex items-center"
                                            onClick={() => toggleDropdown(index)}
                                        >
                                            {titleCategory.title}
                                            {categoriesByTitle[titleCategory._id]?.length > 0 && (
                                                <span className="ml-2">
                                                    {openDropdown === index ? <FaChevronUp /> : <FaChevronDown />}
                                                </span>
                                            )}
                                        </button>
                                        {categoriesByTitle[titleCategory._id]?.length > 0 && openDropdown === index && (
                                            <ul className="absolute left-0 bg-white text-black shadow-md rounded-md w-56 transition-opacity duration-300 z-50">
                                                {categoriesByTitle[titleCategory._id].map((category) => (
                                                    <li
                                                        key={category._id}
                                                        className="hover:bg-blue-100 p-2 cursor-pointer"
                                                        onClick={() => handleCategoryClick(category._id, category.name)}
                                                    >
                                                        {category.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))
                            )}

                            {/* Exam Menu Item */}
                            <li className="relative group">
                                <Link href="/user/exam" className="hover:text-yellow-400 flex items-center">
                                    Exam
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Search Bar & Profile */}
                    <div className="flex items-center gap-3">
                        <SearchBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                        <ProfileDropdown />
                    </div>
                </div>
            </header>
        </>
    );
}
