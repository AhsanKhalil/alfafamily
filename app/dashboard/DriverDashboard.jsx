"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

// ✅ Dynamically import components
const NewPoolingRequestForm = dynamic(() => import("./components/NewPoolingRequestForm"), {
  ssr: false,
});

const PoolingRequestCard = dynamic(() => import("./components/PoolingRequestCard"), {
  ssr: false,
});

export default function DriverDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`/api/poolingrequests?userId=${userId}`);
      setRequests(res.data.data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      {/* Centered Page Title */}
      <h2 className="text-2xl font-bold text-green-400 text-center mb-6">
        Driver Dashboard
      </h2>

      {/* New Pooling Request Button - Left-aligned, visible text, with icon */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-300"
        >
          {/* Plus Icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>

          {/* Always visible text */}
          {showForm ? "Close Form" : "New Pooling Request"}
        </button>
      </div>

      {/* Show Form */}
      {showForm && <NewPoolingRequestForm onSubmit={fetchRequests} />}

      {/* Pooling Requests Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {requests.length === 0 ? (
          <p className="text-gray-400">No pooling requests found.</p>
        ) : (
          requests.map((req) => <PoolingRequestCard key={req._id} request={req} />)
        )}
      </div>
    </div>
  );
}
