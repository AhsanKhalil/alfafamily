"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

// ✅ Dynamically import form (avoids SSR errors)
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-400">Driver Dashboard</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded-lg transition"
        >
          {showForm ? "Close Form" : "New Pooling Request"}
        </button>
      </div>

      {showForm && <NewPoolingRequestForm onSubmit={fetchRequests} />}

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
