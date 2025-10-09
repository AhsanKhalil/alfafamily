"use client"; // Client component for hooks

import "./globals.css";
import 'leaflet/dist/leaflet.css';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showMainHeader = !pathname.startsWith("/dashboard"); // Hide main header on dashboard

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
