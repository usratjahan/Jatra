import React, { useState } from "react";
import {
  addAdditionalTraveler,
  removeAdditionalTraveler,
} from "../../../services/adminService";

const EMPTY = () => ({
  fullName: "",
  email: "",
  address: "",
  phone: "",
  nidNo: "",
  birthRegistrationNo: "",
});

const TCell = ({ children, className = "" }) => (
  <td className={`px-3 py-2 text-xs text-gray-700 ${className}`}>{children}</td>
);
const THead = ({ children }) => (
  <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wide text-left bg-gray-50">
    {children}
  </th>
);

const AdditionalTravelerPanel = ({ booking, onClose, onRefresh }) => {
  const [travelers, setTravelers] = useState(booking.additionalTravelers || []);
  const [addingNew, setAddingNew] = useState(false);
  const [form, setForm] = useState(EMPTY());
  const [saving, setSaving] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleAdd = async () => {
    if (!form.fullName) return;
    setSaving(true);
    await addAdditionalTraveler(booking.id, form);
    const updated = [...travelers, { ...form, id: Date.now() }];
    setTravelers(updated);
    setForm(EMPTY());
    setAddingNew(false);
    setSaving(false);
    onRefresh();
  };

  const handleRemove = async (tId) => {
    if (!confirm("Remove this traveler?")) return;
    await removeAdditionalTraveler(booking.id, tId);
    setTravelers((prev) => prev.filter((t) => t.id !== tId));
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h3 className="font-bold text-gray-900">Additional Traveler</h3>
            <p className="text-xs text-gray-500">
              Booking: {booking.eventName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <THead>ID</THead>
                <THead>Full Name</THead>
                <THead>Email</THead>
                <THead>Address</THead>
                <THead>Phone</THead>
                <THead>NID No.</THead>
                <THead>Birth Reg No.</THead>
                <THead>Action</THead>
              </tr>
            </thead>
            <tbody>
              {travelers.length === 0 && !addingNew ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-gray-400 text-xs py-8"
                  >
                    No additional travelers yet.
                  </td>
                </tr>
              ) : (
                travelers.map((t, i) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <TCell className="font-mono font-bold text-gray-500">
                      {String(i + 1).padStart(4, "0")}
                    </TCell>
                    <TCell className="font-semibold">{t.fullName}</TCell>
                    <TCell>{t.email}</TCell>
                    <TCell>{t.address}</TCell>
                    <TCell>{t.phone}</TCell>
                    <TCell>{t.nidNo}</TCell>
                    <TCell>{t.birthRegistrationNo || "—"}</TCell>
                    <TCell>
                      <button
                        onClick={() => handleRemove(t.id)}
                        className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-600 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    </TCell>
                  </tr>
                ))
              )}

              {/* Add new row */}
              {addingNew && (
                <tr className="border-b border-teal-200 bg-teal-50/50">
                  {[
                    "fullName",
                    "email",
                    "address",
                    "phone",
                    "nidNo",
                    "birthRegistrationNo",
                  ].map((field) => (
                    <td key={field} className="px-2 py-2">
                      <input
                        type="text"
                        value={form[field]}
                        onChange={set(field)}
                        placeholder={
                          field === "birthRegistrationNo" ? "Birth Reg." : field
                        }
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:border-teal-400 focus:outline-none bg-white"
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2">
                    {/* empty — action buttons in footer */}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer"
          >
            Back
          </button>
          {addingNew ? (
            <>
              <button
                onClick={() => {
                  setAddingNew(false);
                  setForm(EMPTY());
                }}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="px-4 py-1.5 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-xs font-bold rounded-lg cursor-pointer disabled:opacity-60"
              >
                {saving ? "Saving…" : "Add"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setAddingNew(true)}
              className="px-4 py-1.5 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-xs font-bold rounded-lg cursor-pointer"
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalTravelerPanel;
