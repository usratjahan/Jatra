// Shows event cards that have at least 1 booking.
// Admin can view who booked, see additional travelers, delete booking.

import React, { useEffect, useState, useCallback } from 'react';
import { getAdminEvents, getBookings, deleteBooking } from '../../../services/adminService';
import AdditionalTravelerPanel from '../user/AdditionalTravelerPanel';

const EVENT_IMAGE_FALLBACK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="240"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" text-anchor="middle" dy=".35em" fill="%236b7280" font-family="Arial, sans-serif" font-size="20">No Image</text></svg>';

// ── Who Booked Modal ────────────────────────────────────────────
const WhoBookedModal = ({ event, bookings, onClose, onRefresh }) => {
  const [travelerBooking, setTravelerBooking] = useState(null);

  const handleDelete = async (bookingId) => {
    if (!confirm('Delete this booking?')) return;
    await deleteBooking(bookingId);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h3 className="font-bold text-gray-900">Bookings for: {event.title}</h3>
            <p className="text-xs text-gray-500">{bookings.length} booking(s) total</p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Booking list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {bookings.map((b, i) => (
            <div key={b.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {/* Primary traveler */}
                  <p className="text-xs font-bold text-gray-800 mb-1">
                    #{i + 1} — {b.primaryTraveler?.fullName || 'Unknown'}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-[10px] text-gray-500 mb-3">
                    <span>📧 {b.primaryTraveler?.email}</span>
                    <span>📞 {b.primaryTraveler?.phone}</span>
                    <span>👥 {b.members} member(s)</span>
                    <span>💳 {b.paymentMethod}</span>
                    <span>📅 {b.days}</span>
                    <span>💰 BDT {Number(b.totalAmount).toLocaleString('en-BD')}</span>
                    <span className={`font-bold ${b.status === 'Confirmed' ? 'text-green-600' : b.status === 'Cancelled' ? 'text-red-500' : 'text-amber-500'}`}>
                      ● {b.status}
                    </span>
                    <span>🕒 {new Date(b.createdAt).toLocaleDateString('en-BD')}</span>
                  </div>

                  {/* Additional travelers count */}
                  {b.additionalTravelers?.length > 0 && (
                    <p className="text-[10px] text-teal-600 font-semibold mb-2">
                      + {b.additionalTravelers.length} additional traveler(s)
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => setTravelerBooking(b)}
                    className="px-3 py-1.5 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-[10px] font-bold rounded-lg cursor-pointer whitespace-nowrap transition-colors">
                    Additional Traveler
                  </button>
                  <button onClick={() => handleDelete(b.id)}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-[10px] font-bold rounded-lg cursor-pointer transition-colors">
                    Delete Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
          <button onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer">
            Back
          </button>
        </div>
      </div>

      {/* Additional Traveler drill-down */}
      {travelerBooking && (
        <AdditionalTravelerPanel
          booking={travelerBooking}
          onClose={() => setTravelerBooking(null)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};

// ── Event Card ──────────────────────────────────────────────────
const RegisteredEventCard = ({ event, bookings, onViewBookings }) => (
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
      <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 flex items-center gap-1 text-xs font-bold text-amber-500">
        ⭐ {event.avgRating ?? '5.0'}
      </div>
      {/* Booking count badge */}
      <div className="absolute top-2 left-2 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
      </div>
    </div>

    {/* Info */}
    <div className="p-3">
      <div className="flex items-start gap-1.5 mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
          fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="flex-shrink-0 mt-0.5">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        <div>
          <p className="text-xs font-bold text-gray-800 leading-tight">{event.location}</p>
          <p className="text-[10px] text-gray-500">{event.sublocation}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2">
        <span>📅 {event.dateFrom} – {event.dateTo}</span>
        <span>👥 {event.spotsLeft} left</span>
      </div>

      <div className="border-t border-dashed border-gray-200 pt-2 flex items-center justify-between">
        <p className="text-sm font-extrabold text-gray-900">
          BDT {Number(event.price).toLocaleString('en-BD')}
        </p>
        <button
          onClick={() => onViewBookings(event, bookings)}
          className="px-3 py-1 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
        >
          View Bookings
        </button>
      </div>
    </div>
  </div>
);

// ── Main Page ───────────────────────────────────────────────────
const RegisteredEvent = () => {
  const [events,   setEvents]   = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null); // { event, bookings }

  const load = useCallback(async (withSpinner = true) => {
    if (withSpinner) setLoading(true);
    const [evts, bks] = await Promise.all([getAdminEvents(), getBookings()]);
    setEvents(evts);
    setBookings(bks);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      const [evts, bks] = await Promise.all([getAdminEvents(), getBookings()]);
      if (!active) return;
      setEvents(evts);
      setBookings(bks);
      setLoading(false);
    };
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  // Only events that have at least 1 booking
  const registeredEvents = events.filter(ev =>
    bookings.some(b => b.eventId === ev.id)
  );

  const bookingsForEvent = (eventId) =>
    bookings.filter(b => b.eventId === eventId);

  if (loading) return (
    <div className="flex justify-center py-16">
      <svg className="w-7 h-7 animate-spin text-teal-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-800 mb-6">Registered Event</h2>

      {registeredEvents.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-2">📭</p>
          <p>No events have been booked yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {registeredEvents.map(ev => (
              <RegisteredEventCard
                key={ev.id}
                event={ev}
                bookings={bookingsForEvent(ev.id)}
                onViewBookings={(event, bks) => setSelected({ event, bookings: bks })}
              />
            ))}
          </div>

          {/* Total counter */}
          <div className="flex justify-end">
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3">
              <p className="text-sm font-bold text-gray-700">
                Total Event Registered —{' '}
                <span className="text-teal-600 text-base">
                  {String(registeredEvents.length).padStart(2, '0')}
                </span>
              </p>
            </div>
          </div>
        </>
      )}

      {/* Who Booked Modal */}
      {selected && (
        <WhoBookedModal
          event={selected.event}
          bookings={selected.bookings}
          onClose={() => setSelected(null)}
          onRefresh={load}
        />
      )}
    </div>
  );
};

export default RegisteredEvent;