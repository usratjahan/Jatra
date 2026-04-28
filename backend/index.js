const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const admin = require('firebase-admin');

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

// Function to save base64 images as files
const saveBase64Images = async (images) => {
  if (!images || !Array.isArray(images)) return [];

  const savedPaths = [];
  const uploadsDir = path.join(__dirname, 'uploads');

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  for (let i = 0; i < images.length; i++) {
    const imageData = images[i];
    if (typeof imageData === 'string' && imageData.startsWith('data:image/')) {
      try {
        // Extract base64 data
        const matches = imageData.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
        if (matches) {
          const extension = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');

          // Generate unique filename
          const filename = `tour-${Date.now()}-${i}.${extension}`;
          const filepath = path.join(uploadsDir, filename);

          // Save file
          fs.writeFileSync(filepath, buffer);

          // Store full URL for database
          savedPaths.push(`http://localhost:5000/uploads/${filename}`);
        }
      } catch (error) {
        console.error('Error saving image:', error);
      }
    } else if (typeof imageData === 'string' && imageData.startsWith('/uploads/')) {
      // Already a local path, convert to full URL
      savedPaths.push(`http://localhost:5000${imageData}`);
    } else if (typeof imageData === 'string' && imageData.startsWith('http://localhost:5000/uploads/')) {
      // Already a full URL, keep as is
      savedPaths.push(imageData);
    } else if (typeof imageData === 'string') {
      // External URL, keep as is
      savedPaths.push(imageData);
    }
  }

  return savedPaths;
};

const SSLCommerzPayment = require('sslcommerz-lts');

// 🔐 SSLCommerz credentials for testing
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID || "testbox";
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD || "qwerty";

// 🌐 ngrok URL for testing
const BASE_URL = process.env.BACKEND_URL || "http://localhost:5000";

const safeDoc = (doc) => {
  const data = doc.data();
  const normalized = {};

  Object.entries(data || {}).forEach(([key, value]) => {
    if (value && typeof value.toDate === 'function') {
      normalized[key] = value.toDate().toISOString();
      return;
    }
    normalized[key] = value;
  });

  return { id: doc.id, ...normalized };
};

const adminEmails = (process.env.FIREBASE_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const isAdminEmail = (email) => email && adminEmails.includes(email.toLowerCase());

const getUserProfile = async (uid) => {
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

const ensureUserProfile = async (uid, email, name) => {
  const existing = await getUserProfile(uid);
  const role = isAdminEmail(email) ? 'admin' : 'tourist';

  console.log('ensureUserProfile called for:', uid, email, '| existing:', !!existing, '| role:', role);

  if (existing) {
    if (existing.role !== 'admin' && role === 'admin') {
      await db.collection('users').doc(uid).set({ role }, { merge: true });
      return { ...existing, role };
    }
    return existing;
  }

  const profile = {
    email: email || null,
    name: name || email || '',
    role,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  console.log('Creating new user profile in Firestore:', profile);
  await db.collection('users').doc(uid).set(profile);
  console.log('User profile created successfully');
  return { id: uid, ...profile };
};

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const adminId = req.headers['x-admin-id'];
  const adminEmail = req.headers['x-admin-email'];

  console.log('verifyToken middleware called');
  console.log('Has token:', !!token);
  console.log('Has admin headers:', !!(adminId && adminEmail));
  if (adminEmail) console.log('Admin email from headers:', adminEmail);

  if (token) {
    // Firebase token verification
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('Token verified for user:', decodedToken.uid, decodedToken.email);
      const profile = await ensureUserProfile(decodedToken.uid, decodedToken.email, decodedToken.name || decodedToken.email);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email,
        role: profile.role || 'tourist',
        profile,
      };
      next();
    } catch (error) {
      console.error('Token validation failed:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  } else if (adminId && adminEmail) {
    // Local admin session (development only)
    const adminEmails = (process.env.FIREBASE_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    console.log('Checking admin email:', adminEmail.toLowerCase());
    console.log('Allowed admin emails:', adminEmails);
    
    if (adminEmails.includes(adminEmail.toLowerCase())) {
      console.log('Admin authorized');
      req.user = {
        uid: `admin-${adminId}`,
        email: adminEmail,
        name: 'Local Admin',
        role: 'admin',
        profile: { role: 'admin' },
      };
      next();
    } else {
      console.error('Admin email not in allowed list');
      res.status(403).json({ error: 'Invalid admin credentials' });
    }
  } else {
    console.warn('No authentication provided - attempting development mode');
    // In development, allow requests without auth and ensure the dev user exists.
    // This makes payment endpoints work for local testing without a Firebase token.
    const profile = await ensureUserProfile('dev-user', 'dev@localhost', 'Development User');
    req.user = {
      uid: 'dev-user',
      email: 'dev@localhost',
      name: 'Development User',
      role: profile.role || 'admin',
      profile,
    };
    next();
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: admin only' });
  }
  next();
};

const requireSelfOrAdmin = (req, res, next) => {
  if (req.user?.uid !== req.params.userId && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

app.get('/', (req, res) => {
  res.json({ message: 'Jatra Backend API' });
});

app.post('/api/auth/verify', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/signup', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, role } = req.body;
    const { uid, email } = req.user;

    console.log('Signup endpoint called for user:', uid, email);

    if (!uid || !email) {
      return res.status(400).json({ error: 'User ID and email are required' });
    }

    const userProfile = {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      phone: phone || '',
      role: role || 'tourist',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    console.log('Saving user profile to Firestore:', userProfile);
    await db.collection('users').doc(uid).set(userProfile, { merge: true });
    console.log('User profile saved successfully');
    
    res.json({ 
      success: true, 
      user: { 
        id: uid, 
        ...userProfile 
      } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:userId/emergency-contact', verifyToken, requireSelfOrAdmin, async (req, res) => {
  try {
    const { emergencyContact, emergencyRelationship, emergencyPhone } = req.body;
    const data = {
      emergencyContact: emergencyContact || null,
      emergencyRelationship: emergencyRelationship || null,
      emergencyPhone: emergencyPhone || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const userRef = db.collection('users').doc(req.params.userId);
    await userRef.set(data, { merge: true });
    const updated = await userRef.get();
    res.json(safeDoc(updated));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:userId/bookings', verifyToken, requireSelfOrAdmin, async (req, res) => {
  try {
    console.log('Fetching bookings for user:', req.params.userId);
    console.log('Authenticated user:', req.user.uid, req.user.email);
    const snapshot = await db.collection('bookings').where('userId', '==', req.params.userId).get();
    console.log('Found bookings:', snapshot.docs.length);
    const bookings = snapshot.docs.map(safeDoc);
    console.log('Bookings data:', bookings);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(safeDoc);
    res.json(users);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/bookings', verifyToken, requireAdmin, async (req, res) => {
  try {
    let query = db.collection('bookings');
    if (req.query.userId) query = query.where('userId', '==', String(req.query.userId));
    if (req.query.eventId) query = query.where('eventId', '==', String(req.query.eventId));
    const snapshot = await query.get();
    const bookings = snapshot.docs.map(safeDoc);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [usersSnapshot, toursSnapshot, bookingsSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('tours').get(),
      db.collection('bookings').get(),
    ]);

    const users = usersSnapshot.docs.map(safeDoc);
    const tours = toursSnapshot.docs.map(safeDoc);
    const bookings = bookingsSnapshot.docs.map(safeDoc);

    const activeBookings = bookings.filter((booking) =>
      !['cancelled', 'canceled'].includes(String(booking.status || '').toLowerCase())
    );

    const totalRevenue = activeBookings.reduce(
      (sum, booking) => sum + Number(booking.totalAmount || 0),
      0
    );
    const totalSales = activeBookings.length;
    const totalProfit = Math.round(totalRevenue * 0.10);

    res.json({
      totalUsers: users.length,
      totalEvents: tours.length,
      totalRevenue,
      totalSales,
      totalProfit,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/contact', verifyToken, requireAdmin, async (req, res) => {
  try {
    const contactDoc = await db.collection('settings').doc('contact').get();
    if (!contactDoc.exists) {
      // Return default contact info
      const defaultContact = {
        phone: '+880 1711-000000',
        phone2: '+880 1722-000000',
        email: 'info@jatra.com',
        email2: 'support@jatra.com',
        address: 'House 12, Road 5, Dhanmondi, Dhaka-1209',
        whatsapp: '+880 1711-000000',
        facebook: 'https://facebook.com/jatra',
        twitter: 'https://twitter.com/jatra',
        instagram: 'https://instagram.com/jatra',
        linkedin: 'https://linkedin.com/company/jatra',
      };
      res.json(defaultContact);
    } else {
      res.json(contactDoc.data());
    }
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/contact', verifyToken, requireAdmin, async (req, res) => {
  try {
    const contactData = req.body;
    await db.collection('settings').doc('contact').set(contactData, { merge: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/users/:userId', verifyToken, requireAdmin, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.params.userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    await userRef.delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events/request', verifyToken, async (req, res) => {
  try {
    const { title, venue, date, description } = req.body;
    if (!title || !venue || !date) {
      return res.status(400).json({ error: 'title, venue and date are required' });
    }

    const request = {
      title,
      venue,
      date,
      description: description || '',
      organizerId: req.user.uid,
      organizerEmail: req.user.email,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await db.collection('event_requests').add(request);
    res.json({ id: docRef.id, ...request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events/organizer/:organizerId', verifyToken, async (req, res) => {
  try {
    if (req.user.uid !== req.params.organizerId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const snapshot = await db.collection('event_requests').where('organizerId', '==', req.params.organizerId).get();
    const requests = snapshot.docs.map(safeDoc);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tours', async (req, res) => {
  try {
    const { category, priceMin, priceMax, dateFrom, dateTo, community } = req.query;
    let query = db.collection('tours');

    if (community) query = query.where('community', '==', community);
    if (category) query = query.where('category', '==', category);

    const snapshot = await query.get();
    let tours = snapshot.docs.map(safeDoc);

    if (priceMin || priceMax) {
      const min = parseNumber(priceMin, 0);
      const max = priceMax ? parseNumber(priceMax, Infinity) : Infinity;
      tours = tours.filter((tour) => {
        const price = parseNumber(tour.price, 0);
        return price >= min && price <= max;
      });
    }

    if (dateFrom || dateTo) {
      const minDate = parseDate(dateFrom);
      const maxDate = parseDate(dateTo);
      tours = tours.filter((tour) => {
        const tourFrom = parseDate(tour.dateFrom);
        const tourTo = parseDate(tour.dateTo);
        if (!tourFrom || !tourTo) return false;
        if (minDate && tourTo < minDate) return false;
        if (maxDate && tourFrom > maxDate) return false;
        return true;
      });
    }

    res.json(tours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tours/:tourId', async (req, res) => {
  try {
    const tourRef = db.collection('tours').doc(req.params.tourId);
    const tourSnap = await tourRef.get();
    if (!tourSnap.exists) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json(safeDoc(tourSnap));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Development-only endpoint for testing (no auth required)
app.post('/api/tours-dev', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'Not available in production' });
  }
  
  try {
    console.log('DEV: Creating tour with data:', { title: req.body.title, price: req.body.price });
    
    // Save images locally and get paths
    const savedImagePaths = await saveBase64Images(req.body.images);
    console.log('DEV: Saved image paths:', savedImagePaths);

    const tour = {
      ...req.body,
      images: savedImagePaths,
      image: savedImagePaths[0] || req.body.image || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('tours').add(tour);
    console.log('DEV: Tour created with ID:', docRef.id);
    res.json({ id: docRef.id, ...tour });
  } catch (error) {
    console.error('DEV: Error creating tour:', error);
    res.status(500).json({ error: error.message });
  }
});

// Main endpoint - event creation without strict admin role check
app.post('/api/tours', verifyToken, async (req, res) => {
  try {
    console.log('Creating tour with data:', { title: req.body.title, price: req.body.price, hasImages: !!req.body.images });
    console.log('User:', { uid: req.user?.uid, role: req.user?.role });
    
    // Save images locally and get paths
    const savedImagePaths = await saveBase64Images(req.body.images);
    console.log('Saved image paths:', savedImagePaths);

    const tour = {
      ...req.body,
      images: savedImagePaths,
      image: savedImagePaths[0] || req.body.image || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('tours').add(tour);
    console.log('Tour created with ID:', docRef.id);
    res.json({ id: docRef.id, ...tour });
  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tours/:tourId', verifyToken, async (req, res) => {
  try {
    const tourRef = db.collection('tours').doc(req.params.tourId);
    const tourSnap = await tourRef.get();
    if (!tourSnap.exists) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    // Save images locally and get paths
    const savedImagePaths = await saveBase64Images(req.body.images);

    const updateData = {
      ...req.body,
      images: savedImagePaths,
      image: savedImagePaths[0] || req.body.image || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await tourRef.set(updateData, { merge: true });
    const updated = await tourRef.get();
    res.json(safeDoc(updated));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tours/:tourId', verifyToken, async (req, res) => {
  try {
    const tourRef = db.collection('tours').doc(req.params.tourId);
    const tourSnap = await tourRef.get();
    if (!tourSnap.exists) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    await tourRef.delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', verifyToken, async (req, res) => {
  try {
    const booking = {
      ...req.body,
      userId: req.user.uid,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await db.collection('bookings').add(booking);
    res.json({ id: docRef.id, ...booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/bookings/:bookingId', verifyToken, requireAdmin, async (req, res) => {
  try {
    const bookingRef = db.collection('bookings').doc(req.params.bookingId);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updateData = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await bookingRef.set(updateData, { merge: true });
    const updated = await bookingRef.get();
    res.json(safeDoc(updated));
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bookings/:bookingId', verifyToken, requireAdmin, async (req, res) => {
  try {
    const bookingRef = db.collection('bookings').doc(req.params.bookingId);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await bookingRef.delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings/:bookingId/travelers', verifyToken, requireAdmin, async (req, res) => {
  try {
    const bookingRef = db.collection('bookings').doc(req.params.bookingId);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = safeDoc(bookingSnap);
    const currentTravelers = Array.isArray(booking.additionalTravelers) ? booking.additionalTravelers : [];
    const newTraveler = {
      ...req.body,
      id: `${Date.now()}`,
    };

    await bookingRef.set({
      additionalTravelers: [...currentTravelers, newTraveler],
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    res.json({ success: true, traveler: newTraveler });
  } catch (error) {
    console.error('Error adding additional traveler:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bookings/:bookingId/travelers/:travelerId', verifyToken, requireAdmin, async (req, res) => {
  try {
    const bookingRef = db.collection('bookings').doc(req.params.bookingId);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = safeDoc(bookingSnap);
    const updatedTravelers = (booking.additionalTravelers || []).filter(
      (traveler) => String(traveler.id) !== String(req.params.travelerId)
    );

    await bookingRef.set({
      additionalTravelers: updatedTravelers,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    res.json({ success: true, additionalTravelers: updatedTravelers });
  } catch (error) {
    console.error('Error removing additional traveler:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings/book-tour', verifyToken, async (req, res) => {
  try {
    console.log('Creating booking for user:', req.user.uid);
    const {
      eventId,
      travelers = 1,
      primaryTraveler,
      additionalTravelers = [],
      emergencyContact,
      emergencyRelationship,
      paymentMethod,
      totalAmount,
      priceType,
    } = req.body;

    console.log('Booking data:', { eventId, travelers, paymentMethod, totalAmount });

    if (!eventId || !primaryTraveler) {
      return res.status(400).json({ error: 'eventId and primaryTraveler are required' });
    }

    const tourRef = db.collection('tours').doc(String(eventId));
    const tourSnap = await tourRef.get();
    if (!tourSnap.exists) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    const tour = tourSnap.data();
    const capacity = parseNumber(tour.capacity, 0);
    const bookingsSnapshot = await db.collection('bookings').where('eventId', '==', String(eventId)).get();
    const bookedCount = bookingsSnapshot.docs.reduce((sum, doc) => sum + parseNumber(doc.data().travelers, 0), 0);

    if (bookedCount + travelers > capacity) {
      return res.status(400).json({
        error: 'Not enough seats available',
        available: Math.max(capacity - bookedCount, 0),
      });
    }

    const booking = {
      eventId: String(eventId),
      userId: req.user.uid,
      travelers,
      primaryTraveler,
      additionalTravelers,
      emergencyContact: emergencyContact || null,
      emergencyRelationship: emergencyRelationship || null,
      paymentMethod: paymentMethod || null,
      totalAmount: parseNumber(totalAmount, 0),
      priceType: priceType || 'local',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      tourSnapshot: {
        title: tour.title || '',
        location: tour.location || tour.destination || '',
        dateFrom: tour.dateFrom || '',
        dateTo: tour.dateTo || '',
        image: tour.image || (tour.images && tour.images.length ? tour.images[0] : ''),
      },
    };

    const docRef = await db.collection('bookings').add(booking);
    console.log('Booking created with ID:', docRef.id);
    res.json({ id: docRef.id, ...booking });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookings/:bookingId/confirmation', verifyToken, async (req, res) => {
  try {
    const bookingRef = db.collection('bookings').doc(req.params.bookingId);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingSnap.data();
    if (booking.userId !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const paymentsSnapshot = await db.collection('payments').where('bookingId', '==', req.params.bookingId).get();
    const payments = paymentsSnapshot.docs.map(safeDoc);
    res.json({ id: bookingSnap.id, ...booking, payments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payments', verifyToken, async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body;
    if (!bookingId || !amount || !method) {
      return res.status(400).json({ error: 'bookingId, amount and method are required' });
    }

    // Get booking details
    const bookingRef = db.collection('bookings').doc(bookingId);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    const booking = bookingSnap.data();

    // Get user details
    const userRef = db.collection('users').doc(booking.userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userSnap.data();

    // SSLCommerz configuration
    console.log('SSLCommerz config:', {
      storeId: process.env.SSLCOMMERZ_STORE_ID,
      storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD,
      isSandbox: process.env.SSLCOMMERZ_IS_SANDBOX
    });
    const sslcommerz = new SSLCommerzPayment(
      process.env.SSLCOMMERZ_STORE_ID,
      process.env.SSLCOMMERZ_STORE_PASSWORD,
      process.env.SSLCOMMERZ_IS_SANDBOX === 'true'
    );

    // Prepare SSLCommerz data
    const data = {
      total_amount: parseNumber(amount, 0),
      currency: 'BDT',
      tran_id: `JTR-${bookingId}-${Date.now()}`,
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?booking_id=${bookingId}`,
      fail_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/fail?booking_id=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel?booking_id=${bookingId}`,
      ipn_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/webhook`,
      shipping_method: 'NO',
      product_name: booking.tourSnapshot?.title || 'Tour Booking',
      product_category: 'Tour',
      product_profile: 'general',
      cus_name: user.name || user.fullName,
      cus_email: user.email,
      cus_add1: user.address,
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: user.phone,
      ship_name: user.name || user.fullName,
      ship_add1: user.address,
      ship_city: 'Dhaka',
      ship_country: 'Bangladesh',
      ship_phone: user.phone,
      value_a: bookingId, // Store booking ID for webhook
      value_b: method, // Store payment method
    };

    // Initiate SSLCommerz payment
    console.log('Initiating SSLCommerz payment for booking:', bookingId);
    let response;
    try {
      response = await sslcommerz.init(data);
      console.log('SSLCommerz response:', response);
    } catch (sslError) {
      console.error('SSLCommerz init error:', sslError);
      return res.status(500).json({ error: 'Payment gateway error', details: sslError.message });
    }

    if (response.GatewayPageURL) {
      console.log('SSLCommerz gateway URL:', response.GatewayPageURL);
      // Create payment record
      const payment = {
        bookingId,
        userId: booking.userId,
        customerEmail: user.email,
        amount: parseNumber(amount, 0),
        method,
        status: 'initiated',
        gateway: 'sslcommerz',
        transactionId: data.tran_id,
        sslcommerz_sessionkey: response.sessionkey,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await db.collection('payments').add(payment);
      await db.collection('bookings').doc(bookingId).update({
        paymentStatus: 'initiated',
        paymentMethod: method,
        paymentTransactionId: data.tran_id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.json({
        id: docRef.id,
        gateway_url: response.GatewayPageURL,
        sessionkey: response.sessionkey,
        ...payment
      });
    } else {
      console.error('SSLCommerz did not return GatewayPageURL:', response);
      return res.status(500).json({
        error: 'Payment initiation failed - no GatewayPageURL',
        response
      });
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payments/webhook', async (req, res) => {
  try {
    const {
      tran_id,
      val_id,
      amount,
      card_type,
      store_amount,
      card_no,
      bank_tran_id,
      status,
      tran_date,
      currency,
      card_issuer,
      card_brand,
      card_issuer_country,
      card_issuer_country_code,
      store_id,
      verify_sign,
      verify_key,
      risk_level,
      risk_title,
      value_a, // bookingId
      value_b, // payment method
    } = req.body;

    if (!tran_id || !status) {
      return res.status(400).json({ error: 'tran_id and status are required' });
    }

    const bookingId = value_a;
    if (!bookingId) {
      return res.status(400).json({ error: 'bookingId not found in payment data' });
    }

    // Verify payment with SSLCommerz
    const sslcommerz = new SSLCommerzPayment(
      process.env.SSLCOMMERZ_STORE_ID,
      process.env.SSLCOMMERZ_STORE_PASSWORD,
      process.env.SSLCOMMERZ_IS_SANDBOX === 'true'
    );

    const validationResponse = await sslcommerz.validate({ val_id });

    let paymentStatus = 'failed';
    let bookingStatus = 'pending';

    if (validationResponse.status === 'VALID' || validationResponse.status === 'VALIDATED') {
      paymentStatus = 'success';
      bookingStatus = 'confirmed';
    } else if (status === 'FAILED') {
      paymentStatus = 'failed';
      bookingStatus = 'cancelled';
    } else if (status === 'CANCELLED') {
      paymentStatus = 'cancelled';
      bookingStatus = 'cancelled';
    }

    // Create payment record
    const payment = {
      bookingId,
      transactionId: tran_id,
      amount: parseNumber(amount, 0),
      method: value_b || 'sslcommerz',
      status: paymentStatus,
      gateway: 'sslcommerz',
      sslcommerz_data: {
        val_id,
        bank_tran_id,
        card_type,
        card_brand,
        card_issuer,
        tran_date,
        currency,
        risk_level,
        risk_title,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('payments').add(payment);

    // Update booking status
    await db.collection('bookings').doc(bookingId).update({
      paymentStatus: paymentStatus,
      paymentTransactionId: tran_id,
      status: bookingStatus,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      status: paymentStatus,
      booking_status: bookingStatus
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/events/:eventId/approve', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { approved, reason } = req.body;
    const eventReqRef = db.collection('event_requests').doc(req.params.eventId);
    const eventReqSnap = await eventReqRef.get();
    if (!eventReqSnap.exists) {
      return res.status(404).json({ error: 'Event request not found' });
    }

    const status = approved ? 'approved' : 'rejected';
    await eventReqRef.update({
      status,
      reviewedBy: req.user.uid,
      reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
      reviewReason: reason || null,
    });

    const updated = await eventReqRef.get();
    res.json(safeDoc(updated));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/referrals', verifyToken, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('referrals').get();
    const referrals = snapshot.docs.map(safeDoc);
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Simple Test Payment Route
app.get("/pay", async (req, res) => {
  const sslcommerz = new SSLCommerzPayment(STORE_ID, STORE_PASSWORD, true); // sandbox

  const data = {
    total_amount: 100,
    currency: "BDT",
    tran_id: "TXN_" + Date.now(),
    success_url: BASE_URL + "/success",
    fail_url: BASE_URL + "/fail",
    cancel_url: BASE_URL + "/cancel",
    ipn_url: BASE_URL + "/ipn",
    cus_name: "Test User",
    cus_email: "test@mail.com",
    cus_add1: "Dhaka",
    cus_phone: "01700000000",
    product_name: "DRACO Payment",
    product_category: "Service",
    product_profile: "general"
  };

  console.log('Test SSLCommerz init with:', {
    storeId: STORE_ID,
    storePassword: STORE_PASSWORD ? '***' : null,
    isSandbox: true,
    baseUrl: BASE_URL,
    data
  });

  try {
    const response = await sslcommerz.init(data);
    console.log('Test SSLCommerz response:', response);
    if (response.GatewayPageURL) {
      res.redirect(response.GatewayPageURL);
    } else {
      return res.status(500).json({
        error: 'Payment initiation failed - no GatewayPageURL',
        response,
        data
      });
    }
  } catch (error) {
    console.error("Payment init error:", error);
    res.status(500).json({
      error: "Payment initiation failed",
      message: error.message,
      stack: error.stack
    });
  }
});

// ✅ Success
app.post("/success", (req, res) => {
  console.log("SUCCESS DATA:", req.body);
  res.send("✅ Payment Successful!");
});

// ❌ Fail
app.post("/fail", (req, res) => {
  console.log("FAIL DATA:", req.body);
  res.send("❌ Payment Failed");
});

// ❌ Cancel
app.post("/cancel", (req, res) => {
  console.log("CANCEL DATA:", req.body);
  res.send("⚠️ Payment Cancelled");
});

// 🔁 IPN
app.post("/ipn", (req, res) => {
  console.log("IPN DATA:", req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
