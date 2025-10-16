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
      const res = await axios.get(`/api/poolingrequests`);
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
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6 tracking-wide">
        Driver Dashboard
      </h2>

      {/* Toggle Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-3 bg-yellow-500 hover:bg-green-600 text-black font-semibold rounded-lg shadow-lg transition duration-300"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {showForm ? "Close Form" : "New Pooling Request"}
        </button>
      </div>

      {/* Show Form */}
      {showForm && <NewPoolingRequestForm onSubmit={fetchRequests} />}

      {/* Pooling Requests Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {requests.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full">
            No pooling requests found.
          </p>
        ) : (
          requests.map((req) => <PoolingRequestCard key={req._id} request={req} />)
        )}
      </div>
    </div>
  );
}
