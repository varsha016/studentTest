"use client";
import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [data, setData] = useState([]);
    const [fuse, setFuse] = useState(null);
    const dropdownRef = useRef(null);


    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchApprovedQuestions = async () => {
            try {
                if (typeof window === "undefined") return;

                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    return;
                }

                console.log("Using Token:", token);

                const response = await axios.get("/api/admin/fetchApprovedQuestions", {
                    headers: {
                        Authorization: `Bearer ${token.trim()}`,
                    },
                });

                console.log("✅ API Response:", response);
                console.log("✅ Approved Questions:", response.data.questions);

                if (response.data.questions.length === 0) {
                    setMessage("No approved questions available.");
                } else {
                    setSearchResults(response.data.questions);
                    setFuse(new Fuse(response.data.questions, { keys: ["questionText"], threshold: 0.3 }));
                    setMessage(""); // Clear message if questions are available
                }
            } catch (error) {
                console.error("❌ Error fetching questions:", error);

                if (error.response) {
                    console.error("❌ API Response Error:", error.response);
                    setMessage(`Error: ${error.response.data.message || "Unknown error"}`);
                } else {
                    console.error("❌ Request setup error", error.message);
                    setMessage(`Error: ${error.message}`);
                }
            }
        };

        fetchApprovedQuestions();
    }, []);
    console.log(searchResults, 'sssssssssssssssssssssssss');

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (!term.trim() || !fuse) {
            setSearchResults(data);
            return;
        }

        const result = fuse.search(term).map((item) => item.item);
        setSearchResults(result);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setSearchTerm("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="p-0 w-full max-w-md">

            {/* Search Input with Icon */}
            <div className="relative" ref={dropdownRef}>
                <input
                    type="text"
                    placeholder="Search questions..."

                    className="p-3 pl-10 w-full border  rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-500" />

                {/* Dropdown Results */}
                {searchTerm && (
                    <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2 max-h-60 overflow-y-auto border">
                        {searchResults.length > 0 ? (
                            searchResults.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-3 hover:bg-blue-100 text-gray-600 cursor-pointer border-b last:border-none"
                                    onClick={() => alert(`You selected: ${item.questionText}`)}
                                >
                                    {item.questionText}
                                </div>
                            ))
                        ) : (
                            <p className="p-3 text-gray-500">No questions found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
