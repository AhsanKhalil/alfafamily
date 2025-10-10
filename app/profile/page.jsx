"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, Mail, Phone, Building2, Car, IdCard, Briefcase } from "lucide-react"; // ✅ for icons

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User not logged in");

        const [userRes, infoRes] = await Promise.all([
          fetch(`/api/users/${userId}`),
          fetch(`/api/userinformation/${userId}`)
        ]);

        const userData = await userRes.json();
        const infoData = await infoRes.json();

        if (!userRes.ok) throw new Error(userData.error || "Failed to fetch user");
        if (infoRes.ok) setUserInfo(infoData);
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
  const company = profile.companyId || {};

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white text-gray-800 shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-400 p-6 text-white flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          {userInfo?.profilePic ? (
            <Image
              src={userInfo.profilePic}
              alt="Profile Picture"
              width={150}
              height={150}
              className="rounded-full border-4 border-white shadow-lg object-cover"
            />
          ) : (
            <div className="w-[150px] h-[150px] rounded-full bg-white/30 flex items-center justify-center text-3xl font-semibold">
              {profile.userName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold">{profile.userId || "N/A"}</h2>
          <p className="text-sm text-green-100 mt-1">{role.name || "User Role"}</p>
          <p className="mt-3 flex items-center gap-2"><Building2 size={18} /> {company.name || "Company N/A"}</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Account Info */}
        <section className="bg-gray-50 p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <User size={18} /> Account Info
          </h3>
          <div className="space-y-3 text-sm">
            <Info label="User ID" value={profile.userId} />
            <Info label="Employee ID" value={employee._id} />
            <Info label="Email" value={employee.email || userInfo?.email} />
            <Info label="CNIC" value={employee.cnic} />
            <Info label="Department" value={employee.department} />
            <Info label="Designation" value={employee.designation} />
          </div>
        </section>

        {/* Contact Info */}
        <section className="bg-gray-50 p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <Phone size={18} /> Contact Info
          </h3>
          <div className="space-y-3 text-sm">
            <Info label="Mobile" value={userInfo?.mobileNo1} />
            <Info label="WhatsApp" value={userInfo?.whatsAppNo1} />
            <Info label="Address" value={userInfo?.address1} />
          </div>
        </section>

        {/* Vehicle Info */}
        <section className="bg-gray-50 p-5 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <Car size={18} /> Vehicle Info
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <Info label="Vehicle Name" value={vehicle.name} />
            <Info label="Model" value={vehicle.model} />
            <Info label="Color" value={vehicle.color} />
            <Info label="Registration No" value={vehicle.registrationNo} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-xs uppercase">{label}</p>
      <p className="font-semibold text-gray-800">{value || "N/A"}</p>
    </div>
  );
}
