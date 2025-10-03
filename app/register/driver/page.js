"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterDriver() {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    empid: "",
  });

  const [userId, setUserId] = useState(""); // username input
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState(""); // will store ObjectId of Driver role

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

  // Fetch employees and roles
  useEffect(() => {
    async function fetchData() {
      try {
        const empRes = await fetch("/api/employees");
        const roleRes = await fetch("/api/roles");
        const empData = await empRes.json();
        const roleData = await roleRes.json();

        setEmployees(Array.isArray(empData) ? empData : []);
        setRoles(Array.isArray(roleData) ? roleData : []);

        // Auto-select Driver role
        const driverRole = roleData.find(r => r.name === "Driver");
        if (driverRole) {
          setRoleId(driverRole._id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  // Handle employee select
  const handleEmployeeSelect = (id) => {
    setEmployeeId(id);
    const emp = employees.find((e) => e._id === id);
    if (emp) {
      setEmployeeData({
        firstName: emp.firstName || "",
        lastName: emp.lastName || "",
        email: emp.email || "",
        contactNo: emp.contactNo || "",
        empid: emp.empid || "",
      });
    }
  };

  // Vehicle input change
  const handleVehicleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  // Continue button → show OTP modal
  const handleContinue = (e) => {
    e.preventDefault();
    if (!userId || !password || !confirmPassword) {
      alert("Please fill UserID and Password fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Password and Confirm Password do not match!");
      return;
    }
    setShowOTPModal(true);
  };

  // Handle OTP submit + save
  const handleOTPSubmit = async () => {
    if (otp !== "1234") {
      alert("Invalid OTP. Try again!");
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
        alert(result.message || "Driver registered successfully!");
        router.push("/login");
      } else {
        alert(result.error || "Failed to save driver data.");
      }
    } catch (err) {
      console.error("Error saving driver:", err);
    }
  };

  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl bg-gray-900 rounded-2xl shadow-2xl p-10 space-y-6">
        <h1 className="text-3xl font-bold text-green-400 mb-4 text-center">
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
              required
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
            <input type="text" value={employeeData.firstName} readOnly className="px-4 py-3 rounded-lg bg-gray-800 text-gray-300 border border-green-400" placeholder="First Name" />
            <input type="text" value={employeeData.lastName} readOnly className="px-4 py-3 rounded-lg bg-gray-800 text-gray-300 border border-green-400" placeholder="Last Name" />
            <input type="text" value={employeeData.email} readOnly className="px-4 py-3 rounded-lg bg-gray-800 text-gray-300 border border-green-400" placeholder="Email" />
            <input type="text" value={employeeData.contactNo} readOnly className="px-4 py-3 rounded-lg bg-gray-800 text-gray-300 border border-green-400" placeholder="Contact No" />
          </div>

          {/* UserID & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input type="text" value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID (username)" className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400" required />
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400" required />
          </div>

          {/* Vehicle Details */}
          <h2 className="text-2xl font-semibold text-green-400 mt-6">Vehicle Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {["type", "name", "model", "color", "registrationNo", "seatCount"].map((field) => (
              <input
                key={field}
                type={field === "seatCount" ? "number" : "text"}
                name={field}
                value={vehicle[field]}
                onChange={handleVehicleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400 focus:ring-2 focus:ring-green-500"
              />
            ))}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center mt-6">
            <button type="submit" className="px-10 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-black font-bold shadow-lg transition-all">
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
            <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 4-digit OTP" className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-green-400 focus:ring-2 focus:ring-green-500 mb-4" />
            <div className="flex space-x-4 justify-center">
              <button onClick={handleOTPSubmit} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg">Verify & Save</button>
              <button onClick={() => setShowOTPModal(false)} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
