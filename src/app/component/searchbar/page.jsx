


"use client";
import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [data, setData] = useState([]);
    const [fuse, setFuse] = useState(null);


    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchApprovedQuestions = async () => {
            try {
                if (typeof window === "undefined") return;
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get("/api/admin/fetchApprovedQuestions", {
                    headers: { Authorization: `Bearer ${token.trim()}` },
                });

                if (response.data.questions.length > 0) {
                    setData(response.data.questions);
                    setFuse(new Fuse(response.data.questions, { keys: ["questionText"], threshold: 0.3 }));
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchApprovedQuestions();
    }, []);

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

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsExpanded(false);
            setSearchTerm("");
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full max-w-md" ref={dropdownRef}>
            <div className={`relative transition-all duration-100 ${isExpanded ? "w-full" : "w-12"}`}>
                <input
                    type="text"
                    placeholder="Search questions..."
                    className={`p-3 pl-10 border rounded-full focus:ring-2 focus:ring-blue-400 transition-all duration-600 ${isExpanded ? "w-full" : "w-12 opacity-0"}`}
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={() => setIsExpanded(true)}
                />
                <FaSearch size={20} className="absolute border-none  left-3 top-3 text-white cursor-pointer" onClick={() => setIsExpanded(true)} />
            </div>

            {isExpanded && searchTerm && (
                <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2 max-h-60 overflow-y-auto border">
                    {searchResults.length > 0 ? (
                        searchResults.map((item, index) => (
                            <div
                                key={index}
                                className="p-3 hover:bg-blue-100 text-gray-600 cursor-pointer border-b last:border-none"
                                // onClick={() => alert(`You selected: ${item.questionText}`)}
                                onClick={() => alert(`You selected: ${item.questionText.replace(/<[^>]+>/g, '')}`)}
                            >
                                <div
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: item.questionText }}
                                />
                                {/* {item.questionText} */}
                            </div>
                        ))
                    ) : (
                        <p className="p-3 text-gray-500">No questions found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
// "use client";

// export default function SearchBar({ isExpanded, setIsExpanded }) {
//     return (
//         <input
//             type="text"
//             placeholder="Search..."
//             onFocus={() => setIsExpanded(true)}
//             onBlur={() => setIsExpanded(false)}
//             className={`transition-all duration-300 border rounded px-3 py-1 text-black focus:outline-none ${isExpanded ? "w-full lg:w-64" : "w-24 lg:w-48"
//                 }`}
//         />
//     );
// }