"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const DriverDashboard = dynamic(() => import("./DriverDashboard"), { ssr: false });
const RiderDashboard = dynamic(() => import("./RiderDashboard"), { ssr: false });

export default function DashboardPage() {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

        // 🔴 If no userId, redirect to root path
        if (!userId) {
          router.push("/");
          return;
        }

        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();

        if (res.ok && data.roleId?.name) {
          setRole(data.roleId.name.toLowerCase());
        }
      } catch (err) {
        console.error("Error fetching role:", err);
      }
    }

    fetchUserRole();
  }, [router]);

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {role === "driver" ? <DriverDashboard /> : <RiderDashboard />}
    </div>
  );
}
