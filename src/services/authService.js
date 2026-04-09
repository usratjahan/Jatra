// ═══════════════════════════════════════════════════════════════
// FILE: src/services/authService.js
//
// Mock auth service — stores users in localStorage.
// TODO: Replace each function body with real API calls:
//   POST /api/auth/signup
//   POST /api/auth/signin
//   POST /api/auth/signout
//   GET  /api/auth/me
// ═══════════════════════════════════════════════════════════════

const USERS_KEY   = 'jatra_users';
const SESSION_KEY = 'jatra_session';
const BOOKINGS_KEY = 'jatra_bookings_by_user';
const ADMIN_BOOKINGS_KEY = 'jatra_bookings';

// ── Helpers ─────────────────────────────────────────────────────
const getUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
};

const saveUsers = (users) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

const saveSession = (user) =>
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

const clearSession = () =>
  localStorage.removeItem(SESSION_KEY);

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

// ── Public API ──────────────────────────────────────────────────

/**
 * Sign up a new user.
 * TODO: replace body with → fetch('/api/auth/signup', { method:'POST', body: JSON.stringify(data) })
 */
export const signUp = async ({ firstName , lastName, email, phone, password, role }) => {
  // TODO: uncomment for real API
  // const res = await fetch('/api/auth/signup', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ firstName, lastName, email, phone, password, role }),
  // });
  // if (!res.ok) throw new Error((await res.json()).message || 'Signup failed');
  // const user = await res.json();
  // saveSession(user);
  // return user;

  // ── MOCK ──
  await delay(600);
  const normalizedEmail = (email || '').trim().toLowerCase();
  const users = getUsers();
  if (users.find((u) => u.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }
  const newUser = {
    id: Date.now(),
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: normalizedEmail,
    phone,
    address: '',
    role,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, { ...newUser, password }]);
  const session = { ...newUser, token: `mock_token_${newUser.id}` };
  saveSession(session);
  
  return session;
};

/**
 * Sign in an existing user.
 * TODO: replace body with → fetch('/api/auth/signin', { method:'POST', body: JSON.stringify(data) })
 */
export const signIn = async ({ email, password, role }) => {
  // TODO: uncomment for real API
  // const res = await fetch('/api/auth/signin', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password, role }),
  // });
  // if (!res.ok) throw new Error((await res.json()).message || 'Signin failed');
  // const user = await res.json();
  // saveSession(user);
  // return user;

  // ── MOCK ──
  await delay(600);
  const normalizedEmail = (email || '').trim().toLowerCase();
  const users = getUsers();
  const user = users.find((u) => u.email === normalizedEmail && u.password === password);
  if (!user) throw new Error('Incorrect email or password.');
  if (user.role !== role) throw new Error(`This account is registered as ${user.role}, not ${role}.`);
  const { password: _pw, ...safeUser } = user;
  const session = { ...safeUser, token: `mock_token_${safeUser.id}` };
  saveSession(session);
  return session;
};

/**
 * Sign out the current user.
 * TODO: replace body with → fetch('/api/auth/signout', { method:'POST' })
 */
export const signOut = async () => {
  // TODO: await fetch('/api/auth/signout', { method: 'POST' });
  await delay(200);
  clearSession();
};

/**
 * Get current session from localStorage.
 * TODO: replace with → fetch('/api/auth/me') using stored token
 */
export const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
};

/**
 * Returns true if a user is logged in.
 */
export const isAuthenticated = () => !!getCurrentUser();







/**
 * Update current user's profile information.
 * Keeps users list + session in sync.
 */
export const updateMyProfile = async ({
  firstName,
  lastName,
  email,
  phone,
  address,
  newPassword,
}) => {
  await delay(300);

  const session = getCurrentUser();
  if (!session) throw new Error('No active session found.');

  const users = getUsers();
  const currentIndex = users.findIndex((u) => u.id === session.id);
  if (currentIndex < 0) throw new Error('Account not found.');

  const nextEmail = (email || '').trim().toLowerCase();
  if (!nextEmail) throw new Error('Email is required.');

  const emailTaken = users.some((u, idx) => idx !== currentIndex && u.email === nextEmail);
  if (emailTaken) throw new Error('Another account already uses this email.');

  const current = users[currentIndex];
  const nextFirstName = (firstName || '').trim();
  const nextLastName = (lastName || '').trim();

  const updatedUser = {
    ...current,
    firstName: nextFirstName,
    lastName: nextLastName,
    fullName: `${nextFirstName} ${nextLastName}`.trim(),
    email: nextEmail,
    phone: (phone || '').trim(),
    address: (address || '').trim(),
    updatedAt: new Date().toISOString(),
  };

  if (newPassword) {
    updatedUser.password = newPassword;
  }

  users[currentIndex] = updatedUser;
  saveUsers(users);

  const { password: _pw, ...safeUser } = updatedUser;
  const nextSession = {
    ...session,
    ...safeUser,
    token: session.token || `mock_token_${safeUser.id}`,
  };

  saveSession(nextSession);
  return nextSession;
};

/**
 * Returns bookings for a specific user.
 */
export const getUserBookings = async (userId) => {
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

  return fromAdmin;
};

/**
 * Append a booking into the current user's booking history.
 */
export const addBookingForUser = async (userId, booking) => {
  await delay(150);
  const bookingsByUser = getBookingsByUser();
  const existingBookings = bookingsByUser[userId] || [];
  bookingsByUser[userId] = [booking, ...existingBookings];
  saveBookingsByUser(bookingsByUser);
  return bookingsByUser[userId];
};

// ── Internal util ────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));