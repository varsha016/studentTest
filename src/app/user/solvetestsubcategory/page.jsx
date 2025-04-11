"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

const SubcategoryPageContent = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");
  const categoryName = searchParams.get("name") || "Category";

  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/getallsubcategory?id=${categoryId}`);
        if (!response.ok) throw new Error('Failed to fetch subcategories');

        const data = await response.json();
        // Handle both array and object response formats
        const subcategoriesData = data?.subcategories || data?.data || data || [];
        setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setError(err.message);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  if (!categoryId)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md w-full">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid Category</h2>
          <p className="text-gray-600 mb-6">The category you're trying to access doesn't exist or is invalid.</p>
          <Link href="/user/homepage" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md w-full">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something Went Wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName}</h1>
          <p className="text-lg text-gray-600">Select a subcategory to begin your practice</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subcategories.length > 0 ? (
              subcategories.map((sub) => (
                <Link key={sub._id} href={`/user/testsection?id=${sub._id}`}>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-400 group cursor-pointer h-full flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {sub.name}
                    </h3>
                    {sub.description && (
                      <p className="text-gray-600 text-sm mb-4 flex-1">
                        {sub.description}
                      </p>
                    )}
                    <div className="text-blue-600 font-medium flex items-center mt-auto">
                      Start Practice
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">📭</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Subcategories Found</h3>
                <p className="text-gray-500">There are currently no subcategories available for this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SubcategoryPage = () => (
  <Suspense fallback={<p>Loading...</p>}>
    <SubcategoryPageContent />
  </Suspense>
);

export default SubcategoryPage;
