"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // separate visibility states for each field
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "New passwords do not match!",
        confirmButtonColor: "#ef4444",
        background: "#1f2937",
        color: "#fff",
      });
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in");

      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, oldPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Password Updated!",
          text: "Your password has been changed successfully.",
          confirmButtonColor: "#10b981",
          background: "#1f2937",
          color: "#fff",
        });

        // reset form
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.error || "Something went wrong!",
          confirmButtonColor: "#ef4444",
          background: "#1f2937",
          color: "#fff",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
        confirmButtonColor: "#ef4444",
        background: "#1f2937",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827]">
      <div className="w-full max-w-md bg-gray-900 text-gray-100 shadow-xl rounded-2xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-400">
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-5">

          {/* Old Password */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-1">
              Old Password
            </label>
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full p-3 pr-10 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-[50%] translate-y-1 cursor-pointer text-green-400 text-lg"
            >
              {showOldPassword ? "👁️" : "🙈"}
            </span>
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-1">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 pr-10 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-[50%] translate-y-1 cursor-pointer text-green-400 text-lg"
            >
              {showNewPassword ? "👁️" : "🙈"}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 pr-10 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[50%] translate-y-1 cursor-pointer text-green-400 text-lg"
            >
              {showConfirmPassword ? "👁️" : "🙈"}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
