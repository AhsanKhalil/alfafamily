"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    axios
      .get("/api/companies")
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Companies</h1>
        <Link href="/companies/new">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Company
          </button>
        </Link>
      </div>

      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Contact</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Website</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.CompanyId} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{c.name}</td>
              <td className="px-4 py-2 border">{c.contactNo}</td>
              <td className="px-4 py-2 border">{c.email}</td>
              <td className="px-4 py-2 border">{c.website || "-"}</td>
              <td className="px-4 py-2 border">
                {c.isActive ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactive</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
