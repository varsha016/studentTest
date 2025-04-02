'use client';
import React from 'react'
import axios from "axios";

function page() {
    // const handleApprove = async (id) => {
    //     try {
    //         const response = await axios.patch(`/api/admin/questions/${id}`);
    //         alert(response.data.message);
    //     } catch (error) {
    //         alert(`Error: ${error.response?.data?.error || error.message}`);
    //     }
    // };

    // const handleReject = async (id) => {
    //     const reason = prompt("Enter rejection reason:");
    //     if (!reason) return;

    //     try {
    //         const response = await axios.delete(`/api/admin/questions/${id}`, {
    //             data: { rejectionReason: reason },
    //         });
    //         alert(response.data.message);
    //     } catch (error) {
    //         alert(`Error: ${error.response?.data?.error || error.message}`);
    //     }
    // };

    return (
        <div>page</div>
    )
}

export default page