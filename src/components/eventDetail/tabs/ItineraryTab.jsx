import React, { useState } from "react";

const ItineraryTab = ({ itinerary = [] }) => {
  const [openDay, setOpenDay] = useState(0); // first day open by default

  return (
    <div className="space-y-3">
      {itinerary.map((item, idx) => {
        const isOpen = openDay === idx;
        return (
          <div key={idx}
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              isOpen ? "border-teal-300 shadow-sm" : "border-gray-200"
            }`}>
            {/* Accordion header */}
            <button
              onClick={() => setOpenDay(isOpen ? -1 : idx)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                isOpen ? "bg-teal-50" : "bg-white hover:bg-gray-50"
              }`}>
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isOpen ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  {item.day}
                </span>
                <span className={`text-sm font-semibold ${isOpen ? "text-teal-700" : "text-gray-800"}`}>
                  Day {item.day}: {item.title}
                </span>
              </div>
              <svg className={`w-4 h-4 flex-shrink-0 transition-transform text-gray-400 ${isOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {/* Accordion body */}
            {isOpen && (
              <div className="px-4 pb-4 pt-2 bg-white">
                <p className="text-gray-600 text-sm leading-relaxed pl-10">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ItineraryTab;