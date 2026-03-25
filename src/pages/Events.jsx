import React, { useState, useEffect, useRef, useCallback } from "react";
import travelHeader from "../assets/images/TravelHeader.png";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAdminEvents } from "../services/adminService";

// ═══════════════════════════════════════════════════════════
// MOCK DATA — Replace with real API calls when backend ready
// ═══════════════════════════════════════════════════════════

// TODO: GET /api/divisions  (Divisions of Bangladesh)
const MOCK_DIVISIONS = [
  { id: 1, name: "Dhaka" },
  { id: 2, name: "Chittagong" },
  { id: 3, name: "Sylhet" },
  { id: 4, name: "Rajshahi" },
  { id: 5, name: "Khulna" },
  { id: 6, name: "Barishal" },
  { id: 7, name: "Mymensingh" },
  { id: 8, name: "Rangpur" },
];

// TODO: GET /api/communities
const MOCK_COMMUNITIES = ["Family", "Male", "Female", "Combined"];

// TODO: GET /api/cities
const MOCK_CITIES = [
  { id: 1, name: "Dhaka" },
  { id: 2, name: "Sreemangal" },
  { id: 3, name: "Cox's Bazar" },
  { id: 4, name: "Sylhet City" },
  { id: 5, name: "Bandarban" },
  { id: 6, name: "Rangamati" },
  { id: 7, name: "Khagrachhari" },
  { id: 8, name: "Sundarbans" },
  { id: 9, name: "Sajek" },
  { id: 10, name: "Kuakata" },
  { id: 11, name: "Maheshkhali" },
  { id: 12, name: "Ratargul" },
];



const PRICE_MIN = 0;
const PRICE_MAX = 25000;
const EVENTS_PER_PAGE = 6;

const MONTH_INDEX = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const parseEventDate = (dateText) => {
  if (!dateText) return null;
  const [dayText, monthText] = dateText.split(" ");
  const day = Number(dayText);
  const month = MONTH_INDEX[monthText];
  if (!Number.isFinite(day) || month === undefined) return null;
  return new Date(new Date().getFullYear(), month, day);
};

const isSelectedDateWithinEventRange = (selectedDate, fromText, toText) => {
  const from = parseEventDate(fromText);
  const to = parseEventDate(toText);
  if (!from || !to) return false;
  return selectedDate >= from && selectedDate <= to;
};

// ═══════════════════════════════════════════════════════════
// PRICE RANGE SLIDER
// ═══════════════════════════════════════════════════════════
const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const rangeRef = useRef(null);
  const [dragging, setDragging] = useState(null); // 'left' | 'right' | null

  const getPercent = (val) => ((val - min) / (max - min)) * 100;

  const leftPct = getPercent(value[0]);
  const rightPct = getPercent(value[1]);

  const handleTrackClick = (e) => {
    if (!rangeRef.current) return;
    const rect = rangeRef.current.getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const clicked = Math.round(pct * (max - min) + min);
    const distLeft = Math.abs(clicked - value[0]);
    const distRight = Math.abs(clicked - value[1]);
    if (distLeft <= distRight) {
      onChange([Math.min(clicked, value[1] - 500), value[1]]);
    } else {
      onChange([value[0], Math.max(clicked, value[0] + 500)]);
    }
  };

  const startDrag = (side) => (e) => {
    e.preventDefault();
    setDragging(side);
  };

  const onMouseMove = useCallback(
    (e) => {
      if (!dragging || !rangeRef.current) return;
      const rect = rangeRef.current.getBoundingClientRect();
      const clientX =
        (e.touches && e.touches.length ? e.touches[0].clientX : null) ??
        (e.changedTouches && e.changedTouches.length
          ? e.changedTouches[0].clientX
          : null) ??
        e.clientX;
      const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const val = Math.round(pct * (max - min) + min);
      if (dragging === "left")
        onChange([Math.min(val, value[1] - 500), value[1]]);
      if (dragging === "right")
        onChange([value[0], Math.max(val, value[0] + 500)]);
    },
    [dragging, max, min, onChange, value],
  );

  const stopDrag = useCallback(() => setDragging(null), []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", stopDrag);
      window.addEventListener("touchmove", onMouseMove);
      window.addEventListener("touchend", stopDrag);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [dragging, onMouseMove, stopDrag]);

  const fmt = (v) => v.toLocaleString("en-BD");

  return (
    <div className="px-1">
      {/* Value badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
          <span className="text-[10px] opacity-80">BDT</span>
          {fmt(value[0])}
        </div>
        <div className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
          <span className="text-[10px] opacity-80">BDT</span>
          {fmt(value[1])}
        </div>
      </div>

      {/* Slider track */}
      <div
        ref={rangeRef}
        className="relative h-1.5 bg-gray-200 rounded-full cursor-pointer mx-2"
        onClick={handleTrackClick}
      >
        {/* Active range fill */}
        <div
          className="absolute h-full bg-red-500 rounded-full"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />

        {/* Left thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-red-500 rounded-full shadow cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          style={{ left: `${leftPct}%` }}
          onMouseDown={startDrag("left")}
          onTouchStart={startDrag("left")}
        />

        {/* Right thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-red-500 rounded-full shadow cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          style={{ left: `${rightPct}%` }}
          onMouseDown={startDrag("right")}
          onTouchStart={startDrag("right")}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between mt-3 text-[10px] text-gray-400">
        <span>{fmt(min)}</span>
        <span>{fmt(Math.round((max - min) * 0.33 + min))}</span>
        <span>{fmt(Math.round((max - min) * 0.66 + min))}</span>
        <span>{fmt(max)}</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// STAR RATING
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// EVENT CARD — Figma design
// ═══════════════════════════════════════════════════════════
const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const openDetails = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    // Outer teal border card — exactly like Figma screenshot
    <div
      className="bg-[#0F393E] cursor-pointer rounded-[1.35rem] p-2 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-3xl sm:p-[12px]"
      role="button"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetails();
        }
      }}
      aria-label={`Open details for ${event.title}`}
    >
      <div className="overflow-hidden rounded-[18px] bg-white sm:rounded-[22px]">
      {/* ── IMAGE SECTION ── */}
      <div className="relative m-2.5 h-28 overflow-hidden rounded-xl bg-gradient-to-br from-teal-100 to-cyan-200 sm:m-3 sm:h-52 sm:rounded-2xl">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />

        {/* Rating badge — white pill top-right, yellow star + number */}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-xl bg-white px-2 py-1 shadow-md sm:right-3 sm:top-3 sm:px-2.5">
          {/* Lucide Star icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#ECC62D"
            stroke="#ECC62D"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="text-gray-900 font-bold text-xs">
            {event.rating}
          </span>
        </div>
      </div>
       {/* ── CARD BODY ── */}
      <div className="px-3 pb-3 pt-1.5 sm:px-4 sm:pb-4 sm:pt-2">
        {/* Location — two lines: city bold, sublocation smaller */}
        <div className="mb-2.5 flex items-start gap-1.5 sm:mb-3 sm:gap-2">
          {/* Lucide MapPin icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div>
            <p className="text-sm font-bold leading-tight text-gray-900 sm:text-lg">
              {event.location}
            </p>
            {event.sublocation && (
              <p className="text-[11px] leading-tight text-gray-700 sm:text-base">
                {event.sublocation}
              </p>
            )}
          </div>
        </div>

        {/* Date + Spots row */}
        <div className="mb-2.5 flex flex-col gap-1.5 sm:mb-3 sm:flex-row sm:items-center sm:gap-6">
          {/* Lucide CalendarDays */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
            </svg>
            <span className="text-[11px] font-medium text-gray-700 sm:text-sm">
              {event.dateFrom} - {event.dateTo}
            </span>
          </div>

          {/* Lucide Users */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="text-[11px] font-medium text-gray-700 sm:text-sm">
              {event.spotsLeft} left
            </span>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="my-2 border-t-2 border-dashed border-gray-200 sm:my-3" />

        {/* BDT Price — large, exactly like Figma */}
        <p className="text-xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          <span className="font-bold">BDT </span>
          {event.price.toLocaleString("en-BD")}
        </p>
      </div>
      </div>
    </div>
  );
};
const DivisionSummaryCard = ({ divisions, onRemove }) => {
  if (!divisions.length) return null;
  return (
    <div className="mb-5 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-teal-100">
      <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider mb-2">
        Selected Divisions
      </p>
      <div className="flex flex-wrap gap-2">
        {divisions.map((d) => (
          <span
            key={d}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-full"
          >
            📍 {d}
            <button
              onClick={() => onRemove(d)}
              className="hover:text-red-200 transition-colors font-bold ml-0.5"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};


const Events = () => {
  return (
    <div className="relative bg-[#edfffd] min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-teal-700 font-bold text-xl">Events page coming soon...</p>
      </div>
    </div>
  );
};
 
export default Events;