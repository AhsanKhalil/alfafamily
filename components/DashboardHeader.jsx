"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DashboardHeader() {
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);

    if (userId) {
      fetchNotifications();
      const interval = setInterval(fetchUnreadCountOnly, 10000); // ⏱ Poll every 10s
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/api/notifications?userId=${userId}`);
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const fetchUnreadCountOnly = async () => {
    try {
      const res = await axios.get(`/api/notifications?userId=${userId}`);
      if (res.data.success) {
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  const handleNotificationClick = async () => {
    const willShow = !showPopup;
    setShowPopup(willShow);

    if (willShow) {
      try {
        const res = await axios.get(`/api/notifications?userId=${userId}`);
        if (res.data.success) {
          setNotifications(res.data.notifications);
          setUnreadCount(0);
        }

        // Mark unread as read
        await axios.patch(`/api/notifications?userId=${userId}`);
      } catch (err) {
        console.error("Error marking as read", err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="bg-black text-white py-4 px-6 flex justify-between items-center shadow-md">
      {/* Logo */}
     <Link href="/dashboard" className="flex items-center font-bold text-4xl ml-6 cursor-pointer select-none">
  <span className="text-white-400">Al</span>
  <span className="text-yellow-400">family</span>
</Link>


      {/* Search */}
      <div className="flex-1 mx-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-lg text-black"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4 relative">
        {/* 🔔 Notification */}
        <button onClick={handleNotificationClick} className="relative">
          🔔
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white px-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Popup */}
        {showPopup && (
          <div className="absolute right-20 top-10 bg-white text-black w-80 shadow-lg rounded-lg z-50 p-4">
            <h4 className="font-semibold text-lg mb-2 text-green-600">Notifications</h4>
            <ul>
              {notifications.length === 0 ? (
                <li className="text-gray-500">No notifications</li>
              ) : (
                notifications.map((notif) => (
                  <li
                    key={notif._id}
                    className={`mb-2 p-2 rounded ${
                      notif.Unread ? "bg-gray-200 font-semibold text-black" : "text-gray-700"
                    }`}
                  >
                    {notif.Detail}
                    <br />
                    <span className="text-xs text-gray-500">
                      {new Date(notif.CreatedOn).toLocaleString()}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* User menu */}
        <div className="relative group">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <span>{username || "User"}</span>
            ▼
          </button>

          <ul className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-40">
            <Link href="/profile" className="block px-4 py-2 hover:bg-gray-700 cursor-pointer">
              Profile
            </Link>
            <Link href="/changepassword" className="block px-4 py-2 hover:bg-gray-700 cursor-pointer">
              Change Password
            </Link>
            <Link href="/useractivity" className="block px-4 py-2 hover:text-green-400">
              User Activity
            </Link>
            <li
              onClick={handleLogout}
              className="block px-4 py-2 hover:bg-gray-700 cursor-pointer text-green-400"
            >
              Logout
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
