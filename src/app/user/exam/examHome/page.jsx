


"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ExamHome = () => {
    const [titleCategories, setTitleCategories] = useState([]);
    const [categoriesByTitle, setCategoriesByTitle] = useState({});
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch Title Categories
    const fetchAllTitleCategories = async () => {
        try {
            const response = await axios.get("/api/admin/getalltitlecategory");
            setTitleCategories(response.data);
            await fetchAllCategories(response.data); // Fetch all categories after getting title categories
        } catch (error) {
            console.error("Error fetching title categories:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Categories for All Title Categories
    const fetchAllCategories = async (titleCategories) => {
        try {
            const categoryData = {};
            await Promise.all(
                titleCategories.map(async (titleCategory) => {
                    const response = await axios.get(
                        `/api/admin/getallcategory?titleCategory=${titleCategory._id}`
                    );
                    categoryData[titleCategory._id] = response.data.categories || [];
                })
            );
            setCategoriesByTitle(categoryData);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchAllTitleCategories();
    }, []);

    const router = useRouter();

    const handleCategoryClick = (categoryId, categoryName) => {
        router.push(`/user/exam/subcategory?id=${categoryId}&name=${encodeURIComponent(categoryName)}`);
    };
    // const handleCategoryClick = (categoryId, categoryName) => {
    //     if (window.location.pathname === "/user/exam") {
    //         router.push(`/user/subcategory?id=${categoryId}&name=${encodeURIComponent(categoryName)}`);
    //     } else {
    //         router.push(`/user/solvetestsubcategory?id=${categoryId}&name=${encodeURIComponent(categoryName)}`);
    //     }
    // };

    return (
        <main className="container mx-auto py-10">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
                    {titleCategories.map((titleCategory, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-lg p-5 hover:shadow-2xl transition duration-300"
                        >
                            <h2 className="bg-blue-900 text-white text-xl font-bold p-2 rounded">
                                {titleCategory.title}
                            </h2>
                            {/* Display categories under each title category */}
                            <div className="mt-4 space-y-2">
                                {categoriesByTitle[titleCategory._id]?.map((category, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleCategoryClick(category._id, category.name)}
                                        className="block hover:bg-blue-200 py-2 px-2 hover:text-blue-900 rounded-sm text-lg cursor-pointer"
                                    >
                                        - {category.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default ExamHome;
