import { Calendar, Calendar1, MapPin, User } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { getUserBookings } from "../../services/authService";

const STATUS_STYLES = {
  confirmed: "bg-green-500/20 text-green-400 border border-green-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  cancelled: "bg-red-500/20 text-red-400 border border-red-500/30",
};

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!user?.id) {
          setBookings([]);
          return;
        }

        const data = await getUserBookings(user.id);
        setBookings(data);
      } catch (err) {
        console.error("Bookings fetch failed:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  return (
    <div>
      <h1 className="text-white font-bold text-3xl mb-8">Booking History</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="animate-pulse rounded-2xl h-28 bg-white/10"
            />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-28 text-center rounded-2xl"
          style={{
            background: "rgba(15,57,62,0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="text-6xl mb-4">🧳</div>
          <h3 className="text-white font-bold text-xl mb-2">No bookings yet</h3>
          <p className="text-white/50 text-sm">
            Your travel bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-8 rounded-2xl p-6 transition-all hover:bg-white/5"
              style={{
                background: "rgba(15,57,62,0.6)",
                border: "2px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-teal-900">
                <img
                  src={b.image}
                  alt={b.eventTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-10">
                <div className="flex items-center gap-5 flex-wrap mb-1">
                  <p className="text-white font-bold text-base truncate">
                    {b.eventTitle}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${STATUS_STYLES[b.status]}`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="text-white/60 text-xs flex items-center gap-2 mb-1">
                  <MapPin size={16} className="opacity-70" />
                  {b.location}, {b.sublocation}
                </p>

                <p className="text-white/60 text-xs flex items-center gap-2">
                  <Calendar size={16} className="opacity-70" />
                  {b.dateFrom} – {b.dateTo}
                  <span className="mx-1 text-white/40">•</span>
                  <User size={16} className="opacity-70" />
                  {b.travelers} traveler{b.travelers > 1 ? "s" : ""}
                </p>
              </div>

              {/* Price + Booking ID */}
              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold text-lg">
                  BDT {b.totalPrice.toLocaleString("en-BD")}
                </p>
                <p className="text-white/40 text-xs mt-1">#{b.id}</p>
                <p className="text-white/40 text-xs">Booked {b.bookedAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
