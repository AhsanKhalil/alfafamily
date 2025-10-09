"use client";

import DriverDashboard from "./DriverDashboard";
import RiderDashboard from "./RiderDashboard";

export default function DashboardPage() {

  const role = "rider"; 

  return (
    <div className="min-h-screen bg-gray-100">
      {role === "driver" ? <DriverDashboard /> : <RiderDashboard />}
    </div>
  );
}