"use client";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline"; // using heroicons (install via npm i @heroicons/react)

export default function Header() {
  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo / App Name */}
        
         <Link href="/" className="flex items-center font-bold text-4xl ml-6 cursor-pointer select-none">
  <span className="text-white-400">Al</span>
  <span className="text-yellow-400">family</span>
</Link>


        {/* Navigation */}
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link
                href="/"
                className="flex items-center hover:text-green-400 transition"
              >
                <HomeIcon className="w-5 h-5 mr-1" />
                <span className="sr-only">Home</span> {/* accessible label */}
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-green-600 text-black font-semibold shadow-md transition"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
