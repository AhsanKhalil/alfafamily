"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";
import { FaDollarSign, FaCar, FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";
import { LineChart, Line, AreaChart, Area, CartesianGrid, XAxis, YAxis, Legend, Tooltip as ReTooltip } from "recharts";

// dynamic import to avoid SSR issues
const PassengerRequestAccept = dynamic(
  () => import("./components/PassengerRequestAccept"),
  { ssr: false }
);

export default function PassengerDashboard() {
  const [requests, setRequests] = useState([]);
  const rating = 4.5;

  const renderStars = () =>
    [...Array(5)].map((_, i) => (
      <FaStar key={i} className={`inline-block ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-500"}`} />
    ));

  const fetchRequests = async () => {
    try {
      const userId = localStorage.getItem("userId");
      // Fetch all active pooling requests (adjust query as needed)
      const res = await axios.get(`/api/poolingrequests`);
      const data = res.data?.data || res.data || [];

      // Show only active requests that are not created by current user (passenger)
      const available = data.filter((r) => r.status === "active" && String(r.userId) !== String(userId));
      setRequests(available);
    } catch (err) {
      console.error("Error fetching pooling requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      // PATCH — update status to accepted; include acceptedBy if your backend expects it
      await axios.patch(`/api/poolingrequests/${id}`, {
        status: "accepted",
        acceptedBy: userId,
      });

      // Optimistic update: mark the request accepted in UI
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: "accepted", acceptedBy: userId } : r)));
    } catch (err) {
      console.error("Accept failed:", err);
      alert("Could not accept request. Try again.");
    }
  };

  // sample chart data kept simple (same as your earlier dashboard)
  const lineData = [
    { day: "Mon", Cost: 4000 },
    { day: "Tue", Cost: 3000 },
    { day: "Wed", Cost: 5000 },
    { day: "Thu", Cost: 4000 },
    { day: "Fri", Cost: 6000 },
  ];

  const areaData = [
    { name: "Completed", rides: 120 },
    { name: "Cancelled", rides: 30 },
    { name: "Pending", rides: 50 },
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Passenger Dashboard</h1>

      {/* Top Stats (kept simple) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg">Total Cost</h2>
            <p className="text-2xl font-bold">Rs. 12,500</p>
          </div>
          <FaDollarSign className="text-green-400 text-4xl" />
        </div>
        <div className="bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg">Total Bookings</h2>
            <p className="text-2xl font-bold">320</p>
          </div>
          <FaCar className="text-blue-400 text-4xl" />
        </div>
        <div className="bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg">Completed Rides</h2>
            <p className="text-2xl font-bold">120</p>
          </div>
          <FaCheckCircle className="text-green-500 text-4xl" />
        </div>
        <div className="bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg">Cancelled Rides</h2>
            <p className="text-2xl font-bold">30</p>
          </div>
          <FaTimesCircle className="text-red-500 text-4xl" />
        </div>
      </div>

      {/* Car info + charts (kept from your original) */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3 bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Car & Driver Info</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gray-700 p-4 rounded-lg w-full flex flex-col items-center">
              <Image src="/car.png" alt="Car" width={250} height={150} className="rounded-lg mb-4" />
              <div className="text-center mb-3">
                <h2 className="text-2xl font-bold">{rating.toFixed(1)}</h2>
                {renderStars()}
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

        <div className="md:w-2/3 bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Performance Charts</h2>
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
                <Area type="monotone" dataKey="rides" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </div>
          </div>
        </div>
      </div>

      {/* Pooling Requests (Passenger view — accept rides) */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-green-400">Available Pooling Requests</h2>

        {requests.length === 0 ? (
          <p className="text-gray-400">No available pooling requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <PassengerRequestAccept key={req._id} request={req} onAccept={handleAccept} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
