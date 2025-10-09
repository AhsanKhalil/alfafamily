"use client";

import { useEffect, useState } from "react";
import DriverDashboard from "./DriverDashboard";
import RiderDashboard from "./RiderDashboard";

export default function DashboardPage() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        // Get userId from localStorage (set at login)
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        // Fetch user info from API
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();

        console.log(res);

        if (res.ok) {
          setRole(data.roleId?.name?.toLowerCase()); // e.g., "driver" or "rider"
        } else {
          console.error("Failed to fetch user role:", data.error);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchUserRole();
  }, []);

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading dashboard...
      </div>
    );
  }
console.log(role);
  return (
    <div className="min-h-screen bg-gray-100">
      {role === "driver" ? <DriverDashboard /> : <RiderDashboard />}
    </div>
  );
}
