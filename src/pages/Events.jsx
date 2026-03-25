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


//═══════════════════════════════════════════════════════════
// EVENTS PAGE
// ═══════════════════════════════════════════════════════════
const Events = () => {
  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [showAllCities, setShowAllCities] = useState(false);

  // Divisions (replaces old location dropdown)
  const [selectedDivisions, setSelectedDivisions] = useState([]);

  // Price range
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);

  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Initial fetch ──
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // TODO: const res = await fetch('/api/events'); const data = await res.json(); setEvents(data); setFiltered(data);
        const raw = await getAdminEvents();
        const mapped = raw.map((e) => ({
          id: e.id,
          title: e.title,
          location: e.location,
          sublocation: e.sublocation,
          price: e.price,
          dateFrom: e.dateFrom,
          dateTo: e.dateTo,
          spotsLeft: e.spotsLeft,
          rating: e.rating ?? e.avgRating ?? 5.0,
          image: e.image,
          community: e.community,
          division: e.division,
        }));
        setEvents(mapped);
        setFiltered(mapped);
      } catch (err) {
        console.error("Fetch events failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Division helpers ──
    const toggleDivision = (name) =>
      setSelectedDivisions((p) =>
        p.includes(name) ? p.filter((d) => d !== name) : [...p, name],
      );
  
    const toggleCommunity = (name) =>
      setSelectedCommunities((p) =>
        p.includes(name) ? p.filter((c) => c !== name) : [...p, name],
      );
  
    const removeDivision = (name) =>
      setSelectedDivisions((p) => p.filter((d) => d !== name));
  
    // ── City helpers ──
    const filteredCities = MOCK_CITIES.filter((c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()),
    );
    const visibleCities = showAllCities
      ? filteredCities
      : filteredCities.slice(0, 6);
    const toggleCity = (name) =>
      setSelectedCities((p) =>
        p.includes(name) ? p.filter((c) => c !== name) : [...p, name],
      );
  
    const runAllFilters = useCallback(
      (sourceEvents) => {
        let result = [...sourceEvents];
  
        if (selectedDivisions.length > 0) {
          result = result.filter((e) => selectedDivisions.includes(e.division));
        }
  
        if (selectedCommunities.length > 0) {
          result = result.filter((e) =>
            selectedCommunities.includes(e.community),
          );
        }
  
        if (date) {
          const selectedDate = new Date(date);
          result = result.filter((e) =>
            isSelectedDateWithinEventRange(selectedDate, e.dateFrom, e.dateTo),
          );
        }
  
        if (travelers > 1) {
          result = result.filter((e) => e.spotsLeft >= travelers);
        }
  
        if (selectedCities.length > 0) {
          result = result.filter((e) =>
            selectedCities.some((city) => {
              const cityName = city.toLowerCase();
              const location = e.location?.toLowerCase() ?? "";
              const sublocation = e.sublocation?.toLowerCase() ?? "";
              return (
                location.includes(cityName) ||
                sublocation.includes(cityName) ||
                cityName.includes(location) ||
                cityName.includes(sublocation)
              );
            }),
          );
        }
  
        result = result.filter(
          (e) => e.price >= priceRange[0] && e.price <= priceRange[1],
        );
  
        return result;
      },
      [
        selectedDivisions,
        selectedCommunities,
        date,
        travelers,
        selectedCities,
        priceRange,
      ],
    );
  
    // ── Apply filters ──
    const applyFilters = () => {
      // Kept for manual button trigger, while filters also auto-update below.
      setFiltered(runAllFilters(events));
      setCurrentPage(1);
    };
  
    useEffect(() => {
      setFiltered(runAllFilters(events));
      setCurrentPage(1);
    }, [events, runAllFilters]);
  
    // ── Reset ──
    const resetFilters = () => {
      setSelectedDivisions([]);
      setSelectedCommunities([]);
      setDate("");
      setTravelers(2);
      setCitySearch("");
      setSelectedCities([]);
      setPriceRange([PRICE_MIN, PRICE_MAX]);
      setCurrentPage(1);
    };
  
    const hasActiveFilters =
      selectedDivisions.length > 0 ||
      selectedCommunities.length > 0 ||
      Boolean(date) ||
      travelers > 1 ||
      selectedCities.length > 0 ||
      priceRange[0] > PRICE_MIN ||
      priceRange[1] < PRICE_MAX;
  
    const totalPages = Math.max(1, Math.ceil(filtered.length / EVENTS_PER_PAGE));
    const paginatedEvents = filtered.slice(
      (currentPage - 1) * EVENTS_PER_PAGE,
      currentPage * EVENTS_PER_PAGE,
    );
  
    useEffect(() => {
      setCurrentPage((prev) => Math.min(prev, totalPages));
    }, [totalPages]);
  
    const inputCls =
      "w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors";
    const labelCls =
      "block text-teal-700 font-semibold text-xs uppercase tracking-wider mb-1.5 px-1";
  

return (
    <div className="relative bg-[#edfffd] min-h-screen pt-24 pb-16 overflow-hidden">
      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" />
        <div className="absolute inset-0 opacity-[0.12]" />
        {/* <div className="absolute top-20 left-10 w-72 h-72 bg-teal-300/20 rounded-full blur-3xl"/>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"/> */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10 text-center">
          {/* <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-2">
            Discover & Book
          </p> */}
          {/* <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">
            Explore Events
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Find the perfect travel experience across Bangladesh
          </p> */}
          {/* Travel sticker image — below the heading text */}
          <div className="flex justify-center">
            <img
              src={travelHeader}
              alt="Travel"
              className="max-w-[1200px] h-auto object-contain drop-shadow-md"
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
         
          {/* ════════════════════════════
              LEFT SIDEBAR
          ════════════════════════════ */}

          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 bg-[#cee2e5] backdrop-blur-md rounded-3xl shadow-lg overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-teal-500 to-emerald-400" />
              <div className="p-5 space-y-5">

                {/* Header */}

                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                      />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-800">Filter Events</span>
                </div>

                 {/* ── PRICE RANGE FILTER ── */}
                
                <div>
                  <label className={labelCls}>Filter Price (BDT)</label>
                  <div className="bg-white border border-gray-200 rounded-2xl p-4">
                    <PriceRangeSlider
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      value={priceRange}
                      onChange={setPriceRange}
                    />
                  </div>
                </div>
                </div>
                </aside>

                <div className="flex-1 min-w-0">
            <p className="text-teal-700 font-bold">
              {loading ? "Loading..." : `${filtered.length} events`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
 
export default Events;