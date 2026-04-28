// FILE: src/services/adminService.js
//
// Central data service for admin panel.
// Uses backend APIs for shared, durable data across browsers/devices/environments.
// Admin authentication via Firebase token or local admin session headers.
//
// API endpoints:
// - /api/admin/users     → registered users
// - /api/admin/bookings  → all bookings with optional filters
// - /api/admin/stats     → dashboard statistics
// - /api/admin/contact   → editable contact page info
// - /api/tours           → admin-managed events
// - /api/bookings        → booking CRUD operations
//
// ═══════════════════════════════════════════════════════════════

import { MOCK_EVENTS_DETAIL } from '../hooks/mockEventsDetail';

const API_BASE = import.meta.env.VITE_API_URL;
const getToken = () => {
  try {
    const session = JSON.parse(localStorage.getItem('jatra_session'));
    return session?.token;
  } catch {
    return null;
  }
};

const getAdminSession = () => {
  try {
    return JSON.parse(localStorage.getItem('jatra_admin_session'));
  } catch {
    return null;
  }
};

const authHeaders = () => {
  const token = getToken();
  const adminSession = getAdminSession();

  if (token) {
    // Firebase user token
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  } else if (adminSession) {
    // Local admin session - use a simple admin header
    return {
      'Content-Type': 'application/json',
      'X-Admin-ID': adminSession.id,
      'X-Admin-Email': adminSession.email,
    };
  } else {
    throw new Error('Authentication required');
  }
};

// ════════════════════════════════════════════════════════════════
// USERS
// ════════════════════════════════════════════════════════════════

export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch users');
  }

  return res.json();
};

export const removeUser = async (userId) => {
  const res = await fetch(`${API_BASE}/admin/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to remove user');
  }

  return res.json();
};

// ════════════════════════════════════════════════════════════════
// EVENTS  (admin-managed)
// ════════════════════════════════════════════════════════════════

export const getAdminEvents = async () => {
  const res = await fetch(`${API_BASE}/tours`);
  if (!res.ok) throw new Error('Failed to fetch admin events');
  return res.json();
};

export const createEvent = async (eventData) => {
  try {
    const res = await fetch(`${API_BASE}/tours`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(eventData),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('API Error:', res.status, text);
      if (res.status === 401 || res.status === 403) {
        console.error('Auth failed. Admin session:', getAdminSession());
        throw new Error(`Authentication failed (${res.status}): ${text}`);
      }
      throw new Error(text || `Request failed with status ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  const res = await fetch(`${API_BASE}/tours/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(eventData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update event');
  }

  return res.json();
};

export const deleteEvent = async (id) => {
  const res = await fetch(`${API_BASE}/tours/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete event');
  }

  return res.json();
};

// ════════════════════════════════════════════════════════════════
// BOOKINGS
// ════════════════════════════════════════════════════════════════

export const getBookings = async () => {
  const res = await fetch(`${API_BASE}/admin/bookings`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch bookings');
  }

  return res.json();
};

export const getBookingsByUser = async (userId) => {
  const url = new URL(`${API_BASE}/admin/bookings`);
  url.searchParams.set('userId', userId);

  const res = await fetch(url.toString(), {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch bookings for user');
  }

  return res.json();
};

export const getBookingsByEvent = async (eventId) => {
  const url = new URL(`${API_BASE}/admin/bookings`);
  url.searchParams.set('eventId', eventId);

  const res = await fetch(url.toString(), {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch bookings for event');
  }

  return res.json();
};

export const addBooking = async (booking) => {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(booking),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to create booking');
  }

  return res.json();
};

export const updateBooking = async (id, data) => {
  const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update booking');
  }

  return res.json();
};

export const deleteBooking = async (id) => {
  const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete booking');
  }

  return res.json();
};

export const addAdditionalTraveler = async (bookingId, traveler) => {
  const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(bookingId)}/travelers`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(traveler),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to add additional traveler');
  }

  return res.json();
};

export const removeAdditionalTraveler = async (bookingId, travelerId) => {
  const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(bookingId)}/travelers/${encodeURIComponent(travelerId)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to remove additional traveler');
  }

  return res.json();
};

// ════════════════════════════════════════════════════════════════
// CONTACT INFO  (syncs with ContactUs.jsx)
// ════════════════════════════════════════════════════════════════

export const getContactInfo = async () => {
  const res = await fetch(`${API_BASE}/admin/contact`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch contact info');
  }

  return res.json();
};

export const updateContactInfo = async (data) => {
  const res = await fetch(`${API_BASE}/admin/contact`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update contact info');
  }

  return res.json();
};

// ════════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ════════════════════════════════════════════════════════════════

export const getDashboardStats = async () => {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch dashboard stats');
  }

  return res.json();
};
