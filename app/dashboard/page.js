"use client";
import Image from "next/image";

export default function DashboardPage() {
  const role = "rider"; // or "rider" from login session

  return (
    <section className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* LEFT SIDE - IMAGE */}
      <div className="flex justify-center">
        <Image
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
          alt="Dashboard visual"
          width={500}
          height={500}
          className="rounded-2xl shadow-lg"
        />
      </div>

      {/* RIGHT SIDE - Dashboard Info */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-green-400">
          Welcome, {role === "driver" ? "Driver" : "Rider"}!
        </h1>
        <p className="mt-6 text-lg text-gray-300">
          This is your dashboard. Here you can manage your rides, see requests, and track your activities.
        </p>

        {role === "driver" ? (
          <ul className="mt-6 space-y-2 text-gray-300">
            <li>🚗 View assigned rides</li>
            <li>📅 Manage your availability</li>
            <li>💵 Track earnings</li>
          </ul>
        ) : (
          <ul className="mt-6 space-y-2 text-gray-300">
            <li>🛴 Request rides</li>
            <li>📅 Track your schedule</li>
            <li>💳 See ride costs</li>
          </ul>
        )}
      </div>
    </section>
  );
}
