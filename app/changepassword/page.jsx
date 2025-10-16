"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

export default function ChangePassword() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userId, setUserId] = useState("");

  // ✅ safely get userId from localStorage (client side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId || "");
    }
  }, []);

  // ✅ Yup validation schema
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required"),
    password: Yup.string()
      .required("New password is required")
      .min(8, "Must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[@$!%*?&#]/, "Must contain at least one special character"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!userId) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "User ID not found. Please log in again.",
        });
        return;
      }

      try {
        const res = await fetch("/api/changepassword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            oldPassword: values.oldPassword,
            newPassword: values.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.error || "Failed to update password",
          });
          return;
        }

        Swal.fire({
          icon: "success",
          title: "Password Changed!",
          text: "Your password has been updated successfully.",
          timer: 2500,
          showConfirmButton: false,
        });

        resetForm();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: err.message || "Please try again later.",
        });
      }
    },
  });

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white p-6 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-green-400">
        Change Password
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {/* Old Password */}
        <div className="relative">
          <label className="block text-sm mb-2">Old Password</label>
          <input
            type={showOld ? "text" : "password"}
            name="oldPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.oldPassword}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Enter old password"
          />
          <span
            onClick={() => setShowOld(!showOld)}
            className="absolute right-3 top-9 cursor-pointer text-green-400 select-none"
          >
            {showOld ? "👁️" : "🙈"}
          </span>
          {formik.touched.oldPassword && formik.errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.oldPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="block text-sm mb-2">New Password</label>
          <input
            type={showNew ? "text" : "password"}
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Enter new password"
          />
          <span
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-9 cursor-pointer text-green-400 select-none"
          >
            {showNew ? "👁️" : "🙈"}
          </span>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm mb-2">Confirm Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Confirm new password"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-9 cursor-pointer text-green-400 select-none"
          >
            {showConfirm ? "👁️" : "🙈"}
          </span>
          {formik.touched.confirmPassword &&
            formik.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.confirmPassword}
              </p>
            )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold mt-4 transition-all"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
