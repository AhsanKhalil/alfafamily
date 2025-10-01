// app/login/page.jsx
"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Bypass backend validation: accept provided username/password,
    // then prompt user for OTP and proceed to dashboard if OTP entered.
    try {
      const { value: otp, isConfirmed } = await Swal.fire({
        title: "Enter OTP",
        input: "text",
        inputLabel: "We sent an OTP to your email",
        inputPlaceholder: "Enter your OTP",
        showCancelButton: true,
        confirmButtonText: "Verify",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#16a34a", // green
        inputAttributes: {
          autocapitalize: "off",
          autocorrect: "off",
        },
        didOpen: () => {
          const input = Swal.getInput();
          if (input) input.focus();
        },
      });

      if (isConfirmed) {
        // Save token/username in localStorage to represent logged-in state
        // (backend validation is intentionally bypassed per request)
        const token = "token-" + Date.now();
        try {
          localStorage.setItem("token", token);
          localStorage.setItem("username", username || "");
        } catch (err) {
          // ignore storage errors
        }

        await Swal.fire({
          icon: "success",
          title: "OTP Verified",
          text: "You will be redirected to your dashboard",
          background: "#111827",
          color: "#fff",
          confirmButtonColor: "#16a34a",
        });

        router.push("/dashboard");
      } else {
        // user cancelled OTP
        await Swal.fire({
          icon: "info",
          title: "Cancelled",
          text: "Login cancelled",
          background: "#111827",
          color: "#fff",
        });
      }
    } catch (err) {
      console.error("Login/OTP error:", err);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <main className="bg-black text-white min-h-screen grid grid-cols-1 md:grid-cols-2 items-center">
      {/* LEFT SIDE - IMAGE */}
      <div className="hidden md:flex justify-center">
        <Image
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
          alt="Login visual"
          width={500}
          height={500}
          className="rounded-2xl shadow-lg object-cover"
        />
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-gray-900 p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">
            Login to Alfamily
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none text-white"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none text-white"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-black font-semibold transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
