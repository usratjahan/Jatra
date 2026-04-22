//
// Route: /booking/:id  (protected — must be logged in)

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getEventById } from "../hooks/mockEventsDetail";
import useBooking from "../hooks/useBooking";
import BookingHeader from "../components/booking/BookingHeader";
import TravelerForm from "../components/booking/TravelerForm";
import AdditionalForm from "../components/booking/AdditionalForm";
import BookingSummaryCard from "../components/booking/BookingSummaryCard";
import PaymentModal from "../components/booking/PaymentModal";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fetchedEvent = await getEventById(id);
        setEvent(fetchedEvent);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const {
    primary,
    updatePrimary,
    additionals,
    addTraveler,
    removeTraveler,
    updateAdditional,
    priceType,
    setPriceType,
    totalTravelers,
    unitPrice,
    subtotal,
    paymentOpen,
    setPaymentOpen,
    termsAccepted,
    setTermsAccepted,
    error,
    setError,
    handleSubmit,
    submitBooking,
  } = useBooking(event, user);

  if (loading) return <div className="min-h-screen bg-[#edfffd] pt-28 flex items-center justify-center">Loading...</div>;

  // ── Event not found ──────────────────────────────────────────
  if (!event)
    return (
      <div className="min-h-screen bg-[#edfffd] pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Event not found
          </h2>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-full text-sm font-semibold hover:bg-teal-500 transition-colors cursor-pointer"
          >
            Browse Events
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#edfffd] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(`/events/${event.id}`)}
          className="flex items-center gap-1.5 text-teal-700 text-sm font-medium mb-5 hover:text-teal-900 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Event
        </button>

        {/* Event title + date strip */}
        <BookingHeader event={event} />

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="flex flex-col lg:flex-row gap-7 items-start">
          {/* ── LEFT — traveler forms ── */}
          <div className="flex-1 min-w-0">
            {/* Primary traveler */}
            <TravelerForm primary={primary} updatePrimary={updatePrimary} />

            {/* Additional travelers */}
            {additionals.map((traveler, index) => (
              <AdditionalForm
                key={traveler.id}
                traveler={traveler}
                index={index}
                onRemove={removeTraveler}
                onUpdate={updateAdditional}
              />
            ))}

            {/* + Add Traveler button */}
            <button
              onClick={addTraveler}
              disabled={additionals.length >= 9}
              className="w-full py-3.5 border-2 border-dashed border-teal-400 hover:border-teal-600 bg-white hover:bg-teal-50 text-teal-600 hover:text-teal-800 font-bold rounded-2xl transition-all duration-200 text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              + Add Traveler
            </button>
          </div>

          {/* ── RIGHT — sticky booking summary ── */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <BookingSummaryCard
              event={event}
              priceType={priceType}
              setPriceType={setPriceType}
              totalTravelers={totalTravelers}
              unitPrice={unitPrice}
              subtotal={subtotal}
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
              error={error}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* ── Payment modal ── */}
      <PaymentModal
        open={paymentOpen}
        onClose={() => {
          setPaymentOpen(false);
          setError("");
        }}
        subtotal={subtotal}
        event={event}
        submitBooking={submitBooking}
      />
    </div>
  );
};

export default BookingPage;
