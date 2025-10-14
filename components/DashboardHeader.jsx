"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.clear(); // clear all items
    // or use: localStorage.removeItem("token"); localStorage.removeItem("userId"); etc.
    router.push("/login");
  };

  return (
    <header className="bg-black text-white py-4 px-6 flex justify-between items-center shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <span className="font-bold text-xl text-green-400">Alfamily</span>
      </div>

      {/* Search bar */}
      <div className="flex-1 mx-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-lg text-black"
        />
      </div>

      {/* Notification and user */}
      <div className="flex items-center space-x-4">
        <button className="relative">
          🔔
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white px-1 rounded-full">
            3
          </span>
        </button>

        <div className="relative group">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <span>{username || "User"}</span>
            ▼
          </button>

          {/* Dropdown */}
          <ul className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href="/profile"
              className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
            >
              Profile
            </Link>
            <Link
              href="/changepassword"
              className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
            >
              Change Password
            </Link>
             <Link href="/useractivity" className="block px-4 py-2 hover:text-green-400">
              User Activity
             </Link>
            <li
              onClick={handleLogout}
              className="block px-4 py-2 hover:bg-gray-700 cursor-pointer text-green-400"
            >
              Logout
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
