"use client";
import { useEffect, useState } from "react";

export default function UserActivityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get userId from localStorage (same as change password)
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // Fetch user activity logs
    fetch(`/api/useractivity?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching activity logs:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-white text-center mt-10">Loading activity logs...</p>;

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-green-400 mb-6 text-center">
        User Activity Logs
      </h1>

      {logs.length === 0 ? (
        <p className="text-gray-400 text-center">No activity found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700 rounded-lg">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">Event</th>
                <th className="px-4 py-2 text-left">Details</th>
                <th className="px-4 py-2 text-left">IP Address</th>
                <th className="px-4 py-2 text-left">Device</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const date = new Date(log.datetime);
                const formattedDate = date.toLocaleDateString();
                const formattedTime = date.toLocaleTimeString();

                return (
                  <tr key={log._id} className="border-t border-gray-700 hover:bg-gray-800">
                    <td className="px-4 py-2">{log.eventPerformed}</td>
                    <td className="px-4 py-2">{log.activityDetail}</td>
                    <td className="px-4 py-2">{log.ipAddress || "N/A"}</td>
                    <td className="px-4 py-2">{log.deviceInfo || "N/A"}</td>
                    <td className="px-4 py-2">{formattedDate}</td>
                    <td className="px-4 py-2">{formattedTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
