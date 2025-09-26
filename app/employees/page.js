"use client";
import { useEffect, useState } from "react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [employeeData, setEmployeeData] = useState(null);

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees");
        const data = await res.json();
        console.log("Employees API Response:", data);
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching employees", err);
      }
    };
    fetchEmployees();
  }, []);

  // Update employeeData when selectedId changes
  useEffect(() => {
    if (!selectedId) return;
    const emp = employees.find((e) => e._id === selectedId);
    setEmployeeData(emp || null);
  }, [selectedId, employees]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Employee Lookup</h1>

      {/* Dropdown */}
      <select
        className="border p-2 rounded w-64"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">-- Select Employee --</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.firstName} {emp.lastName} ({emp.companyId?.name || "No Company"})
          </option>
        ))}
      </select>

      {/* Show selected employee details */}
      {employeeData && (
        <div className="mt-6 border rounded p-4 shadow bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Employee Details</h2>
          <p><b>Name:</b> {employeeData.firstName} {employeeData.lastName}</p>
          <p><b>Email:</b> {employeeData.email}</p>
          <p><b>Contact:</b> {employeeData.contactNo}</p>
          <p><b>Designation:</b> {employeeData.designation}</p>
          <p><b>Department:</b> {employeeData.department}</p>
          <p><b>Company:</b> {employeeData.companyId?.name || "N/A"}</p>
          <p><b>Joining Date:</b> {new Date(employeeData.joiningDate).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
