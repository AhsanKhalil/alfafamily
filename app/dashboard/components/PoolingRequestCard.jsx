"use client";

import { Users, Clock, MapPin, CheckCircle, XCircle } from "lucide-react";

export default function PoolingRequestCard({ request, onCancel }) {
  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this pooling request?")) {
      onCancel?.(request._id);
    }
  };

  return (
    <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-md hover:shadow-green-500/20 transition duration-300 ease-in-out transform hover:-translate-y-1">
      {/* ❌ Cancel Button */}
      <button
        onClick={handleCancel}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
        title="Cancel Request"
      >
        <XCircle className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold text-green-400 tracking-wide">
          {request.pickupLocation}{" "}
          <span className="text-gray-400">→</span>{" "}
          {request.dropoffLocation}
        </h3>
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            request.status === "active"
              ? "bg-green-600/20 text-green-400 border border-green-500/40"
              : "bg-gray-700 text-gray-300 border border-gray-600"
          }`}
        >
          {request.status}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-700 mb-4"></div>

      {/* Details */}
      <div className="space-y-2 text-gray-300">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-400" />
          <span className="text-sm">
            <strong className="text-gray-200">Pool Time:</strong>{" "}
            {new Date(request.poolTime).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-green-400" />
          <span className="text-sm">
            <strong className="text-gray-200">Total Seats:</strong>{" "}
            {request.totalSeats}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-green-400 opacity-70" />
          <span className="text-sm">
            <strong className="text-gray-200">Available Seats:</strong>{" "}
            {request.availableSeats}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-green-400" />
          <span>{request.pickupLocation}</span>
        </div>
        <CheckCircle className="w-4 h-4 text-green-400 opacity-70" />
      </div>
    </div>
  );
}
