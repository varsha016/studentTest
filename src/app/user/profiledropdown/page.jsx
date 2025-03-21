"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaChevronUp, FaChevronDown, FaUserCircle } from "react-icons/fa";

export default function ProfileDropdown() {
    const router = useRouter();
    const [profileOpen, setProfileOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const dropdownRef = useRef(null);

    const toggleProfile = () => {
        setProfileOpen((prev) => !prev);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userId]);

    const goToProfile = () => {
        console.log("Navigating to Profile...");
        router.push("/user/profile");
    };

    // const logout = () => {

    //     localStorage.removeItem("token");
    //     router.push("/user/login");
    // };

    const logout = () => {
        const userId = localStorage.getItem("userId"); // If you stored userId in localStorage
        console.log(userId, "userId");
        setUserId(userId);

        localStorage.removeItem("token");
        localStorage.removeItem("userId"); // Clear userId if stored
        router.push("/user/login");
    };


    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={toggleProfile} className="flex items-center gap-2 hover:text-yellow-400">
                <FaUserCircle className="text-2xl" />
                <span>Profile</span>
                {profileOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {profileOpen && (
                <ul className="absolute right-0 bg-white text-black shadow-lg rounded-md w-40 pointer-events-auto">
                    <li className="hover:bg-blue-100 p-2 cursor-pointer" onClick={goToProfile}>
                        Profile
                    </li>
                    <li className="hover:bg-blue-100 p-2">
                        <Link href="/user/settings">Settings</Link>
                    </li>
                    <li className="hover:bg-blue-100 p-2">
                        <Link href="/user/savedQuestions">Saved questions</Link>
                    </li>
                    <li className="hover:bg-blue-100 p-2 cursor-pointer" onClick={logout}>
                        Logout
                    </li>
                </ul>
            )}
        </div>
    );
}
