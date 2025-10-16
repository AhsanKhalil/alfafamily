"use client";

import { useState } from "react";
import { Users, Clock, MapPin } from "lucide-react";

export default function PassengerRequestAccept({ request, onAccept, onCancel }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Check if this user has already accepted the ride
  const alreadyAccepted = request.acceptedMembers?.some(
    (m) => String(m.userId) === String(userId) && m.status === "accepted"
  );

  const isCancelled = request.acceptedMembers?.some(
    (m) => String(m.userId) === String(userId) && m.status === "cancelled"
  );

  // Disable accept if no seats left or already accepted
  const disableAccept = alreadyAccepted || request.availableSeats <= 0 || request.status !== "active";

  const handleAccept = async () => {
    if (disableAccept) return;
    if (!confirm("Do you want to accept this ride request?")) return;

    try {
      setIsProcessing(true);
      await onAccept?.(request._id);
    } catch (err) {
      console.error("Accept error:", err);
      alert("Failed to accept request. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Do you want to cancel your participation in this ride?")) return;
    try {
      setIsProcessing(true);
      await onCancel?.(request._id);
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel ride. Try again.");
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
              : request.status === "cancelled"
              ? "bg-red-600/20 text-red-400 border border-red-500/40"
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

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4 text-green-400" />
          <span>{request.pickupLocation}</span>
        </div>

        <div className="flex gap-2">
          {!alreadyAccepted && request.status === "active" && (
            <button
              onClick={handleAccept}
              disabled={isProcessing || disableAccept}
              className={`px-4 py-2 font-semibold rounded-lg transition shadow-md ${
                disableAccept
                  ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-black"
              }`}
            >
              {isProcessing ? "Accepting..." : "Accept Ride"}
            </button>
          )}

          {alreadyAccepted && (
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="px-4 py-2 font-semibold rounded-lg transition shadow-md bg-red-500 hover:bg-red-600 text-black"
            >
              {isProcessing ? "Cancelling..." : "Cancel Ride"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
