"use client";

export default function PoolingRequestCard({ request }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="font-bold text-lg text-green-400">
        {request.pickupLocation} → {request.dropoffLocation}
      </h3>
      <p>Pool Time: {new Date(request.poolTime).toLocaleString()}</p>
      <p>Total Seats: {request.totalSeats}</p>
      <p>Available Seats: {request.availableSeats}</p>
      <p>Status: {request.status}</p>
    </div>
  );
}
