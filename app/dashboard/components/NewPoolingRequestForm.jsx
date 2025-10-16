"use client";

import { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const PoolingMap = dynamic(() => import("./PoolingMap"), { ssr: false });

export default function NewPoolingRequestForm({ onSubmit }) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [poolTime, setPoolTime] = useState(null);
  const [totalSeats, setTotalSeats] = useState(1);
  const [cost] = useState(1000); // ✅ Fixed cost
  const [showMapFor, setShowMapFor] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickup || !dropoff || !poolTime) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      const body = {
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        poolTime,
        totalSeats,
        availableSeats: totalSeats,
        userId: localStorage.getItem("userId"),
        Cost: cost, // ✅ Added cost field
      };

      const res = await axios.post("/api/poolingrequests", body);
      if (res.data.success) {
        alert("Pooling request created successfully!");
        onSubmit();
        setPickup("");
        setDropoff("");
        setPoolTime(null);
        setTotalSeats(1);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create pooling request.");
    }
  };

  return (
    <div className="flex justify-center mt-10 mb-10">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 w-full max-w-md p-6 rounded-2xl shadow-2xl text-white border border-gray-800"
      >
        <h3 className="text-2xl font-semibold text-green-400 mb-6 text-center">
          Create New Request
        </h3>

        {/* Pickup */}
        <div className="mb-4">
          <input
            type="text"
            value={pickup}
            readOnly
            onClick={() => setShowMapFor("pickup")}
            placeholder="Click to select pickup location"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Dropoff */}
        <div className="mb-4">
          <input
            type="text"
            value={dropoff}
            readOnly
            onClick={() => setShowMapFor("dropoff")}
            placeholder="Click to select dropoff location"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500"
          />
        </div>

        {showMapFor && (
          <PoolingMap
            key={showMapFor}
            onSelectLocation={(address) => {
              if (showMapFor === "pickup") setPickup(address);
              else setDropoff(address);
              setShowMapFor(null);
            }}
          />
        )}

        {/* Date & Time */}
        <div className="mb-4">
          <Datetime
            value={poolTime}
            onChange={(date) => setPoolTime(date)}
            inputProps={{
              placeholder: "Select pool time",
              className:
                "w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 text-white",
            }}
          />
        </div>

        {/* Total Seats */}
        <div className="mb-4">
          <select
            value={totalSeats}
            onChange={(e) => setTotalSeats(parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 text-white"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Cost (Disabled) */}
        <div className="mb-6">
          <input
            type="number"
            value={cost}
            disabled
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-300 cursor-not-allowed"
          />
          <p className="text-sm text-gray-400 mt-1 text-center">
            Fixed cost (Rs. 1000)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-green-500 hover:bg-green-600 text-black rounded-lg font-semibold transition"
        >
          Create Request
        </button>
      </form>
    </div>
  );
}
