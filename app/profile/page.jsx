"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  User,
  Phone,
  Building2,
  Car,
  Pencil,
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User not logged in");

        const [userRes, infoRes] = await Promise.all([
          fetch(`/api/users/${userId}`),
          fetch(`/api/userinformation/${userId}`),
        ]);

        const userData = await userRes.json();
        const infoData = await infoRes.json();

        if (!userRes.ok)
          throw new Error(userData.error || "Failed to fetch user");
        if (infoRes.ok) setUserInfo(infoData);

        setProfile(userData);
        setFormData({
            empid: userData.employeeId?.empid || "", 
          cnic: userData.employeeId?.cnic || "",
          department: userData.employeeId?.department || "",
          designation: userData.employeeId?.designation || "",
          email: infoData.email || "",
          mobileNo1: infoData.mobileNo1 || "",
          whatsAppNo1: infoData.whatsAppNo1 || "",
          address1: infoData.address1 || "",
          vehicleName: userData.vehicleId?.name || "",
          vehicleModel: userData.vehicleId?.model || "",
          vehicleColor: userData.vehicleId?.color || "",
          registrationNo: userData.vehicleId?.registrationNo || "",
          profilePic: infoData.profilePic || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  if (error)
    return <p className="text-red-400 text-center mt-10">{error}</p>;
  if (!profile)
    return <p className="text-gray-400 text-center mt-10">Loading...</p>;

  const role = profile.roleId || {};
  const company = profile.companyId || {};

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData({ ...formData, profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Save updates
  const handleSave = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch("/api/updateprofile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData }),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your information has been updated successfully.",
          background: "#1f2937",
          color: "#fff",
          confirmButtonColor: "#10b981",
        });
        setEditing(false);
      } else {
        Swal.fire("Error", data.error || "Update failed!", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-gray-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-800">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-400 p-6 text-white flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Image
                src={preview || formData.profilePic || "/default-avatar.png"}
                alt="Profile Picture"
                width={150}
                height={150}
                className="rounded-full border-4 border-white shadow-lg object-cover"
              />
              {editing && (
                <label className="absolute bottom-2 right-2 bg-white text-black rounded-full p-2 cursor-pointer hover:bg-gray-200">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Pencil size={16} />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{profile.userId || "N/A"}</h2>
              <p className="text-sm text-green-100 mt-1">{role.name || "User Role"}</p>
              <p className="mt-3 flex items-center gap-2 text-gray-100">
                <Building2 size={18} /> {company.name || "Company N/A"}
              </p>

            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
          >
            <Pencil size={18} /> {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Details Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111827]">
          {/* Account Info */}
          <Section title="Account Info" icon={<User size={18} />}>
            <Editable label="Employee ID" name="empid" value={formData.empid} editable={false} /> 

            <Editable label="CNIC" name="cnic" value={formData.cnic} editable={editing} onChange={handleChange} />
            <Editable label="Department" name="department" value={formData.department} editable={editing} onChange={handleChange} />
            <Editable label="Designation" name="designation" value={formData.designation} editable={editing} onChange={handleChange} />
          </Section>

          {/* Contact Info */}
          <Section title="Contact Info" icon={<Phone size={18} />}>
            <Editable label="Email" name="email" value={formData.email} editable={editing} onChange={handleChange} />
            <Editable label="Mobile" name="mobileNo1" value={formData.mobileNo1} editable={editing} onChange={handleChange} />
            <Editable label="WhatsApp" name="whatsAppNo1" value={formData.whatsAppNo1} editable={editing} onChange={handleChange} />
            <Editable label="Address" name="address1" value={formData.address1} editable={editing} onChange={handleChange} />
          </Section>

          {/* Vehicle Info */}
          {role?.name?.toLowerCase() === "driver" && (

          <Section title="Vehicle Info" icon={<Car size={18} />} full>
            <Editable label="Vehicle Name" name="vehicleName" value={formData.vehicleName} editable={editing} onChange={handleChange} />
            <Editable label="Model" name="vehicleModel" value={formData.vehicleModel} editable={editing} onChange={handleChange} />
            <Editable label="Color" name="vehicleColor" value={formData.vehicleColor} editable={editing} onChange={handleChange} />
            <Editable label="Registration No" name="registrationNo" value={formData.registrationNo} editable={editing} onChange={handleChange} />
          </Section>
          )}
          {editing && (
            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children, full }) {
  return (
    <section
      className={`bg-gray-800 p-5 rounded-2xl shadow-md border border-gray-700 ${
        full ? "md:col-span-2" : ""
      }`}
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-400">
        {icon} {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">{children}</div>
    </section>
  );
}

function Editable({ label, name, value, editable, onChange }) {
  return (
    <div>
      <p className="text-gray-400 text-xs uppercase mb-1">{label}</p>
      {editable ? (
        <input
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-green-500"
        />
      ) : (
        <p className="font-semibold text-gray-100">{value || "N/A"}</p>
      )}
    </div>
  );
}
