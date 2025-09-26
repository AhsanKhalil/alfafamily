"use client";
import { useState, useEffect } from "react";

export default function CreateVehicle() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    type: "",
    name: "",
    model: "",
    color: "",
    registrationNo: "",
    seatCount: "",
    picture: "",
    companyId: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await fetch("/api/companies");
      const data = await res.json();
      setCompanies(data);
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert("Vehicle registered successfully!");
      setForm({
        type: "",
        name: "",
        model: "",
        color: "",
        registrationNo: "",
        seatCount: "",
        picture: "",
        companyId: "",
        isActive: true,
      });
    } else {
      alert("Error registering vehicle");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-gray-50 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        🚗 Add Vehicle
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Fill in the details below to register a new vehicle.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Type
          </label>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="e.g. Car, Bus, Van"
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Toyota Corolla"
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="e.g. 2020"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            name="color"
            value={form.color}
            onChange={handleChange}
            placeholder="e.g. White"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Registration No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration No
          </label>
          <input
            name="registrationNo"
            value={form.registrationNo}
            onChange={handleChange}
            placeholder="e.g. ABC-1234"
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Seat Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seat Count
          </label>
          <input
            type="number"
            name="seatCount"
            value={form.seatCount}
            onChange={handleChange}
            placeholder="e.g. 4"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Picture URL
          </label>
          <input
            name="picture"
            value={form.picture}
            onChange={handleChange}
            placeholder="https://example.com/car.jpg"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <select
            name="companyId"
            value={form.companyId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Active Checkbox */}
        <label className="flex items-center space-x-2 text-gray-700">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span>Is Active</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Vehicle
        </button>
      </form>
    </div>
  );
}
