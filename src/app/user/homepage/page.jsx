"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MainHomePage = () => {
  const [titleCategories, setTitleCategories] = useState([]);
  const [categoriesByTitle, setCategoriesByTitle] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch Title Categories
  const fetchAllTitleCategories = async () => {
    const token = localStorage.getItem("operatorToken");
    try {
      const response = await axios.get("/api/admin/getalltitlecategory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    if (!Array.isArray(titleCategories) || titleCategories.length === 0) {
      setCategoriesByTitle({});
      return;
    }

    try {
      setLoading(true);
      const categoryData = {};

      await Promise.all(
        titleCategories.map(async (titleCategory) => {
          try {
            const response = await axios?.get(
              `/api/admin/getallcategory?titleCategory=${titleCategory._id}`
            );
            // Handle both array and object response formats
            const categories =
              response.data?.categories || response.data?.data || [];
            categoryData[titleCategory._id] = Array.isArray(categories)
              ? categories
              : [];
          } catch (error) {
            console.error(
              `Error fetching categories for title ${titleCategory._id}:`,
              error
            );
            categoryData[titleCategory._id] = [];
          }
        })
      );

      setCategoriesByTitle(categoryData);
    } catch (error) {
      console.error("Error in fetchAllCategories:", error);
      setCategoriesByTitle({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTitleCategories();
  }, []);

  const router = useRouter();

  const handleCategoryClick = (categoryId, categoryName) => {
    router.push(
      `/user/solvetestsubcategory?id=${categoryId}&name=${encodeURIComponent(
        categoryName
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to MCQ Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Select a category to begin your practice
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {titleCategories.map((titleCategory) => (
              <div
                key={titleCategory._id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                  <h2 className="text-2xl font-bold text-white">
                    {titleCategory.title}
                  </h2>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categoriesByTitle[titleCategory._id]?.map((category) => (
                    <Link
                      key={category._id}
                      href={`/user/solvetestsubcategory?id=${category._id}`}
                      className="block group"
                    >
                      <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md group-hover:-translate-y-1 h-full flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-gray-600 text-sm mb-4">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="text-blue-600 font-medium flex items-center mt-auto">
                          Start Practice
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  )) || []}
                </div>

                {(!categoriesByTitle[titleCategory._id] ||
                  categoriesByTitle[titleCategory._id].length === 0) && (
                    <div className="p-6 text-center text-gray-500">
                      No categories available for this section
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainHomePage;
