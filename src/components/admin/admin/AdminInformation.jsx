// Shows all admin profiles — view only (as per design)

import React, { useState } from "react";
import { useAdminAuth } from "../../../context/useAdminAuth";

const Field = ({ label, value, className = "", valueClassName = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs text-gray-600">{label}</label>
    <div
      className={`px-3 py-2.5 bg-[#e8f5f3] border border-[#b2dfdb] rounded-lg text-sm text-gray-800 font-medium break-words ${valueClassName}`}
    >
      {value || <span className="text-gray-400">—</span>}
    </div>
  </div>
);

const AdminCard = ({ admin, isActive }) => {
  const initials = admin.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`border-2 rounded-2xl overflow-hidden transition-all ${isActive ? "border-teal-400 shadow-lg" : "border-gray-200"}`}
    >
      {/* Avatar row */}
      <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-200 bg-white">
        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 border-2 border-gray-200">
          <span className="text-gray-600 font-bold text-lg">{initials}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">
            Admin Name: {admin.name}
          </p>
          <p className="text-xs text-gray-500">{admin.role}</p>
          {isActive && (
            <span className="text-[10px] bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">
              Currently logged in
            </span>
          )}
        </div>
      </div>

      {/* Profile details */}
      <div className="p-5 bg-white border border-blue-200 rounded-xl m-3">
        <p className="text-xs font-bold text-gray-600 mb-4">Profile Details</p>

        {/* Row 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-3">
          <Field label="Full Name" value={admin.name} />
          <Field
            label="Email"
            value={admin.email}
            className="sm:col-span-2"
            valueClassName="break-all"
          />
          <Field label="Date of Birth" value={admin.dob} />
          <Field label="WhatsApp no." value={admin.whatsapp} />
          <Field label="Phone Number" value={admin.phone} />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          <Field label="Role" value={admin.role} />
          <Field label="WhatsApp no." value={admin.whatsapp} />
          <Field label="Phone Number" value={admin.phone} />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="Attendance" value={admin.attendance} />
          <Field label="Status" value={admin.status} />
          <Field label="Salary" value={admin.salary} />
        </div>
      </div>

      {/* Back button */}
      <div className="flex justify-end px-5 pb-4">
        <button className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg cursor-pointer transition-colors">
          Back
        </button>
      </div>
    </div>
  );
};

const AdminInformation = () => {
  const { admin, MOCK_ADMINS } = useAdminAuth();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const adminList = MOCK_ADMINS.map((adminItem) => {
    const safeAdmin = { ...adminItem };
    delete safeAdmin.password;
    return safeAdmin;
  });
  const displayed = adminList[selectedIdx];

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-800 mb-2">
        Admin Profile
      </h2>

      {/* Admin switcher tabs */}
      {adminList.length > 1 && (
        <div className="flex gap-2 mb-5">
          {adminList.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setSelectedIdx(i)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-colors cursor-pointer
                ${
                  selectedIdx === i
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
            >
              {a.name.split(" ")[0]}
            </button>
          ))}
        </div>
      )}

      <AdminCard
        admin={displayed}
        isActive={displayed.email === admin?.email}
      />
    </div>
  );
};

export default AdminInformation;
