"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  FaDollarSign,
  FaCar,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip as ReTooltip,
} from "recharts";

// Dynamic import to avoid SSR issues
const PassengerRequestAccept = dynamic(
  () => import("./components/PassengerRequestAccept"),
  { ssr: false }
);

export default function PassengerDashboard() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
  });

  const rating = 4.5;

  const renderStars = () =>
    [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`inline-block ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-500"
        }`}
      />
    ));

  // ✅ Fetch all pooling requests (no userId)
  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/poolingrequests`);
      const data = await response.json();

      if (!data.success) throw new Error(data.error || "Failed to fetch");

      const total = data.count || 0;
      const completed = data.data.filter((r) => r.status === "active").length;
      const cancelled = data.data.filter((r) => r.status === "cancelled").length;

      setRequests(data.data);
      setStats({ total, completed, cancelled });
    } catch (err) {
      console.error("Error fetching pooling requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Accept pooling request
  const handleAccept = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }

      const response = await fetch(`/api/poolingrequests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "accepted",
          riderId: userId,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Ride accepted successfully!");
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "accepted" } : r))
        );
      } else {
        alert(result.message || "Could not accept ride.");
      }
    } catch (err) {
      console.error("Accept failed:", err);
      alert("Could not accept the request. Try again.");
    }
  };

  // ✅ Cancel pooling request
  const handleCancel = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }

      const response = await fetch(`/api/poolingrequests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "cancelled",
          riderId: userId,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Ride cancelled successfully!");
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "cancelled" } : r))
        );
      } else {
        alert(result.message || "Could not cancel ride.");
      }
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Could not cancel the ride. Try again.");
    }
  };

  // Dummy chart data
  const lineData = [
    { day: "Mon", Cost: 1000 },
    { day: "Tue", Cost: 500 },
    { day: "Wed", Cost: 1000 },
    { day: "Thu", Cost: 250 },
    { day: "Fri", Cost: 1000 },
  ];

  const areaData = [
    { name: "Completed", rides: stats.completed },
    { name: "Cancelled", rides: stats.cancelled },
    { name: "Pending", rides: stats.total - stats.completed - stats.cancelled },
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
        Passenger Dashboard
      </h2>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
     <div className="bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
  <div>
    <h2 className="text-lg">Total Cost</h2>
    <p className="text-2xl font-bold">
      Rs. {stats.total ? stats.total * 1000 : 0}
    </p>
  </div>
  <FaDollarSign className="text-green-400 text-4xl" />
</div>

<div className="bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
  <div>
    <h2 className="text-lg">Total Bookings</h2>
    <p className="text-2xl font-bold">{stats.total}</p>
  </div>
  <FaCar className="text-blue-400 text-4xl" />
</div>

        <div className="bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg">Completed Rides</h2>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </div>
          <FaCheckCircle className="text-green-500 text-4xl" />
        </div>

        <div className="bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg">Cancelled Rides</h2>
            <p className="text-2xl font-bold">{stats.cancelled}</p>
          </div>
          <FaTimesCircle className="text-red-500 text-4xl" />
        </div>
      </div>

      {/* Car Info + Charts */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Car Info */}
        <div className="md:w-1/3 bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Car & Driver Info
          </h2>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gray-700 p-4 rounded-lg w-full flex flex-col items-center">
             <FaCar className="text-blue-400 text-7xl mb-3 drop-shadow-lg" />

  {/* Rating Section */}
  <div className="text-center mb-3">
    <h2 className="text-3xl font-extrabold text-white">{rating.toFixed(1)}</h2>
    <div className="flex justify-center mt-2 space-x-1 text-2xl">
      {renderStars()}
    </div>
  </div>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-gray-700 rounded-lg text-gray-300 text-center">
                  <tbody>
                    <tr className="border-b border-gray-600">
                      <th className="py-2 px-4 font-medium">Car Name</th>
                      <td className="py-2 px-4">Suzuki Alto</td>
                    </tr>
                    <tr className="border-b border-gray-600">
                      <th className="py-2 px-4 font-medium">Driver Name</th>
                      <td className="py-2 px-4">M Rizwan</td>
                    </tr>
                    <tr>
                      <th className="py-2 px-4 font-medium">Seats</th>
                      <td className="py-2 px-4">4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="md:w-2/3 bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Performance Charts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <h3 className="mb-2">Cost Trend</h3>
              <LineChart width={450} height={250} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Line type="monotone" dataKey="Cost" stroke="#8884d8" />
              </LineChart>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <h3 className="mb-2">Ride Trends</h3>
              <AreaChart width={450} height={250} data={areaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ReTooltip />
                <Area
                  type="monotone"
                  dataKey="rides"
                  stroke="#f80000ff"
                  fill="#ff3e03ff"
                />
              </AreaChart>
            </div>
          </div>
        </div>
      </div>

      {/* Pooling Requests */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-green-400">
          Available Pooling Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-gray-400">No available pooling requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <PassengerRequestAccept
                key={req._id}
                request={req}
                onAccept={handleAccept}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
