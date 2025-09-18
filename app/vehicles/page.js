"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/vehicles");
        const data = await res.json();
        setVehicles(Array.isArray(data) ? data : []); // ✅ safe handling
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vehicles</h1>
        <Link
          href="/vehicles/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add New Vehicle
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <p className="text-gray-500">No vehicles found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                <th className="px-4 py-2">Picture</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Model</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2">Reg. No</th>
                <th className="px-4 py-2">Seats</th>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {v.picture ? (
                      <img
                        src={v.picture}
                        alt={v.name}
                        className="w-16 h-10 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{v.type}</td>
                  <td className="px-4 py-2">{v.name}</td>
                  <td className="px-4 py-2">{v.model}</td>
                  <td className="px-4 py-2">{v.color}</td>
                  <td className="px-4 py-2">{v.registrationNo}</td>
                  <td className="px-4 py-2">{v.seatCount}</td>
                  <td className="px-4 py-2">
                    {v.companyId?.name || "—"}
                  </td>
                  <td className="px-4 py-2">
                    {v.isActive ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
