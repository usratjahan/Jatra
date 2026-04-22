import React, { useEffect, useState, useCallback } from "react";
import { getAdminEvents, deleteEvent } from "../../../services/adminService";
import EventForm from "./EventForm";

const COMMUNITIES = ["Family", "Male", "Female", "Combined"];
const EVENT_IMAGE_FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="240"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" text-anchor="middle" dy=".35em" fill="%236b7280" font-family="Arial, sans-serif" font-size="20">No Image</text></svg>';

const EventCard = ({ event, onEdit, onDelete }) => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    {/* Image */}
    <div className="relative">
      <img
        src={event.image || event.images?.[0] || EVENT_IMAGE_FALLBACK}
        alt={event.title}
        className="w-full h-36 object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = EVENT_IMAGE_FALLBACK;
        }}
      />
      {/* Rating badge */}
      <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 flex items-center gap-1 text-xs font-bold text-amber-500">
        ⭐ {event.avgRating ?? event.rating ?? "5.0"}
      </div>
      {/* Action icons */}
      <div className="absolute top-2 left-2 flex gap-1.5">
        <button
          onClick={() => onEdit(event)}
          className="w-7 h-7 bg-white/90 hover:bg-blue-50 rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="w-7 h-7 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>

    {/* Info */}
    <div className="p-3">
      <div className="flex items-start gap-1.5 mb-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0d9488"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 mt-0.5"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <div>
          <p className="text-xs font-bold text-gray-800 leading-tight">
            {event.location}
          </p>
          <p className="text-[10px] text-gray-500">{event.sublocation}</p>
        </div>
      </div>

      {/* Community badge */}
      <span
        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2
        ${
          event.community === "Family"
            ? "bg-purple-100 text-purple-700"
            : event.community === "Male"
              ? "bg-blue-100 text-blue-700"
              : event.community === "Female"
                ? "bg-pink-100 text-pink-700"
                : "bg-teal-100 text-teal-700"
        }`}
      >
        {event.community}
      </span>

      <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2">
        <span className="flex items-center gap-1">
          📅 {event.dateFrom} – {event.dateTo}
        </span>
        <span className="flex items-center gap-1">
          👥 {event.spotsLeft} left
        </span>
      </div>

      <div className="border-t border-dashed border-gray-200 pt-2">
        <p className="text-sm font-extrabold text-gray-900">
          BDT {Number(event.price).toLocaleString("en-BD")}
        </p>
      </div>
    </div>
  </div>
);

const EventDetailsInformation = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null); // null = new, object = edit
  const [filterCommunity, setFilterCommunity] = useState("All");

  const load = useCallback(async (withSpinner = true) => {
    if (withSpinner) setLoading(true);
    const data = await getAdminEvents();
    setEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      const data = await getAdminEvents();
      if (!active) return;
      setEvents(data);
      setLoading(false);
    };
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    await deleteEvent(id);
    load();
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditEvent(null);
    setFormOpen(true);
  };

  const filtered =
    filterCommunity === "All"
      ? events
      : events.filter((e) => e.community === filterCommunity);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold text-gray-800">
          Event Details Information
        </h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
        >
          + Add New
        </button>
      </div>

      {/* Community filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {["All", ...COMMUNITIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilterCommunity(c)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer
              ${
                filterCommunity === c
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <svg
            className="w-7 h-7 animate-spin text-teal-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-2">📭</p>
          <p>No events found. Click + Add New to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Event Form modal */}
      {formOpen && (
        <EventForm
          event={editEvent}
          onClose={() => {
            setFormOpen(false);
            setEditEvent(null);
          }}
          onSaved={() => {
            setFormOpen(false);
            setEditEvent(null);
            load();
          }}
        />
      )}
    </div>
  );
};

export default EventDetailsInformation;
