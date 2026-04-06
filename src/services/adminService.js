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

import { MOCK_EVENTS_DETAIL } from '../hooks/mockEventsDetail';

const delay = ms => new Promise(r => setTimeout(r, ms));

// ── Keys ────────────────────────────────────────────────────────
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

// USERS
// ════════════════════════════════════════════════════════════════

export const getUsers = async () => {
  // TODO: GET /api/admin/users
  await delay(300);
  return read(KEYS.users) || [];
};

export const removeUser = async (userId) => {
  // TODO: DELETE /api/admin/users/:id
  await delay(300);
  const users = read(KEYS.users) || [];
  write(KEYS.users, users.filter(u => u.id !== userId));
};


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
  // TODO: GET /api/admin/events
  await delay(300);
  return read(KEYS.events) || [];
};

export const createEvent = async (eventData) => {
  // TODO: POST /api/admin/events
  await delay(400);
  const events = read(KEYS.events) || [];
  const newEvent = {
    ...eventData,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  write(KEYS.events, [...events, newEvent]);
  return newEvent;
};

export const updateEvent = async (id, eventData) => {
  // TODO: PUT /api/admin/events/:id
  await delay(400);
  const events = read(KEYS.events) || [];
  const updated = events.map(e => e.id === id ? { ...e, ...eventData } : e);
  write(KEYS.events, updated);
  return updated.find(e => e.id === id);
};

export const deleteEvent = async (id) => {
  // TODO: DELETE /api/admin/events/:id
  await delay(300);
  const events = read(KEYS.events) || [];
  write(KEYS.events, events.filter(e => e.id !== id));
};

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
  // TODO: GET /api/admin/bookings
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
  // TODO: DELETE /api/admin/bookings/:id
  await delay(300);
  const all = read(KEYS.bookings) || [];
  write(KEYS.bookings, all.filter(b => b.id !== id));
};
 
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

// 
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


// DASHBOARD STATS
// ════════════════════════════════════════════════════════════════

export const getDashboardStats = async () => {
  // TODO: GET /api/admin/stats
  await delay(300);
  const users    = read(KEYS.users)    || [];
  const events   = read(KEYS.events)   || [];
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