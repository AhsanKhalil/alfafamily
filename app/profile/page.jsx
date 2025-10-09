"use client";
import { useEffect, useState } from "react";
import Image from "next/image";


export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hardcoded userId for now
        const userId = "68e7c2336b816355b3d89d81";

        // Fetch main user data
        const userRes = await fetch(`/api/users/${userId}`);
        const userData = await userRes.json();

        if (!userRes.ok) throw new Error(userData.error || "Failed to fetch user");

        // Fetch user information (profile pic etc.)
        const infoRes = await fetch(`/api/userinformation/${userId}`);
        const infoData = await infoRes.json();

        if (infoRes.ok) {
          setUserInfo(infoData);
        }

        setProfile(userData);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!profile) return <p className="text-gray-500 text-center mt-10">Loading...</p>;

  const employee = profile.employeeId || {};
  const role = profile.roleId || {};
  const vehicle = profile.vehicleId || {};

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">User Profile</h2>

      {/* Profile Picture */}
      <div className="flex justify-center mb-6">
        {userInfo?.profilePic ? (
          <Image
            src={userInfo.profilePic}
            alt="Profile Picture"
            width={150}
            height={150}
            className="rounded-full border-4 border-green-500 shadow-md object-cover"
          />
        ) : (
          <div className="w-[150px] h-[150px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="grid grid-cols-2 gap-4 text-gray-800">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-semibold">{profile.userName || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">User ID</p>
          <p className="font-semibold">{profile.userId || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="font-semibold">{role.name || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">CNIC</p>
          <p className="font-semibold">{employee.cnic || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-semibold">{employee.email || userInfo?.email || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">WhatsApp</p>
          <p className="font-semibold">{userInfo?.whatsAppNo1 || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Mobile</p>
          <p className="font-semibold">{userInfo?.mobileNo1 || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Vehicle</p>
          <p className="font-semibold">{vehicle.name || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Designation</p>
          <p className="font-semibold">{employee.designation || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Department</p>
          <p className="font-semibold">{employee.department || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
