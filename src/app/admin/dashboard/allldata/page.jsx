'use client'
import { useEffect, useState } from "react";
import axios from "axios";

const TitleCategoryList = () => {
    const [titleCategories, setTitleCategories] = useState([]);
    const [questionsMap, setQuestionsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("operatorToken") : null;
    const operatorInfo = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("operatorInfo") || "{}")
        : {};
    const operatorId = operatorInfo.operatorId;
    console.log(operatorId, "Operator ID from local storage");
    console.log(token, "token");


    useEffect(() => {
        if (operatorId && token) {
            fetchTitleCategories();
        }
    }, [operatorId, token]);

    const fetchTitleCategories = async () => {
        try {
            const response = await axios.get(`/api/admin/titlewithoperatorid/${operatorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);

            const data = response.data;
            setTitleCategories(data);

            // ✅ Extract subcategory IDs
            const subcategoryIds = [];
            data.forEach((item) => {
                item.categories?.forEach((cat) => {
                    cat.subcategories?.forEach((sub) => {
                        if (sub.id) subcategoryIds.push(sub.id);
                    });
                });
            });

            // ✅ Fetch related questions
            await fetchQuestions(subcategoryIds);
        } catch (error) {
            console.error("Error fetching title categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async (subcategoryIds) => {
        try {
            const res = await axios.post(
                `/api/admin/getQuestionsBySubcategories`,
                { subcategoryIds },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = res.data;

            const map = {};
            data.forEach((q) => {
                if (!map[q.subcategoryId]) map[q.subcategoryId] = [];
                map[q.subcategoryId].push(q);
            });

            setQuestionsMap(map);
        } catch (err) {
            console.error("Error fetching questions:", err);
        }
    };

    return (
        <div className="p-4">
            {loading ? (
                <p>Loading...</p>
            ) : (
                titleCategories.map((item) => (
                    <div key={item._id} className="border rounded p-4 mb-4">
                        <h2 className="font-bold text-xl">{item.title}</h2>
                        {item.categories?.map((cat, idx) => (
                            <div key={idx} className="ml-4 mt-2">
                                <h3 className="font-semibold text-lg">Category: {cat.name}</h3>
                                <ul className="ml-4 list-disc">
                                    {cat.subcategories?.map((sub, sIdx) => (
                                        <li key={sIdx}>
                                            <p className="font-medium">Subcategory: {sub.name}</p>
                                            <ul className="ml-4 list-[circle] text-sm text-gray-700">
                                                {questionsMap[sub.id]?.length > 0 ? (
                                                    questionsMap[sub.id].map((q, qIdx) => (
                                                        <li key={qIdx}>{q.question}</li>
                                                    ))
                                                ) : (
                                                    <li>No questions found.</li>
                                                )}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default TitleCategoryList;

