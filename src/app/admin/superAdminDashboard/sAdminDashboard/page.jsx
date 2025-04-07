"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import TotalOperatorCard from "../totaloperator/page";
import TotalUsersCard from "../TotalUsersCard/page";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

function SAdminDashboard() {
  const [statusCounts, setStatusCounts] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
    draft: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("operatorToken");
    if (!token) return;

    const statuses = ["approved", "pending", "rejected", "draft"];

    const fetchCounts = async () => {
      try {
        const results = await Promise.all(
          statuses.map((status) =>
            axios.get(`/api/superadmin/allstatusquestions?status=${status}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );

        const newCounts = {};
        results.forEach((res, idx) => {
          newCounts[statuses[idx]] = res.data.length;
        });

        setStatusCounts(newCounts);
      } catch (err) {
        console.error("❌ Failed to fetch status counts:", err);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    { label: "Approved", count: statusCounts.approved, color: "green" },
    { label: "Pending", count: statusCounts.pending, color: "yellow" },
    { label: "Rejected", count: statusCounts.rejected, color: "red" },
    { label: "Draft", count: statusCounts.draft, color: "blue" },
  ];
  const colorMap = {
    green: "border-green-500 text-green-600",
    yellow: "border-yellow-500 text-yellow-600",
    red: "border-red-500 text-red-600",
    blue: "border-blue-500 text-blue-600",
  };

  return (
    <>

      {!cards ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <span className="text-gray-600 text-lg font-medium">Loading Data...</span>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
            📊 Super Admin Dashboard
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
              <motion.div
                key={card.label}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className={`rounded-2xl shadow-xl p-6 bg-white transition hover:scale-105 border-l-8 ${colorMap[card.color]}`}
              >
                <h2 className={`text-xl font-semibold text-${card.color}-600`}>
                  {card.label}
                </h2>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {card.count}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Total {card.label.toLowerCase()} questions
                </p>
              </motion.div>
            ))}

          </div>
          <TotalOperatorCard />
          <TotalUsersCard />

        </div>
      )}



    </>
  )
}



export default SAdminDashboard;
