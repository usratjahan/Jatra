import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import travelHeader from "../../assets/images/MaleHeader.png";
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

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const openDetails = () => {
    navigate(`/events/${event.id}`);
  };

  return (
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
      <div className="relative m-2.5 h-28 overflow-hidden rounded-xl bg-gradient-to-br from-teal-100 to-cyan-200 sm:m-3 sm:h-52 sm:rounded-2xl">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-xl bg-white px-2 py-1 shadow-md sm:right-3 sm:top-3 sm:px-2.5">
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
      <div className="px-3 pb-3 pt-1.5 sm:px-4 sm:pb-4 sm:pt-2">
        <div className="mb-2.5 flex items-start gap-1.5 sm:mb-3 sm:gap-2">
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
        <div className="mb-2.5 flex flex-col gap-1.5 sm:mb-3 sm:flex-row sm:items-center sm:gap-6">
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
        <div className="my-2 border-t-2 border-dashed border-gray-200 sm:my-3" />
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

const Male = () => {
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [showAllCities, setShowAllCities] = useState(false);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // TODO: const res = await fetch('/api/events/male'); const data = await res.json();
        // NOTE: Backend filters WHERE community = 'Male'
        // setEvents(data); setFiltered(data);
        const raw = await getAdminEvents();
        const mapped = raw
          .filter((e) => e.community === "Male")
          .map((e) => ({
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
            division: e.division,
          }));
        setEvents(mapped);
        setFiltered(mapped);
      } catch {
        setEvents([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleDivision = (name) =>
    setSelectedDivisions((p) =>
      p.includes(name) ? p.filter((d) => d !== name) : [...p, name],
    );
  const removeDivision = (name) =>
    setSelectedDivisions((p) => p.filter((d) => d !== name));
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
    [selectedDivisions, date, travelers, selectedCities, priceRange],
  );

  const applyFilters = () => {
    setFiltered(runAllFilters(events));
    setCurrentPage(1);
  };

  useEffect(() => {
    setFiltered(runAllFilters(events));
    setCurrentPage(1);
  }, [events, runAllFilters]);

  const resetFilters = () => {
    setSelectedDivisions([]);
    setDate("");
    setTravelers(2);
    setCitySearch("");
    setSelectedCities([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedDivisions.length > 0 ||
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          {/* <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-2">
            Discover & Book
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">
            Male Community
          </h1> */}
          {/* <p className="text-gray-500 text-base max-w-md mx-auto">
            Adventure-focused travel experiences for male explorers
          </p> */}
          <div className="flex justify-center mt-5">
            <img
              src={travelHeader}
              alt="Travel"
              className="w-full max-w-[1650px] h-auto object-contain drop-shadow-md"
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 bg-[#cee2e5] backdrop-blur-md rounded-3xl shadow-lg overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-teal-500 to-emerald-400" />
              <div className="p-5 space-y-5">
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
                <div>
                  <label className={labelCls}>Division</label>
                  {/* TODO: fetch from GET /api/divisions */}
                  <div className="space-y-2">
                    {MOCK_DIVISIONS.map((div) => (
                      <button
                        key={div.id}
                        onClick={() => toggleDivision(div.name)}
                        className="w-full flex items-center gap-3 group py-0.5"
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border-2 flex-shrink-0 transition-all ${selectedDivisions.includes(div.name) ? "bg-teal-600 border-teal-600" : "border-gray-300 group-hover:border-teal-400"}`}
                        >
                          {selectedDivisions.includes(div.name) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm text-left transition-colors ${selectedDivisions.includes(div.name) ? "text-teal-700 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}
                        >
                          {div.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Traveler</label>
                  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <span className="text-gray-800 font-bold text-lg">
                      {travelers}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTravelers((p) => Math.max(1, p - 1))}
                        disabled={travelers <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 disabled:opacity-30 transition-all"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setTravelers((p) => Math.min(20, p + 1))}
                        disabled={travelers >= 20}
                        className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 disabled:opacity-30 transition-all"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={applyFilters}
                  className="w-full py-3.5 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-2xl transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 text-sm tracking-wide"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Apply Filters
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="w-full py-2 text-xs text-gray-400 hover:text-teal-600 transition-colors font-medium"
                  >
                    ✕ Reset all filters
                  </button>
                )}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-yellow-400 rounded-full" />
                    <h3 className="text-gray-800 font-bold text-sm">Cities</h3>
                  </div>
                  <div className="relative mb-3">
                    <input
                      type="text"
                      placeholder="Search cities..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                    />
                    <svg
                      className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  {/* TODO: fetch from GET /api/cities */}
                  <div className="space-y-2">
                    {visibleCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => toggleCity(city.name)}
                        className="w-full flex items-center gap-3 group py-0.5"
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border-2 flex-shrink-0 transition-all ${selectedCities.includes(city.name) ? "bg-teal-600 border-teal-600" : "border-gray-300 group-hover:border-teal-400"}`}
                        >
                          {selectedCities.includes(city.name) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm text-left transition-colors ${selectedCities.includes(city.name) ? "text-teal-700 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}
                        >
                          {city.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  {filteredCities.length > 6 && (
                    <button
                      onClick={() => setShowAllCities(!showAllCities)}
                      className="mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                    >
                      {showAllCities
                        ? "Show less"
                        : `Show more (${filteredCities.length - 6} more)`}
                      <svg
                        className={`w-4 h-4 transition-transform ${showAllCities ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </aside>
          <div className="flex-1 min-w-0">
            <DivisionSummaryCard
              divisions={selectedDivisions}
              onRemove={removeDivision}
            />
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <p className="text-gray-600 text-sm">
                Showing{" "}
                <span className="text-teal-700 font-bold">
                  {filtered.length}
                </span>{" "}
                events{hasActiveFilters && " (filtered)"}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCities.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full"
                  >
                    🏙️ {c}
                    <button
                      onClick={() => toggleCity(c)}
                      className="font-bold hover:text-teal-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {(priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX) && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    💰 BDT {priceRange[0].toLocaleString()} –{" "}
                    {priceRange[1].toLocaleString()}
                    <button
                      onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}
                      className="font-bold hover:text-red-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
                  >
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                      <div className="h-8 bg-gray-200 rounded w-1/3 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-white/60 backdrop-blur-sm rounded-3xl">
                <div className="text-7xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No events found
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Try adjusting your filters
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-full text-sm font-semibold hover:bg-teal-500 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  {paginatedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                {filtered.length > EVENTS_PER_PAGE && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:border-teal-500 hover:text-teal-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3.5 py-2 rounded-xl border text-sm font-bold transition-colors ${currentPage === page ? "bg-teal-700 text-white border-teal-700" : "bg-white text-gray-700 border-gray-200 hover:border-teal-500 hover:text-teal-700"}`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:border-teal-500 hover:text-teal-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Male;
