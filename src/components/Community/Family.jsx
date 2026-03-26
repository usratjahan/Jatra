import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import travelHeader from "../../assets/images/FamilyHeader.png";
import { getAdminEvents } from "../../services/adminService";

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

const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const rangeRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const getPercent = (val) => ((val - min) / (max - min)) * 100;
  const leftPct = getPercent(value[0]);
  const rightPct = getPercent(value[1]);
  const handleTrackClick = (e) => {
    if (!rangeRef.current) return;
    const rect = rangeRef.current.getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const clicked = Math.round(pct * (max - min) + min);
    Math.abs(clicked - value[0]) <= Math.abs(clicked - value[1])
      ? onChange([Math.min(clicked, value[1] - 500), value[1]])
      : onChange([value[0], Math.max(clicked, value[0] + 500)]);
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
        (e.touches?.length ? e.touches[0].clientX : null) ??
        (e.changedTouches?.length ? e.changedTouches[0].clientX : null) ??
        e.clientX;
      const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const val = Math.round(pct * (max - min) + min);
      dragging === "left"
        ? onChange([Math.min(val, value[1] - 500), value[1]])
        : onChange([value[0], Math.max(val, value[0] + 500)]);
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
      <div
        ref={rangeRef}
        className="relative h-1.5 bg-gray-200 rounded-full cursor-pointer mx-2"
        onClick={handleTrackClick}
      >
        <div
          className="absolute h-full bg-red-500 rounded-full"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-red-500 rounded-full shadow cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          style={{ left: `${leftPct}%` }}
          onMouseDown={startDrag("left")}
          onTouchStart={startDrag("left")}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-red-500 rounded-full shadow cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          style={{ left: `${rightPct}%` }}
          onMouseDown={startDrag("right")}
          onTouchStart={startDrag("right")}
        />
      </div>
      <div className="flex justify-between mt-3 text-[10px] text-gray-400">
        <span>{fmt(min)}</span>
        <span>{fmt(Math.round((max - min) * 0.33 + min))}</span>
        <span>{fmt(Math.round((max - min) * 0.66 + min))}</span>
        <span>{fmt(max)}</span>
      </div>
    </div>
  );
};
const Family = () => {
  return (
    <div className="relative bg-[#edfffd] min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-teal-700 font-bold text-xl">Family community page...</p>
      </div>
    </div>
  );
};
 
export default Family;