import React, { useState } from "react";

const EventDetailHeader = ({ event }) => {
  const images = event.images?.length ? event.images : [event.image];
  const [active, setActive] = useState(0);

  return (
    <div className="relative h-[220px] w-full overflow-hidden rounded-2xl bg-gray-900 sm:h-[280px] lg:h-[340px]">

      {/* Main image */}
      <img
        src={images[active]}
        alt={event.title}
        className="w-full h-full object-cover transition-opacity duration-500"
        onError={(e) => { e.target.style.display = "none"; }}
      />

      {/* Dark gradient overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Thumbnail strip — bottom left */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-3 flex gap-1.5 sm:bottom-4 sm:left-4 sm:gap-2">
          {images.map((src, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`h-8 w-11 overflow-hidden rounded-lg border-2 transition-all sm:h-10 sm:w-14 ${
                i === active ? "border-white scale-105" : "border-white/40 opacity-70 hover:opacity-100"
              }`}>
              <img src={src} alt="" className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }} />
            </button>
          ))}
        </div>
      )}

      {/* Community badge — top left */}
      <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
        <span className="rounded-full bg-teal-600/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs">
          {event.community}
        </span>
      </div>
    </div>
  );
};

export default EventDetailHeader;