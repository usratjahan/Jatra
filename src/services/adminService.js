// FILE: src/services/adminService.js
//
// Central data service for admin panel.
// Demo mode persistence:
// - data is stored in browser localStorage for quick frontend development
// - dashboard stats start from 0 when there are no bookings
// - stats increase automatically after new bookings are created
// - this is temporary client-side storage and should be replaced by backend APIs
//   for shared, durable data across browsers/devices/environments
//
// All data lives in localStorage under these keys:
//   jatra_users          → registered users (from authService)
//   jatra_admin_events   → events created by admin
//   jatra_bookings       → all bookings made by users
//   jatra_contact_info   → editable contact page info
//   jatra_messages       → user→admin messages (future)
//
// TODO: replace each function body with real API calls
// ═══════════════════════════════════════════════════════════════

import { MOCK_EVENTS_DETAIL } from '../hooks/mockEventsDetail';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
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

// ── Keys ────────────────────────────────────────────────────────
const FIREBASE_USER_META_KEY = 'jatra_firebase_user_meta';
const KEYS = {
  users:       'jatra_users',
  events:      'jatra_admin_events',
  bookings:    'jatra_bookings',
  contact:     'jatra_contact_info',
  messages:    'jatra_messages',
};

// ── Storage helpers ─────────────────────────────────────────────
const read  = key => { try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; } };
const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const readFirebaseUserMeta = () => { try { return JSON.parse(localStorage.getItem(FIREBASE_USER_META_KEY)) || {}; } catch { return {}; } };

// ════════════════════════════════════════════════════════════════
// USERS
// ════════════════════════════════════════════════════════════════

export const getUsers = async () => {
  // Try to fetch from backend API first
  try {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'GET',
        headers: authHeaders(),
      });
      if (res.ok) {
        const users = await res.json();
        console.log('Users fetched from backend:', users.length);
        return users;
      }
    }
  } catch (error) {
    console.error('Failed to fetch users from backend:', error);
  }

  // Fallback to localStorage
  await delay(300);

  const localUsers = read(KEYS.users);
  if (Array.isArray(localUsers) && localUsers.length > 0) {
    return localUsers;
  }

  const meta = readFirebaseUserMeta();
  return Object.entries(meta).map(([id, data]) => ({
    id,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    role: data.role || 'user',
    ...data,
  }));
};

export const removeUser = async (userId) => {
  // TODO: DELETE /api/admin/users/:id
  await delay(300);
  const users = read(KEYS.users) || [];
  write(KEYS.users, users.filter(u => u.id !== userId));

  const meta = readFirebaseUserMeta();
  if (meta[userId]) {
    delete meta[userId];
    write(FIREBASE_USER_META_KEY, meta);
  }
};

// ════════════════════════════════════════════════════════════════
// EVENTS  (admin-managed)
// ════════════════════════════════════════════════════════════════

// Seed from MOCK_EVENTS_DETAIL on first load
const seedEvents = () => {
  const existing = read(KEYS.events);
  if (!existing) {
    write(KEYS.events, MOCK_EVENTS_DETAIL);
  }
};
seedEvents();

export const getAdminEvents = async () => {
  const res = await fetch(`${API_BASE}/tours`);
  if (!res.ok) throw new Error('Failed to fetch admin events');
  return res.json();
};

export const createEvent = async (eventData) => {
  try {
    // Try normal endpoint first
    const res = await fetch(`${API_BASE}/tours`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(eventData),
    });
    
    if (!res.ok) {
      const text = await res.text();
      console.error('API Error:', res.status, text);
      
      // For development, log more details
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

// Seed mock bookings
const seedBookings = () => {
  const existing = read(KEYS.bookings);
  if (!existing) {
    // Start empty so dashboard metrics remain 0 until real bookings are created.
    write(KEYS.bookings, []);
  }
};

export const getBookings = async () => {
  // Try to fetch from backend API first
  try {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/admin/bookings`, {
        method: 'GET',
        headers: authHeaders(),
      });
      if (res.ok) {
        const bookings = await res.json();
        console.log('Bookings fetched from backend:', bookings.length);
        return bookings;
      }
    }
  } catch (error) {
    console.error('Failed to fetch bookings from backend:', error);
  }

  // Fallback to localStorage
  await delay(300);
  return read(KEYS.bookings) || [];
};

export const getBookingsByUser = async (userId) => {
  // TODO: GET /api/admin/bookings?userId=:id
  await delay(200);
  const all = read(KEYS.bookings) || [];
  return all.filter(b => b.userId === userId);
};

export const getBookingsByEvent = async (eventId) => {
  // TODO: GET /api/admin/bookings?eventId=:id
  await delay(200);
  const all = read(KEYS.bookings) || [];
  return all.filter(b => b.eventId === eventId);
};

export const addBooking = async (booking) => {
  // TODO: POST /api/admin/bookings
  await delay(400);
  const all = read(KEYS.bookings) || [];
  const newBooking = { ...booking, id: Date.now(), createdAt: new Date().toISOString() };
  write(KEYS.bookings, [...all, newBooking]);
  return newBooking;
};

export const updateBooking = async (id, data) => {
  // TODO: PUT /api/admin/bookings/:id
  await delay(400);
  const all = read(KEYS.bookings) || [];
  const updated = all.map(b => b.id === id ? { ...b, ...data } : b);
  write(KEYS.bookings, updated);
  return updated.find(b => b.id === id);
};

export const deleteBooking = async (id) => {
  // Try to delete from backend API first
  try {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        console.log('Booking deleted from backend:', id);
      }
    }
  } catch (error) {
    console.error('Failed to delete booking from backend:', error);
  }

  // Also delete from localStorage
  await delay(300);
  const all = read(KEYS.bookings) || [];
  write(KEYS.bookings, all.filter(b => b.id !== id));
};

// ════════════════════════════════════════════════════════════════
// ADDITIONAL TRAVELERS (within a booking)
// ════════════════════════════════════════════════════════════════

export const addAdditionalTraveler = async (bookingId, traveler) => {
  // TODO: POST /api/admin/bookings/:id/travelers
  await delay(300);
  const all = read(KEYS.bookings) || [];
  const updated = all.map(b => {
    if (b.id !== bookingId) return b;
    const newTraveler = { ...traveler, id: Date.now() };
    return { ...b, additionalTravelers: [...(b.additionalTravelers || []), newTraveler] };
  });
  write(KEYS.bookings, updated);
};

export const removeAdditionalTraveler = async (bookingId, travelerId) => {
  // TODO: DELETE /api/admin/bookings/:id/travelers/:tid
  await delay(300);
  const all = read(KEYS.bookings) || [];
  const updated = all.map(b => {
    if (b.id !== bookingId) return b;
    return { ...b, additionalTravelers: (b.additionalTravelers || []).filter(t => t.id !== travelerId) };
  });
  write(KEYS.bookings, updated);
};

// ════════════════════════════════════════════════════════════════
// CONTACT INFO  (syncs with ContactUs.jsx)
// ════════════════════════════════════════════════════════════════

const DEFAULT_CONTACT = {
  phone:    '+880 1711-000000',
  phone2:   '+880 1722-000000',
  email:    'info@jatra.com',
  email2:   'support@jatra.com',
  address:  'House 12, Road 5, Dhanmondi, Dhaka-1209',
  whatsapp: '+880 1711-000000',
  facebook: 'https://facebook.com/jatra',
  twitter:  'https://twitter.com/jatra',
  instagram:'https://instagram.com/jatra',
  linkedin: 'https://linkedin.com/company/jatra',
};

export const getContactInfo = () => {
  // TODO: GET /api/admin/contact
  return read(KEYS.contact) || DEFAULT_CONTACT;
};

export const updateContactInfo = async (data) => {
  // TODO: PUT /api/admin/contact
  await delay(300);
  write(KEYS.contact, data);
};

// ════════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ════════════════════════════════════════════════════════════════

export const getDashboardStats = async () => {
  // TODO: GET /api/admin/stats
  await delay(300);
  const users = await getUsers();

  let events = [];
  try {
    events = await getAdminEvents();
  } catch (error) {
    events = read(KEYS.events) || [];
  }

  const bookings = read(KEYS.bookings) || [];

  // Only count non-cancelled bookings in financial/stat totals.
  const activeBookings = bookings.filter(
    (b) => String(b?.status || '').toLowerCase() !== 'cancelled'
  );

  const totalRevenue = activeBookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
  const totalSales   = activeBookings.length;
  const totalProfit  = Math.round(totalRevenue * 0.10);

  return {
    totalUsers:   users.length,
    totalEvents:  events.length,
    totalRevenue,
    totalSales,
    totalProfit,
  };
};

seedBookings();