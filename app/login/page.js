"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi"; // 👈 Import eye icons

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 Toggle state
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter User ID and Password",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.error || "Invalid credentials",
          background: "#111827",
          color: "#fff",
          confirmButtonColor: "#16a34a",
        });
        return;
      }

      const { value: otp, isConfirmed } = await Swal.fire({
        title: "OTP",
        input: "text",
        inputLabel: "We sent an OTP to your registered email",
        inputPlaceholder: "Enter your OTP",
        showCancelButton: true,
        confirmButtonText: "Verify",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#16a34a",
        inputAttributes: { autocapitalize: "off", autocorrect: "off" },
        didOpen: () => {
          const input = Swal.getInput();
          if (input) input.focus();
        },
      });

      if (isConfirmed) {
        const token = "token-" + Date.now();
        try {
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
        } catch (err) {
          console.log(err);
        }

        await Swal.fire({
          icon: "success",
          title: "OTP Verified",
          text: "You will be redirected to your dashboard",
          background: "#111827",
          color: "#fff",
          confirmButtonColor: "#16a34a",
        });

        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("username", userId);

        router.push("/dashboard");
      } else {
        await Swal.fire({
          icon: "info",
          title: "Cancelled",
          text: "Login cancelled",
          background: "#111827",
          color: "#fff",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#16a34a",
      });
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
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
            Login to Alfamily
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm mb-2">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none text-white"
                placeholder="Enter your User ID"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-12 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none text-white"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-gray-400 hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-yellow-500 hover:bg-green-600 text-black font-semibold transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
