"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { FiEye, FiEyeOff } from "react-icons/fi"; // 👈 Import eye icons

export default function RegisterDriver() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    empid: "",
    cnic: "",
  });

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roleId] = useState("68e79c68e60358a66e60d165"); // Driver Role ID fixed

  const [vehicle, setVehicle] = useState({
    type: "",
    name: "",
    model: "",
    color: "",
    registrationNo: "",
    seatCount: "",
  });

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  // ✅ Validation Schema
  const validationSchema = Yup.object().shape({
    userId: Yup.string().required("User ID is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[@$!%*?&#]/, "Must contain at least one special character"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // ✅ Fetch Employees
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const empRes = await fetch("/api/employees");
        const empData = await empRes.json();
        setEmployees(Array.isArray(empData) ? empData : []);
      } catch (err) {
        console.error("Error loading employees:", err);
      }
    }
    fetchEmployees();
  }, []);

  // ✅ Handle employee select
  const handleEmployeeSelect = (id) => {
    setEmployeeId(id);
    if (!id) {
      setEmployeeData({
        firstName: "",
        lastName: "",
        email: "",
        contactNo: "",
        empid: "",
        cnic: "",
      });
      return;
    }

    const emp = employees.find((e) => e._id === id);
    if (emp) {
      setEmployeeData({
        firstName: emp.firstName || "",
        lastName: emp.lastName || "",
        email: emp.email || "",
        contactNo: emp.contactNo || "",
        empid: emp.empid || "",
        cnic: emp.cnic || "",
      });
    }
  };

  // ✅ Check if User Exists (employeeId + userId)
  const checkUserExists = async (empId, userId) => {
    if (!empId || !userId) return false;
    try {
      const res = await fetch(`/api/users/check?employeeId=${empId}&userId=${userId}`);
      const data = await res.json();
      return data.exists;
    } catch {
      return false;
    }
  };

  // ✅ Vehicle input change
  const handleVehicleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  // ✅ Continue Button → OTP Modal
  const handleContinue = async (e) => {
    e.preventDefault();

    if (!employeeId) {
      Swal.fire("Error", "Please select an employee.", "error");
      return;
    }

    try {
      await validationSchema.validate({ userId, password, confirmPassword }, { abortEarly: false });
    } catch (err) {
      Swal.fire("Validation Error", err.errors.join("<br>"), "error");
      return;
    }

    const exists = await checkUserExists(employeeId, userId);
    if (exists) {
      Swal.fire("Error", "User ID already exists for this employee.", "error");
      return;
    }

    const maskedEmail =
      employeeData.email?.replace(/^(.{3})(.*)(@.*)$/, (_, a, b, c) =>
        a + "*".repeat(b.length) + c
      ) || "your email";

    Swal.fire(
      "OTP Sent",
      `OTP has been sent to your registered email address: <b>${maskedEmail}</b>`,
      "info"
    );

    setShowOTPModal(true);
  };

  // ✅ Submit after OTP Verification
  const handleOTPSubmit = async () => {
    if (otp !== "1234") {
      Swal.fire("Invalid OTP", "Please try again!", "error");
      return;
    }

    try {
      const res = await fetch("/api/register-driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          employeeData,
          vehicle,
          userId,
          userName: employeeData.firstName + " " + employeeData.lastName,
          password,
          roleId,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire("Success", "Driver registered successfully!", "success");
        router.push("/login");
      } else {
        Swal.fire("Error", result.error || "Failed to save driver data.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl bg-gray-900 rounded-2xl shadow-2xl p-10 space-y-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4 text-center">
          🚗 Register as Driver
        </h1>

        <form onSubmit={handleContinue} className="space-y-6">
          {/* Employee Dropdown */}
          <div>
            <label className="block text-yellow-400 mb-2 font-semibold">
              Select Employee
            </label>
            <select
              value={employeeId}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400 focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName} ({emp.empid})
                </option>
              ))}
            </select>
          </div>

          {/* Employee Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={employeeData.firstName} readOnly placeholder="First Name" className="px-4 py-3 rounded-lg bg-gray-800 text-gray-300 border border-green-400" />
            <input type="text" value={employeeData.lastName} readOnly placeholder="Last Name" className="px-4 py-3 rounded-lg bg-gray-800 text-gray-300 border border-green-400" />
            <input type="text" value={employeeData.email} readOnly placeholder="Email" className="px-4 py-3 rounded-lg bg-gray-800 text-gray-300 border border-green-400" />
            <input type="text" value={employeeData.contactNo} readOnly placeholder="Contact No" className="px-4 py-3 rounded-lg bg-gray-800 text-gray-300 border border-green-400" />
            <input type="text" value={employeeData.cnic} readOnly placeholder="CNIC" className="px-4 py-3 rounded-lg bg-gray-800 text-gray-300 border border-green-400" />
          </div>

          {/* User ID & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID"
              className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400"
              required
            />

            {/* Password Field with Icon */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400 w-full pr-10"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-green-400"
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </span>
            </div>

            {/* Confirm Password Field with Icon */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400 w-full pr-10"
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 cursor-pointer text-green-400"
              >
                {showConfirmPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </span>
            </div>
          </div>

          {/* Vehicle Details */}
          <h2 className="text-2xl font-semibold text-green-400 mt-6">
            Vehicle Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <select
              name="type"
              value={vehicle.type}
              onChange={handleVehicleChange}
              className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400"
            >
              <option value="">Select Vehicle Type</option>
              {["Car","Bike","Van","Rikshaw","Bus","Pickup","Jeep","ElectricCar"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input name="name" value={vehicle.name} onChange={handleVehicleChange} placeholder="Vehicle Name" className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400" />
            <select
              name="model"
              value={vehicle.model}
              onChange={handleVehicleChange}
              className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400"
            >
              <option value="">Select Model</option>
              {Array.from({ length: 36 }, (_, i) => 1990 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              name="seatCount"
              value={vehicle.seatCount}
              onChange={handleVehicleChange}
              className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400"
            >
              <option value="">Select Seat Count</option>
              {[1, 2, 3, 4].map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
            <select
              name="color"
              value={vehicle.color}
              onChange={handleVehicleChange}
              className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400"
            >
              <option value="">Select Color</option>
              {["White","Black","Silver","Blue","Red","Green","Yellow","Gray","Brown","Orange","Purple"].map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            <input name="registrationNo" value={vehicle.registrationNo} onChange={handleVehicleChange} placeholder="Registration No" className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400" />
          </div>

          {/* Continue Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-10 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-black font-bold shadow-lg transition-all"
            >
              Continue →
            </button>
          </div>
        </form>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-96 text-center">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 4-digit OTP"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400 mb-4"
            />
            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleOTPSubmit}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg"
              >
                Verify & Save
              </button>
              <button
                onClick={() => setShowOTPModal(false)}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
