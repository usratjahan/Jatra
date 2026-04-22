import React from "react";

const EventOverview = ({ event }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-3">Overview</h2>
    <p className="text-gray-600 text-sm leading-relaxed text-justify">
      {event.description}
    </p>

    {/* Days / Nights / Spots pills */}
    <div className="flex flex-wrap gap-3 mt-4">
      <span className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full">
        🗓 {event.days} Days / {event.nights} Nights
      </span>
      <span className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
        👤 {event.spotsLeft} Spots Left
      </span>
      <span className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-full">
        ⭐ {event.avgRating ?? event.rating} (
        {event.reviewCount ?? event.reviews?.length} reviews)
      </span>
    </div>
  </div>
);

export default EventOverview;
