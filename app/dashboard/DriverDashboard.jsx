"use client";

import { useState, useEffect } from "react";
import NewPoolingRequestForm from "./components/NewPoolingRequestForm";
import PoolingRequestCard  from "./components/PoolingRequestCard";
import axios from "axios";

export default function DriverDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const userId = localStorage.getItem("userId"); // assuming you store userId
      const res = await axios.get(`/api/poolingrequests?userId=${userId}`);
      setRequests(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchRequests(); // refresh after submit
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-400">Driver Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-lg transition"
        >
          New Pooling Request
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <NewPoolingRequestForm onSubmit={handleFormSubmit} />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Your Pooling Requests</h2>
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-white">No requests found.</p>
        ) : (
          requests.map((req) => <PoolingRequestCard  key={req._id} request={req} />)
        )}
      </div>
    </div>
  );
}
