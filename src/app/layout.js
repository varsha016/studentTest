// "use client";  // Ensure this runs only on the client side



// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "./component/Navbar/Navbar";
// import Footer from "./component/footer/page";
// // import Navbar from "./component/Navbar/Navbar";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="flex flex-col min-h-screen">
//         <Navbar />
//         <main className="flex-1">{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}


