



// // "use client";
// // import { useState } from "react";
// // import { useRouter } from "next/navigation"; // ✅ Correct import for App Router

// // const Dashboard = () => {
// //     const [isOpen, setIsOpen] = useState(true);
// //     const router = useRouter(); // ✅ Works in the App Router

// //     const menuItems = [
// //         { key: "addTitleCategory", path: "./addtitlecategory" }, // ✅ Cleaner URL
// //         // { key: "addTitleCategory", path: "./../addtitlecategory" },
// //         { key: "category", path: "./addcategory" },
// //         { key: "section", path: "./addSection" },
// //         { key: "subCategory", path: "./addsubcategory" },
// //         { key: "addquestion", path: "./addquestion" },
// //         { key: "addoption", path: "./addoption" },
// //     ];

// //     return (
// //         <div className="flex h-screen">
// //             {/* Sidebar */}
// //             <div className={`bg-gray-800 text-white ${isOpen ? "w-64" : "w-16"} transition-all duration-300`}>
// //                 <button
// //                     className="p-2 text-white bg-gray-700 w-full text-left"
// //                     onClick={() => setIsOpen(!isOpen)}
// //                 >
// //                     {isOpen ? "Close" : "Open"}
// //                 </button>
// //                 <ul>
// //                     {menuItems.map((item) => (
// //                         <li
// //                             key={item.key}
// //                             className="p-3 cursor-pointer hover:bg-gray-600"
// //                             onClick={() => router.push(item.path)}
// //                         >
// //                             {isOpen ? item.key : item.key[0]}
// //                         </li>
// //                     ))}
// //                 </ul>
// //             </div>

// //             {/* Main Content */}
// //             <div className="flex-1 p-6">
// //                 <h1 className="text-2xl font-bold">Dashboard</h1>
// //                 <p>Select a page from the sidebar.</p>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Dashboard;

// "use client";
// import { useState, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";

// const Dashboard = () => {
//     const [isOpen, setIsOpen] = useState(true);
//     const router = useRouter();
//     const pathname = usePathname(); // Get the current route

//     const menuItems = [
//         { key: "addTitleCategory", path: "/admin/dashboard/addtitlecategory" },
//         { key: "category", path: "/admin/dashboard/addcategory" },
//         { key: "section", path: "/dashboard/addSection" },
//         { key: "subCategory", path: "/admin/dashboard/addsubcategory" },
//         { key: "addquestion", path: "/admin/dashboard/addquestion" },
//         // { key: "addoption", path: "/admin/dashboard/addoption" },
//     ];

//     // Redirect to default page if on /dashboard
//     useEffect(() => {
//         if (pathname === "/dashboard") {
//             router.push("/dashboard/addtitlecategory");
//             router.push("/dashboard/addtitlecategory");
//             router.push("/dashboard/addSection");
//             router.push("/dashboard/addsubcategory");
//             router.push("/dashboard/addquestion");
//             // router.push("/dashboard/addsubcategory");
//         }
//     }, [pathname]);

//     return (
//         <div className="flex h-screen">
//             {/* Sidebar */}
//             <div className={`bg-gray-800 text-white ${isOpen ? "w-64" : "w-16"} transition-all duration-300`}>
//                 <button
//                     className="p-2 text-white bg-gray-700 w-full text-left"
//                     onClick={() => setIsOpen(!isOpen)}
//                 >
//                     {isOpen ? "Close" : "Open"}
//                 </button>
//                 <ul>
//                     {menuItems.map((item) => (
//                         <li
//                             key={item.key}
//                             className={`p-3 cursor-pointer hover:bg-gray-600 ${pathname === item.path ? "bg-gray-600" : ""
//                                 }`}
//                             onClick={() => router.push(item.path)}
//                         >
//                             {isOpen ? item.key : item.key[0]}
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             {/* Main Content */}
//             <div className="flex-1 p-6">
//                 <h1 className="text-2xl font-bold">Dashboard</h1>
//                 <p>Select a page from the sidebar.</p>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

import { redirect } from "next/navigation";

export default function DashboardPage() {
    redirect("/admin/dashboard/addtitlecategory");
}


