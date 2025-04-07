// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "../component/Navbar/page";
// import Footer from "../component/footer/page";

// export default function ClientLayout({ children }) {
//     const router = useRouter();
//     const [loading, setLoading] = useState(true);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     useEffect(() => {
//         // Ensure this runs only on the client
//         if (typeof window !== "undefined") {
//             const token = localStorage.getItem("token");

//             if (token) {
//                 setIsAuthenticated(true);
//             } else {
//                 router.replace("/user/login");
//             }

//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         const handleStorageChange = () => {
//             const token = localStorage.getItem("token");
//             setIsAuthenticated(!!token);
//         };

//         window.addEventListener("storage", handleStorageChange);
//         return () => window.removeEventListener("storage", handleStorageChange);
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <h1 className="text-2xl font-semibold">Loading...</h1>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col min-h-screen">
//             {isAuthenticated && <Navbar />}

//             {/* Content Section */}
//             <main className="flex-1 p-4">{children}</main>

//             {/* Footer Section */}
//             {isAuthenticated && <Footer className="mt-auto " />}
//         </div>


//     );
// }
///////////////////////////bottom main code


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Navbar from "../component/Navbar/page";
// import Footer from "../component/footer/page";
// // import { usePathname } from "next/navigation";


// export default function ClientLayout({ children }) {
//     const router = useRouter();
//     const pathname = usePathname(); // Get current route
//     const [loading, setLoading] = useState(true);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     useEffect(() => {
//         if (typeof window !== "undefined") {
//             const token = localStorage.getItem("token");
//             if (token) {
//                 setIsAuthenticated(true);
//             } else {
//                 router.replace("/user/login");
//             }
//             setLoading(false);
//         }
//     }, [router]);

//     useEffect(() => {
//         const handleStorageChange = () => {
//             const token = localStorage.getItem("token");
//             setIsAuthenticated(!!token);
//         };

//         window.addEventListener("storage", handleStorageChange);
//         return () => window.removeEventListener("storage", handleStorageChange);
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <h1 className="text-2xl font-semibold">Loading...</h1>
//             </div>
//         );
//     }

//     // Check if the path is in the admin panel
//     const isAdminRoute = pathname.startsWith("/admin");

//     return (
//         <div className="flex flex-col min-h-screen">
//             {!isAdminRoute && isAuthenticated && <Navbar />}

//             {/* Main Content */}
//             <main className="flex-1 p-4">{children}</main>

//             {/* Footer Section */}
//             {!isAdminRoute && isAuthenticated && <Footer className="mt-auto " />}
//         </div>
//     );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Navbar from "../component/Navbar/page";
// import MainHomePage from "../user/homepage/page";
// import Footer from "../component/footer/page";



// export default function ClientLayout({ children }) {
//     const pathname = usePathname(); // Get current route
//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         setIsAuthenticated(!!token);
//     }, []);

//     const isAdminRoute = pathname.startsWith("/admin");

//     return (
//         <div className="flex flex-col min-h-screen">
//             {!isAdminRoute && <Navbar />}

//             <main className="flex-1 p-4">
//                 {isAuthenticated ? children : <MainHomePage />}
//             </main>

//             {!isAdminRoute && <Footer className="mt-auto" />}
//         </div>
//     );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "../component/Navbar/page";
import MainHomePage from "../user/homepage/page";
import Footer from "../component/footer/page";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const isAdminRoute = pathname.startsWith("/admin");
    const isHomePage = pathname === "/" || pathname === "/user";

    return (
        <div className="flex flex-col min-h-screen bg-gray-200">
            {!isAdminRoute && <Navbar />}

            <main className="flex-1 p-4">
                {isHomePage && !isAuthenticated ? <MainHomePage /> : children}
            </main>

            {!isAdminRoute && <Footer className="mt-auto" />}
        </div>
    );
}
