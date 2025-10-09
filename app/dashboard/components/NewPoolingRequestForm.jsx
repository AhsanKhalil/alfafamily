"use client";

import { useState } from "react";
import axios from "axios";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import PoolingMap from "./PoolingMap";

export default function NewPoolingRequestForm({ onSubmit }) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [poolTime, setPoolTime] = useState(null);
  const [totalSeats, setTotalSeats] = useState(1);
  const [showMapFor, setShowMapFor] = useState(null); // "pickup" | "dropoff"

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickup || !dropoff || !poolTime) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      const userId = localStorage.getItem("userId"); // your userId from login
      const body = {
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        poolTime,
        totalSeats,
        availableSeats: totalSeats,
      };

      // Create pooling request
      const res = await axios.post("/api/poolingrequests", body);
      if (res.data.success) {
        alert("Pooling request created successfully!");
        onSubmit(); // notify parent to refresh
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
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-lg shadow-lg text-white"
    >
      <h3 className="text-xl font-bold text-green-400 mb-4">New Pooling Request</h3>

      <div className="mb-4">
        <label className="block mb-1">Pickup Location</label>
        <input
          type="text"
          value={pickup}
          readOnly
          onClick={() => setShowMapFor("pickup")}
          placeholder="Click to select pickup location"
          className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Dropoff Location</label>
        <input
          type="text"
          value={dropoff}
          readOnly
          onClick={() => setShowMapFor("dropoff")}
          placeholder="Click to select dropoff location"
          className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {showMapFor && (
        <PoolingMap
          key={showMapFor}
          onSelectLocation={(address) => {
            if (showMapFor === "pickup") setPickup(address);
            else if (showMapFor === "dropoff") setDropoff(address);
            setShowMapFor(null); // close map
          }}
        />
      )}

      <div className="mb-4">
        <label className="block mb-1">Pool Time</label>
        <Datetime
          value={poolTime}
          onChange={(date) => setPoolTime(date)}
          inputProps={{
            className:
              "w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-white",
          }}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Total Seats</label>
        <select
          value={totalSeats}
          onChange={(e) => setTotalSeats(parseInt(e.target.value))}
          className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
        >
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-black font-semibold transition"
      >
        Create Request
      </button>
    </form>
  );
}
