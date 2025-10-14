"use client";
import { useEffect, useState } from "react";

import DashboardHeader from "@/components/DashboardHeader";


export default function changepasswordLayout({ children }) {
  return (
    <div className="bg-black text-white min-h-screen">
      <DashboardHeader username="Ahsan" />
      <main className="p-6">{children}</main>
    </div>
  );
}
