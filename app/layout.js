"use client"; // Client component for hooks

import "./globals.css";
import 'leaflet/dist/leaflet.css';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
 // const showMainHeader = !pathname.startsWith("/dashboard"); // Hide main header on dashboard
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isProfilePage = pathname.startsWith("/profile");
    const isChangepassword = pathname.startsWith("/changepassword");


  // show main header only if not dashboard or profile
  const showMainHeader = !isDashboardPage && !isProfilePage && !isChangepassword;

  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex flex-col">
        {/* Main header */}
        {showMainHeader && <Header className="bg-black text-white" />}

        {/* Page content */}
        <main className="flex-1">{children}</main>
        
        {/* Footer */}
        <Footer className="bg-black text-yellow-400" />
      </body>
    </html>
  );
}
