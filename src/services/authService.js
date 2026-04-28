// ═══════════════════════════════════════════════════════════════
// FILE: src/services/authService.js
//
// Firebase-backed auth service with fallback metadata storage for profile fields.
// ═══════════════════════════════════════════════════════════════

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
} from 'firebase/auth';
import { auth } from '../firebase';

const SESSION_KEY = 'jatra_session';
const BOOKINGS_KEY = 'jatra_bookings_by_user';
const ADMIN_BOOKINGS_KEY = 'jatra_bookings';
const FIREBASE_USER_META_KEY = 'jatra_firebase_user_meta';

// ── Helpers ─────────────────────────────────────────────────────
const saveSession = (user) =>
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

const clearSession = () =>
  localStorage.removeItem(SESSION_KEY);

const getFirebaseUserMeta = () => {
  try { return JSON.parse(localStorage.getItem(FIREBASE_USER_META_KEY)) || {}; }
  catch { return {}; }
};

const saveFirebaseUserMeta = (meta) =>
  localStorage.setItem(FIREBASE_USER_META_KEY, JSON.stringify(meta));

const getBookingsByUser = () => {
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || {}; }
  catch { return {}; }
};

const saveBookingsByUser = (bookingsByUser) =>
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookingsByUser));

const getAdminBookings = () => {
  try { return JSON.parse(localStorage.getItem(ADMIN_BOOKINGS_KEY)) || []; }
  catch { return []; }
};

const API_BASE = import.meta.env.VITE_API_URL;

const getToken = () => {
  const currentUser = getCurrentUser();
  return currentUser?.token || null;
};

export const refreshAuthToken = async () => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;

  try {
    const token = await firebaseUser.getIdToken(true);
    const session = getCurrentUser();
    if (session) {
      session.token = token;
      saveSession(session);
    }
    return token;
  } catch (error) {
    console.error('Failed to refresh Firebase token:', error);
    return null;
  }
};

const authHeaders = async () => {
  let token = getToken();
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    const refreshed = await refreshAuthToken();
    if (refreshed) token = refreshed;
  }

  if (!token) throw new Error('Authentication required');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

// ── Public API ──────────────────────────────────────────────────

/**
 * Sign up a new user.
 * Creates Firebase Auth user and saves profile to Firestore via backend.
 */
export const signUp = async ({ firstName, lastName, email, phone, password, role }) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
  const firebaseUser = credential.user;

  const displayName = `${firstName} ${lastName}`.trim();
  await updateProfile(firebaseUser, { displayName });

  // Get the Firebase ID token
  const token = await firebaseUser.getIdToken();
  console.log('Firebase user created:', firebaseUser.uid);
  console.log('Sending signup request to backend...');

  try {
    // Save to Firestore via backend
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        role,
      }),
    });

    console.log('Backend signup response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend signup error:', errorData);
      throw new Error(errorData.error || 'Failed to save user profile to database');
    }

    const data = await response.json();
    console.log('User profile saved to database successfully:', data);
  } catch (error) {
    console.error('Error saving to database:', error);
    // Don't throw - user is already created in Firebase Auth
    // Just log the error so we can debug
  }

  // Also save metadata to localStorage for backwards compatibility
  const usersMeta = getFirebaseUserMeta();
  usersMeta[firebaseUser.uid] = {
    firstName,
    lastName,
    email: normalizedEmail,
    phone,
    role,
    address: '',
    createdAt: new Date().toISOString(),
  };
  saveFirebaseUserMeta(usersMeta);

  const session = {
    id: firebaseUser.uid,
    firstName,
    lastName,
    fullName: displayName,
    email: normalizedEmail,
    phone,
    address: '',
    role,
    token,
    firebase: true,
  };

  saveSession(session);
  return session;
};

/**
 * Sign in an existing user.
 * TODO: replace body with → fetch('/api/auth/signin', { method:'POST', body: JSON.stringify(data) })
 */
export const signIn = async ({ email, password, role }) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
  const firebaseUser = credential.user;
  const userMeta = getFirebaseUserMeta()[firebaseUser.uid] || {};

  if (role && userMeta.role && role !== userMeta.role) {
    throw new Error(`This account is registered as ${userMeta.role}, not ${role}.`);
  }

  const session = {
    id: firebaseUser.uid,
    firstName: userMeta.firstName || '',
    lastName: userMeta.lastName || '',
    fullName:
      firebaseUser.displayName || `${userMeta.firstName || ''} ${userMeta.lastName || ''}`.trim(),
    email: normalizedEmail,
    phone: userMeta.phone || '',
    address: userMeta.address || '',
    role: userMeta.role || role || 'user',
    token: await firebaseUser.getIdToken(),
    firebase: true,
  };

  saveSession(session);
  return session;
};

/**
 * Sign out the current user.
 * TODO: replace body with → fetch('/api/auth/signout', { method:'POST' })
 */
export const signOut = async () => {
  await firebaseSignOut(auth);
  clearSession();
};

/**
 * Get current session from localStorage or Firebase Auth.
 */
export const getCurrentUser = () => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (session) return session;
  } catch {
    // ignore malformed session data
  }

  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;

  const userMeta = getFirebaseUserMeta()[firebaseUser.uid] || {};
  const session = {
    id: firebaseUser.uid,
    firstName: userMeta.firstName || '',
    lastName: userMeta.lastName || '',
    fullName:
      firebaseUser.displayName || `${userMeta.firstName || ''} ${userMeta.lastName || ''}`.trim(),
    email: firebaseUser.email,
    phone: userMeta.phone || '',
    address: userMeta.address || '',
    role: userMeta.role || 'user',
    token: null,
    firebase: true,
  };

  saveSession(session);
  return session;
};

/**
 * Returns true if a user is logged in.
 */
export const isAuthenticated = () => !!getCurrentUser();

/**
 * Fetch tours from backend.
 */
export const getTours = async () => {
  const res = await fetch(`${API_BASE}/tours`);
  if (!res.ok) throw new Error('Failed to fetch tours');
  return res.json();
};

/**
 * Create a tour (admin only).
 */
export const createTour = async (tourData, token) => {
  const authToken = token || getToken();
  if (!authToken) throw new Error('Authentication required');

  const res = await fetch(`${API_BASE}/tours`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(tourData),
  });
  if (!res.ok) throw new Error('Failed to create tour');
  return res.json();
};

/**
 * Book a tour.
 */
export const bookTour = async (bookingData, token) => {
  const authToken = token || getToken();
  if (!authToken) throw new Error('Authentication required');

  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/bookings/book-tour`, {
    method: 'POST',
    headers,
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to book tour');
  }
  return res.json();
};

/**
 * Initiate payment for a booking.
 */
export const initiatePayment = async (bookingId, amount, method, token) => {
  const authToken = token || getToken();
  if (!authToken) throw new Error('Authentication required');

  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/payments`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ bookingId, amount, method }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to initiate payment');
  }
  return res.json();
};
export const updateMyProfile = async ({
  firstName,
  lastName,
  email,
  phone,
  address,
  newPassword,
}) => {
  const session = getCurrentUser();
  if (!session) throw new Error('No active session found.');

  const nextEmail = (email || '').trim().toLowerCase();
  if (!nextEmail) throw new Error('Email is required.');

  const nextFirstName = (firstName || '').trim();
  const nextLastName = (lastName || '').trim();
  const nextFullName = `${nextFirstName} ${nextLastName}`.trim();

  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    throw new Error('Unable to update profile: no authenticated Firebase user.');
  }

  if (firebaseUser.email && nextEmail !== firebaseUser.email) {
    await firebaseUpdateEmail(firebaseUser, nextEmail);
  }

  if (newPassword) {
    await firebaseUpdatePassword(firebaseUser, newPassword);
  }

  await updateProfile(firebaseUser, { displayName: nextFullName });

  const usersMeta = getFirebaseUserMeta();
  usersMeta[session.id] = {
    ...usersMeta[session.id],
    firstName: nextFirstName,
    lastName: nextLastName,
    phone: (phone || '').trim(),
    address: (address || '').trim(),
    updatedAt: new Date().toISOString(),
  };
  saveFirebaseUserMeta(usersMeta);

  const nextSession = {
    ...session,
    firstName: nextFirstName,
    lastName: nextLastName,
    fullName: nextFullName,
    email: nextEmail,
    phone: (phone || '').trim(),
    address: (address || '').trim(),
    token: session.token,
  };

  saveSession(nextSession);
  return nextSession;
};

/**
 * Returns bookings for a specific user.
 */
export const getUserBookings = async (userId) => {
  console.log('getUserBookings called for userId:', userId);
  try {
    const headers = await authHeaders();
    console.log('Headers prepared for API call');
    console.log('Fetching bookings from API for user:', userId);
    const res = await fetch(`${API_BASE}/users/${userId}/bookings`, {
      headers,
    });

    console.log('API response status:', res.status);
    if (res.ok) {
      const bookings = await res.json();
      console.log('Raw bookings from API:', bookings);
      const mappedBookings = bookings.map((b) => ({
        id: b.id,
        eventTitle: b.tourSnapshot?.title || b.eventName || b.eventTitle || 'Untitled Event',
        location: b.tourSnapshot?.location || b.location || 'Unknown',
        sublocation: b.sublocation || '',
        dateFrom: b.tourSnapshot?.dateFrom || b.dateFrom || '',
        dateTo: b.tourSnapshot?.dateTo || b.dateTo || '',
        travelers: b.travelers || b.members || 1,
        totalPrice: b.totalAmount || b.totalPrice || 0,
        status: (b.status || 'pending').toLowerCase(),
        bookedAt: b.createdAt ? new Date(b.createdAt).toISOString().slice(0, 10) : '',
        image: b.tourSnapshot?.image || b.image || b.images?.[0] || '',
        paymentMethod: b.paymentMethod || '',
        priceType: b.priceType || 'local',
      }));
      console.log('Mapped bookings:', mappedBookings);
      return mappedBookings;
    } else {
      console.error('API call failed with status:', res.status);
      const errorText = await res.text();
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Error fetching bookings from API:', error);
  }

  console.log('Falling back to local storage');
  await delay(150);
  const bookingsByUser = getBookingsByUser();
  const direct = bookingsByUser[userId] || [];
  if (direct.length > 0) return direct;

  const fromAdmin = getAdminBookings()
    .filter((b) => b.userId === userId || b.primaryTraveler?.email === userId)
    .map((b) => ({
      id: b.id,
      eventTitle: b.eventName || b.eventTitle || 'Untitled Event',
      location: b.location || 'Unknown',
      sublocation: b.sublocation || '',
      dateFrom: b.dateFrom || b.days?.split(' – ')?.[0] || '',
      dateTo: b.dateTo || b.days?.split(' – ')?.[1] || '',
      travelers: b.members || b.travelers || 1,
      totalPrice: b.totalAmount || b.totalPrice || 0,
      status: (b.status || 'confirmed').toLowerCase(),
      bookedAt: (b.createdAt || '').slice(0, 10),
      image: b.image || b.images?.[0] || '',
      paymentMethod: b.paymentMethod || '',
      priceType: b.priceType || 'local',
    }));

  console.log('Local bookings found:', fromAdmin.length);
  return fromAdmin;
};

/**
 * Append a booking into the current user's booking history.
 */
export const addBookingForUser = async (userId, booking) => {
  // Try to save to backend API first
  try {
    const token = getToken();
    if (token && API_BASE) {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(booking),
      });
      if (res.ok) {
        const savedBooking = await res.json();
        console.log('Booking saved to backend:', savedBooking);
      }
    }
  } catch (error) {
    console.error('Failed to save booking to backend:', error);
  }

  // Also save to localStorage as fallback
  await delay(150);
  const bookingsByUser = getBookingsByUser();
  const existingBookings = bookingsByUser[userId] || [];
  bookingsByUser[userId] = [booking, ...existingBookings];
  saveBookingsByUser(bookingsByUser);
  return bookingsByUser[userId];
};

// ── Internal util ────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));