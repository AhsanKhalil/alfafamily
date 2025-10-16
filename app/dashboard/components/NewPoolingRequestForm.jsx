"use client";

import { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

// ✅ Lazy-load map component (no SSR)
const PoolingMap = dynamic(() => import("./PoolingMap"), { ssr: false });

export default function NewPoolingRequestForm({ onSubmit }) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [poolTime, setPoolTime] = useState(null);
  const [totalSeats, setTotalSeats] = useState(1);
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
        userId:localStorage.getItem("userId")
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
    <>
      {/* ✅ Inline dark theme override for react-datetime */}
      <style jsx global>{`
        .rdtPicker {
          background-color: #1f2937 !important; /* bg-gray-800 */
          color: #e5e7eb !important; /* text-gray-200 */
          border: 1px solid #374151 !important; /* border-gray-700 */
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        }
        .rdtPicker table td,
        .rdtPicker table th {
          color: #e5e7eb !important;
        }
        .rdtPicker .rdtActive,
        .rdtPicker .rdtActive:hover {
          background-color: #10b981 !important; /* green-500 */
          color: #000 !important;
          border-radius: 0.25rem;
        }
        .rdtPicker td:hover,
        .rdtPicker .rdtTimeToggle:hover {
          background-color: #374151 !important; /* hover:bg-gray-700 */
        }
        .rdtTime,
        .rdtCounter {
          background-color: #1f2937 !important;
          color: #e5e7eb !important;
        }
        .rdtBtn {
          color: #10b981 !important;
        }
        .rdtBtn:hover {
          color: #34d399 !important;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl shadow-lg text-white">
        <h3 className="text-lg font-semibold text-green-400 mb-4">Create New Request</h3>

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

        <button
          type="submit"
          className="w-full py-2 bg-green-500 hover:bg-green-600 text-black rounded-lg font-semibold transition"
        >
          Create Request
        </button>
      </form>
    </>
  );
}
