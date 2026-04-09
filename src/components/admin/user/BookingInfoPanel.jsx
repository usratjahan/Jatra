import React, { useState } from "react";
import {
  updateBooking,
  deleteBooking,
  addBooking,
} from "../../../services/adminService";
import AdditionalTravelerPanel from "./AdditionalTravelerPanel";

const Input = ({ label, value, onChange, readOnly, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`px-2.5 py-1.5 text-xs border rounded-lg transition-colors
        ${readOnly ? "bg-gray-50 text-gray-500 border-gray-200" : "bg-white border-gray-300 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-300"}`}
    />
  </div>
);

const STATUS_OPTIONS = ["Confirmed", "Cancelled", "Pending", "Completed"];

const BookingRow = ({ booking, onRefresh }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...booking });
  const [showTravelers, setShowTravelers] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await updateBooking(booking.id, form);
    setSaving(false);
    setEditing(false);
    onRefresh();
  };

  const handleDelete = async () => {
    if (!confirm("Remove this booking?")) return;
    await deleteBooking(booking.id);
    onRefresh();
  };

  return (
    <>
      {/* Booking row */}
      <div className="border border-gray-200 rounded-xl p-3 mb-3 bg-gray-50">
        {/* Event image + basic info */}
        <div className="flex items-start gap-3">
          <div className="w-14 h-10 rounded-lg bg-teal-100 overflow-hidden flex-shrink-0">
            <img
              src={booking.image || "/assets/images/tour/style1/pic1.jpg"}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                <Input
                  label="Event Name"
                  value={form.eventName}
                  onChange={set("eventName")}
                />
                <Input
                  label="Location"
                  value={form.location}
                  onChange={set("location")}
                />
                <Input label="Days" value={form.days} onChange={set("days")} />
                <Input
                  label="Price (BDT)"
                  value={form.totalAmount}
                  onChange={set("totalAmount")}
                  type="number"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={set("status")}
                    className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:border-teal-400 focus:outline-none bg-white"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Members"
                  value={form.members}
                  onChange={set("members")}
                  type="number"
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-4 gap-y-1 text-xs mb-2">
                <div>
                  <span className="text-gray-400">Event</span>
                  <p className="font-semibold text-gray-800 truncate">
                    {booking.eventName}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Location</span>
                  <p className="font-semibold text-gray-800">
                    {booking.location}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Days</span>
                  <p className="font-semibold text-gray-800">{booking.days}</p>
                </div>
                <div>
                  <span className="text-gray-400">Price</span>
                  <p className="font-semibold text-gray-800">
                    BDT {Number(booking.totalAmount).toLocaleString("en-BD")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Status</span>
                  <p
                    className={`font-bold text-xs ${booking.status === "Confirmed" ? "text-green-600" : booking.status === "Cancelled" ? "text-red-500" : "text-amber-500"}`}
                  >
                    {booking.status}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Members</span>
                  <p className="font-semibold text-gray-800">
                    {booking.members}
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowTravelers(true)}
                className="px-3 py-1 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Additional Traveler
              </button>

              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setForm({ ...booking });
                    }}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Travelers panel */}
      {showTravelers && (
        <AdditionalTravelerPanel
          booking={booking}
          onClose={() => setShowTravelers(false)}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};

// ── Main Panel ─────────────────────────────────────────────────
const BookingInfoPanel = ({ user, bookings, onClose, onRefresh }) => {
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState({
    eventName: "",
    location: "",
    days: "",
    totalAmount: "",
    members: 1,
    status: "Confirmed",
  });

  const setNew = (f) => (e) =>
    setNewForm((p) => ({ ...p, [f]: e.target.value }));

  const handleAdd = async () => {
    if (!newForm.eventName) return;
    await addBooking({
      ...newForm,
      userId: user.id,
      additionalTravelers: [],
      primaryTraveler: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });
    setAddingNew(false);
    setNewForm({
      eventName: "",
      location: "",
      days: "",
      totalAmount: "",
      members: 1,
      status: "Confirmed",
    });
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h3 className="font-bold text-gray-900">Booking Information</h3>
            <p className="text-xs text-gray-500">
              {user.fullName} — {bookings.length} booking(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer transition-colors"
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

        {/* Column headers */}
        <div className="grid grid-cols-6 gap-2 px-5 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wide flex-shrink-0">
          <span className="col-span-2">Event Name</span>
          <span>Location</span>
          <span>Days</span>
          <span>Price</span>
          <span>Status / Members</span>
        </div>

        {/* Bookings list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
          {bookings.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              No bookings yet.
            </p>
          ) : (
            bookings.map((b) => (
              <BookingRow key={b.id} booking={b} onRefresh={onRefresh} />
            ))
          )}

          {/* Add new booking form */}
          {addingNew && (
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 bg-teal-50">
              <p className="text-xs font-bold text-teal-700 mb-3">
                New Booking
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                <Input
                  label="Event Name*"
                  value={newForm.eventName}
                  onChange={setNew("eventName")}
                />
                <Input
                  label="Location"
                  value={newForm.location}
                  onChange={setNew("location")}
                />
                <Input
                  label="Days"
                  value={newForm.days}
                  onChange={setNew("days")}
                />
                <Input
                  label="Price BDT"
                  value={newForm.totalAmount}
                  onChange={setNew("totalAmount")}
                  type="number"
                />
                <Input
                  label="Members"
                  value={newForm.members}
                  onChange={setNew("members")}
                  type="number"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase">
                    Status
                  </label>
                  <select
                    value={newForm.status}
                    onChange={setNew("status")}
                    className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:border-teal-400 focus:outline-none bg-white"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="px-4 py-1.5 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => setAddingNew(false)}
                  className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setAddingNew(true)}
            className="px-4 py-1.5 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-xs font-bold rounded-lg cursor-pointer transition-colors"
          >
            + Add More
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingInfoPanel;
