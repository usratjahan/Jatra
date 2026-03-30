// ═══════════════════════════════════════════════════════════════
// FILE: src/hooks/useBooking.js
//
// Manages all booking state:
//   - primary traveler form
//   - additional travelers list
//   - Local/Foreigner price toggle
//   - subtotal calculation
//   - payment modal open/close
// TODO: Replace submitBooking() with real API:
//   POST /api/bookings { eventId, travelers[], priceType, totalAmount }
// Note for developers:
// - current implementation writes booking records to localStorage through adminService
// - admin dashboard revenue/sales/profit are calculated directly from those booking records
// - when backend is added, keep the same payload shape and move persistence/calculation server-side

import { useState } from 'react';
import { addBookingForUser } from '../services/authService';
import { addBooking } from '../services/adminService';

const EMPTY_TRAVELER = () => ({
  id: Date.now() + Math.random(),
  fullName: '',
  email: '',
  phone: '',
  address: '',
  nidNo: '',
  birthRegistrationNo: '',
});

const useBooking = (event, currentUser) => {
  // ── Primary traveler — pre-fill from logged-in user ──────────
  const [primary, setPrimary] = useState({
    fullName:  currentUser?.fullName  || '',
    email:     currentUser?.email     || '',
    phone:     currentUser?.phone     || '',
    address:   currentUser?.address   || '',
    nidNo:     '',
    emergencyContact:     '',
    emergencyRelationship:'',
    whatsappNo: '',
  });

  // ── Additional travelers ─────────────────────────────────────
  const [additionals, setAdditionals] = useState([]);

  // ── Price type ───────────────────────────────────────────────
  const [priceType, setPriceType] = useState('local'); // 'local' | 'foreigner'

  // ── Payment modal ────────────────────────────────────────────
  const [paymentOpen, setPaymentOpen] = useState(false);

  // ── Validation error ─────────────────────────────────────────
  const [error, setError] = useState('');

  // ── Terms accepted ───────────────────────────────────────────
  const [termsAccepted, setTermsAccepted] = useState(false);

  // ── Derived values ───────────────────────────────────────────
  const totalTravelers = 1 + additionals.length;

  const unitPrice =
    priceType === 'foreigner'
      ? event?.priceForForeignGuests ?? event?.price ?? 0
      : event?.price ?? 0;

  const subtotal = unitPrice * totalTravelers;

  // ── Primary form updater ─────────────────────────────────────
  const updatePrimary = (field) => (e) =>
    setPrimary((prev) => ({ ...prev, [field]: e.target.value }));

  // ── Additional traveler helpers ──────────────────────────────
  const addTraveler = () => {
    if (additionals.length >= 9) return; // max 10 total
    setAdditionals((prev) => [...prev, EMPTY_TRAVELER()]);
  };

  const removeTraveler = (id) =>
    setAdditionals((prev) => prev.filter((t) => t.id !== id));

  const updateAdditional = (id, field) => (e) =>
    setAdditionals((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: e.target.value } : t))
    );

  // ── Submit → open payment modal ──────────────────────────────
  const handleSubmit = () => {
    setError('');
    if (!primary.fullName || !primary.email || !primary.phone) {
      setError('Please fill in all required fields for the primary traveler.');
      return;
    }
    if (!termsAccepted) {
      setError('Please accept the Refund Policy and Terms & Conditions.');
      return;
    }
    setPaymentOpen(true);
  };

  // ── After payment method selected ───────────────────────────
  // TODO: POST /api/bookings
  const submitBooking = async (method) => {
    // const res = await fetch('/api/bookings', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${currentUser?.token}`,
    //   },
    //   body: JSON.stringify({
    //     eventId: event.id,
    //     primaryTraveler: primary,
    //     additionalTravelers: additionals,
    //     priceType,
    //     totalAmount: subtotal,
    //     paymentMethod: method,
    //   }),
    // });
    // const data = await res.json();
    // return data;

    // MOCK
    await new Promise((r) => setTimeout(r, 800));

    const bookingPayload = {
      userId: currentUser?.id ?? primary.email,
      eventId: Number(event?.id),
      eventName: event?.title || 'Untitled Event',
      location: event?.location || 'Unknown',
      days: `${event?.dateFrom || ''} – ${event?.dateTo || ''}`,
      totalAmount: subtotal,
      priceType,
      members: totalTravelers,
      status: 'Confirmed',
      paymentMethod: method,
      primaryTraveler: {
        fullName: primary.fullName,
        email: primary.email,
        phone: primary.phone,
        address: primary.address,
        nidNo: primary.nidNo,
        emergencyContact: primary.emergencyContact,
        emergencyRelationship: primary.emergencyRelationship,
        whatsappNo: primary.whatsappNo,
      },
      additionalTravelers: additionals,
    };

    const savedBooking = await addBooking(bookingPayload);

    const bookingEntry = {
      id: savedBooking?.id || `JTR-${Date.now()}`,
      eventTitle: event?.title || 'Untitled Event',
      location: event?.location || 'Unknown',
      sublocation: event?.sublocation || '',
      dateFrom: event?.dateFrom || '',
      dateTo: event?.dateTo || '',
      travelers: totalTravelers,
      totalPrice: subtotal,
      status: 'confirmed',
      bookedAt: new Date().toISOString().slice(0, 10),
      image: event?.image || event?.images?.[0] || '',
      paymentMethod: method,
      priceType,
    };

    if (currentUser?.id) {
      await addBookingForUser(currentUser.id, bookingEntry);
    }

    return { success: true, bookingId: bookingEntry.id, method };
  };

  return {
    primary, updatePrimary,
    additionals, addTraveler, removeTraveler, updateAdditional,
    priceType, setPriceType,
    totalTravelers, unitPrice, subtotal,
    paymentOpen, setPaymentOpen,
    termsAccepted, setTermsAccepted,
    error, setError,
    handleSubmit,
    submitBooking,
  };
};

export default useBooking;