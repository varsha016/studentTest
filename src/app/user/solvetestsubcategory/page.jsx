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

    useEffect(() => {
        if (categoryId) {
            setLoading(true);
            fetch(`/api/admin/getallsubcategory?id=${categoryId}`)
                .then((res) => res.json())
                .then((data) => setSubcategories(data))
                .catch((error) => console.error("Error fetching subcategories:", error))
                .finally(() => setLoading(false));
        }
    }, [categoryId]);

    if (!categoryId) return <p className="text-red-500 text-center">Invalid category</p>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-4 text-center">{categoryName}</h1>
                <hr className="mb-4" />

                {loading ? (
                    <div className="flex justify-center items-center h-20">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {subcategories.length > 0 ? (
                            subcategories.map((sub) => (
                                <Link key={sub._id} href={`/user/testsection?id=${sub._id}`}>
                                    <div className="p-3 text-md font-semibold cursor-pointer bg-gray-100 hover:bg-gray-300 rounded-md transition text-center">
                                        {sub.name}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center col-span-full">No subcategories found.</p>
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
