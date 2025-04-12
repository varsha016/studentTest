



"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import axios from "axios";

const SubcategoryPageContent = () => {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("id");
    const categoryName = searchParams.get("name") || "Category";

    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(categoryId, "JJJ");

    useEffect(() => {
        if (categoryId) {
            setLoading(true);

            axios
                .get(`/api/admin/getallsubcategory`, {
                    params: { id: categoryId }
                })
                .then((res) => {
                    // setSubcategories(res.data.subcategories || []);
                    setSubcategories(Array.isArray(res.data.subcategories) ? res.data.subcategories : []);

                })
                .catch((error) => {
                    setSubcategories([]);
                    console.error("Axios error fetching subcategories:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [categoryId]);


    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!categoryId) return;

            try {
                setLoading(true);
                // setError(null);

                const response = await fetch(`/api/admin/getallsubcategory?id=${categoryId}`);
                if (!response.ok) throw new Error('Failed to fetch subcategories');

                const data = await response.json();
                // Handle both array and object response formats
                const subcategoriesData = data?.subcategories || data?.data || data || [];
                setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
            } catch (err) {
                console.error("Error fetching subcategories:", err);

                setSubcategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSubcategories();
    }, [categoryId]);
    if (!categoryId) return <p className="text-red-500">Invalid category</p>;

    return (
        <div className="flex justify-center items-center h-screen bg-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
                <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
                <hr className="mb-4" />

                {loading ? (
                    <div className="flex justify-center items-center h-20">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {subcategories?.length > 0 ? (
                            subcategories?.map((sub, index) => (
                                <Link key={sub._id} href={`/user/exam/examsection?id=${sub._id}`}>
                                    <div className="p-2 text-md font-semibold cursor-pointer hover:bg-gray-300 rounded-sm transition">
                                        {sub.name}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-500">No subcategories found.</p>
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
