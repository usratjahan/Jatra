import React from 'react';

const BookingHeader = ({ event }) => (
  <div className="mb-6">
    <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{event.title}</h1>
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
      {/* Location */}
      <span className="flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span className="text-gray-600 font-medium">{event.location}, {event.sublocation}</span>
      </span>

      {/* Date */}
      <span className="flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        <span className="text-gray-600 font-medium">{event.dateFrom} – {event.dateTo}</span>
      </span>
    </div>

    {/* Divider */}
    <div className="mt-4 h-px bg-gray-200" />
  </div>
);

export default BookingHeader;