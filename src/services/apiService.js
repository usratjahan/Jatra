// ═══════════════════════════════════════════════════════════════
// FILE: src/services/apiService.js
//
// API service for backend calls.
// ═══════════════════════════════════════════════════════════════

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get auth token from current user.
 */
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('jatra_session'));
  return user?.token;
};

/**
 * Fetch tours from backend.
 */
export const getTours = async () => {
  const res = await fetch(`${API_BASE}/tours`);
  if (!res.ok) throw new Error('Failed to fetch tours');
  return res.json();
};

/**
 * Get a single tour by ID.
 */
export const getTourById = async (id) => {
  const res = await fetch(`${API_BASE}/tours/${id}`);
  if (!res.ok) throw new Error('Failed to fetch tour');
  return res.json();
};

/**
 * Create a tour (admin only).
 */
export const createTour = async (tourData) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/tours`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(tourData),
  });
  if (!res.ok) throw new Error('Failed to create tour');
  return res.json();
};

/**
 * Book a tour.
 */
export const bookTour = async (bookingData) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) throw new Error('Failed to book tour');
  return res.json();
};

/**
 * Process payment.
 */
export const processPayment = async (paymentData) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });
  if (!res.ok) throw new Error('Payment failed');
  return res.json();
};