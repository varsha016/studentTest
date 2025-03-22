// import React from 'react'
// import MainHomePage from '../homepage/page'

// function ExamPage() {
//     localStorage.getItem("token")
//     localStorage.getItem("userId")
//     return (
//         <div>
//             <h1>u can not give exam before login </h1>
//             <MainHomePage />
//         </div>
//     )
// }

// export default ExamPage

"use client";
import React, { useEffect } from 'react';
import MainHomePage from '../homepage/page';
import ExamHome from './examHome/page';

function ExamPage() {
    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("You are not logged in. Redirecting to login...");
            window.location.href = "/user/login"; // Redirect to login page
        }
    }, []);

    return (
        <div>
            {/* <h1>Welcome to the Exam Page. You can start your exam now!</h1> */}
            < ExamHome />
        </div>
    );
}

export default ExamPage;
