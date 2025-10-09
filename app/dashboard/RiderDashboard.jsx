"use client";

import Image from "next/image";
import {
  FaDollarSign,
  FaCar,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function RiderDashboard() {
  const rating = 4.5;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`inline-block ${
            i <= Math.floor(rating) ? "text-yellow-400" : "text-gray-500"
          }`}
        />
      );
    }
    return stars;
  };

  const pieData = [
    { name: "Completed Rides", value: 120 },
    { name: "Cancelled Rides", value: 30 },
  ];
  const COLORS = ["#4CAF50", "#F44336"];
  const totalRides = pieData.reduce((sum, entry) => sum + entry.value, 0);
  const completedRides = pieData.find((entry) => entry.name === "Completed Rides")?.value || 0;
  const cancelledRides = pieData.find((entry) => entry.name === "Cancelled Rides")?.value || 0;
  const totalBookings = 320;

  const lineData = [
    { day: "Mon", Cost: 4000 },
    { day: "Tue", Cost: 3000 },
    { day: "Wed", Cost: 5000 },
    { day: "Thu", Cost: 4000 },
    { day: "Fri", Cost: 6000 },
  ];

  const areaData = [
    { name: "Completed", rides: 120 },
    { name: "Cancelled", rides: 30 },
    { name: "Pending", rides: 50 },
  ];

  const scatterData = [
    { subject: "Speed", score: 120 },
    { subject: "Safety", score: 100 },
    { subject: "Comfort", score: 110 },
    { subject: "Cleanliness", score: 90 },
  ];

  const composedData = [
    { name: "Week 1", bookings: 30, Cost: 4000 },
    { name: "Week 2", bookings: 50, Cost: 6000 },
    { name: "Week 3", bookings: 40, Cost: 5000 },
    { name: "Week 4", bookings: 60, Cost: 7000 },
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Rider Dashboard</h1>

      {/* Top Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg">Total Cost</h2>
            <p className="text-2xl font-bold">Rs. 12,500</p>
          </div>
          <FaDollarSign className="text-green-400 text-4xl" />
        </div>
        <div className="bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg">Total Bookings</h2>
            <p className="text-2xl font-bold">{totalBookings}</p>
          </div>
          <FaCar className="text-blue-400 text-4xl" />
        </div>
        <div className="bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg">Completed Rides</h2>
            <p className="text-2xl font-bold">{completedRides}</p>
          </div>
          <FaCheckCircle className="text-green-500 text-4xl" />
        </div>
        <div className="bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg">Cancelled Rides</h2>
            <p className="text-2xl font-bold">{cancelledRides}</p>
          </div>
          <FaTimesCircle className="text-red-500 text-4xl" />
        </div>
      </div>

      {/* Main Row: Box 1 + Box 2 */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Box 1: Car Info + Map */}
        <div className="md:w-1/3 bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Car & Driver Location</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gray-700 p-4 rounded-lg w-full flex flex-col items-center">
              <Image
                src="/car.png"
                alt="Car"
                width={250}
                height={150}
                className="rounded-lg mb-4"
              />
              <div className="text-center mb-3">
                <h2 className="text-2xl font-bold">{rating.toFixed(1)}</h2>
                {renderStars()}
              </div>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-gray-700 rounded-lg text-gray-300 text-center">
                  <tbody>
                    <tr className="border-b border-gray-600">
                      <th className="py-2 px-4 font-medium">Car Name</th>
                      <td className="py-2 px-4">Suzuki Alto</td>
                    </tr>
                    <tr className="border-b border-gray-600">
                      <th className="py-2 px-4 font-medium">Driver Name</th>
                      <td className="py-2 px-4">M Rizwan</td>
                    </tr>
                    <tr className="border-b border-gray-600">
                      <th className="py-2 px-4 font-medium">Driver Number</th>
                      <td className="py-2 px-4">0300-1234567</td>
                    </tr>
                    <tr className="border-b border-gray-600">
                      <th className="py-2 px-4 font-medium">Car Type</th>
                      <td className="py-2 px-4">HashBack</td>
                    </tr>
                    <tr className="border-b border-gray-600">
                      <th className="py-2 px-4 font-medium">Total Mileage</th>
                      <td className="py-2 px-4">45,000 km</td>
                    </tr>
                    <tr>
                      <th className="py-2 px-4 font-medium">Seat Capacity</th>
                      <td className="py-2 px-4">4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg overflow-hidden w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.524035545491!2d67.00113617538206!3d24.813899977973468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e9b21a1a7ff%3A0xdecf3e7c6e59c3b2!2sKarachi!5e0!3m2!1sen!2s!4v1696333669017!5m2!1sen!2s"
                width="100%"
                height="200"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Box 2: Charts */}
        <div className="md:w-2/3 bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Performance Charts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Line Chart */}
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <h3 className="mb-2">Cost Trend</h3>
              <LineChart width={450} height={250} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Line type="monotone" dataKey="Cost" stroke="#8884d8" />
              </LineChart>
            </div>

            {/* Area Chart */}
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <h3 className="mb-2">Ride Trends</h3>
              <AreaChart width={450} height={250} data={areaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ReTooltip />
                <Area type="monotone" dataKey="rides" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </div>

            {/* Scatter Chart */}
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <h3 className="mb-2">Performance Metrics</h3>
              <ScatterChart width={450} height={250}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="category" dataKey="subject" name="Metric" />
                <YAxis type="number" dataKey="score" name="Score" />
                <Scatter name="Driver" data={scatterData} fill="#FF6347" />
                <ReTooltip />
                <Legend />
              </ScatterChart>
            </div>

            {/* Composed Chart */}
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <h3 className="mb-2">Bookings vs Cost</h3>
              <ComposedChart width={450} height={250} data={composedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#8884d8" />
                <Line type="monotone" dataKey="Cost" stroke="#FF6347" />
              </ComposedChart>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}