"use client";

import { useState } from "react";
import { Users, Clock, MapPin, CheckCircle } from "lucide-react";

export default function PassengerRequestAccept({ request, onAccept }) {
  const [isProcessing, setIsProcessing] = useState(false);

  // consider a request accepted if backend status changed to "accepted"
  const accepted =
    request.status === "accepted" ||
    request.status === "confirmed" ||
    Boolean(request.acceptedBy);

  const handleAccept = async () => {
    if (accepted) return;
    if (!confirm("Do you want to accept this ride request?")) return;
    try {
      setIsProcessing(true);
      await onAccept?.(request._id);
      // parent updates the request state — we only handle UI state here.
    } catch (err) {
      console.error("Accept error:", err);
      alert("Failed to accept request. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-md hover:shadow-green-500/20 transition duration-300 ease-in-out transform hover:-translate-y-1">
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

      {/* Divider */}
      <div className="h-px bg-gray-700 my-4"></div>

      {/* Footer with Accept Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4 text-green-400" />
          <span>{request.pickupLocation}</span>
        </div>

        <div>
          <button
            onClick={handleAccept}
            disabled={isProcessing || accepted || request.status !== "active"}
            className={`px-4 py-2 font-semibold rounded-lg transition shadow-md ${
              accepted || request.status !== "active"
                ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-black"
            }`}
          >
            {isProcessing ? "Accepting..." : accepted ? "Accepted ✓" : "Accept Ride"}
          </button>
        </div>
      </div>
    </div>
  );
}
