import React from 'react'
import MainHomePage from './user/homepage/page'
import Footer from './component/footer/page'
import Navbar from './component/Navbar/page'



function page() {
  return (
    <div  >
      {/* <Navbar /> */}
      <MainHomePage />

      {/* <Footer /> */}
    </div>
  )
}

export default page

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function HomePage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     console.log(token, "tolen");

//     const role = localStorage.getItem("role");
//     console.log(token, "token");

//     if (token) {
//       if (role === "admin") {
//         router.replace("/admin/dashboard");
//       } else {
//         router.replace("/user/home");
//       }
//     } else {
//       router.replace("/user/userLogin");
//     }
//     setLoading(false);
//   }, [router]);

//   if (loading) return <h1>Loading...</h1>;

//   return null;
// }



