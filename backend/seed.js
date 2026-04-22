// Seed script to populate Firestore with users, agents, tours, and bookings
require('dotenv').config();
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

// Sample users data
const users = [
  {
    email: 'john.doe@example.com',
    name: 'John Doe',
    phone: '+8801712345678',
    role: 'tourist',
    address: 'Dhaka, Bangladesh',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    email: 'sarah.wilson@example.com',
    name: 'Sarah Wilson',
    phone: '+8801723456789',
    role: 'tourist',
    address: 'Chittagong, Bangladesh',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    email: 'ahmed.khan@example.com',
    name: 'Ahmed Khan',
    phone: '+8801734567890',
    role: 'tourist',
    address: 'Sylhet, Bangladesh',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    email: 'priya.sharma@example.com',
    name: 'Priya Sharma',
    phone: '+8801745678901',
    role: 'tourist',
    address: 'Khulna, Bangladesh',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    email: 'mike.johnson@example.com',
    name: 'Mike Johnson',
    phone: '+8801756789012',
    role: 'tourist',
    address: 'Rajshahi, Bangladesh',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

// Sample agents data
const agents = [
  {
    email: 'agent1@jatra.com',
    name: 'Rahul Ahmed',
    phone: '+8801611111111',
    role: 'agent',
    address: 'Dhaka, Bangladesh',
    agency: 'Dream Travels',
    license: 'AGT-2024-001',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    email: 'agent2@jatra.com',
    name: 'Fatima Begum',
    phone: '+8801622222222',
    role: 'agent',
    address: 'Chittagong, Bangladesh',
    agency: 'Coastal Adventures',
    license: 'AGT-2024-002',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    email: 'agent3@jatra.com',
    name: 'Kamal Hossain',
    phone: '+8801633333333',
    role: 'agent',
    address: 'Sylhet, Bangladesh',
    agency: 'Hill View Tours',
    license: 'AGT-2024-003',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

// Sample tours data
const tours = [
  {
    title: "Sundarbans Adventure",
    location: "Sundarbans",
    sublocation: "Khulna Division",
    price: 8500,
    priceForForeignGuests: 12000,
    capacity: 20,
    spotsLeft: 15,
    totalBooked: 5,
    totalPerson: 20,
    days: 4,
    nights: 3,
    dateFrom: "2024-10-15",
    dateTo: "2024-10-18",
    time: "09:00",
    division: "Khulna",
    community: "Family",
    description: "Experience the magical Sundarbans mangrove forest with boat safaris and wildlife spotting.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
    ],
    itinerary: [
      { day: 1, title: "Arrival & Boat Safari", description: "Arrive at Sundarbans and start boat safari" },
      { day: 2, title: "Wildlife Exploration", description: "Explore wildlife and mangrove forests" },
      { day: 3, title: "Island Visit", description: "Visit nearby islands and local villages" },
      { day: 4, title: "Departure", description: "Return journey with memories" }
    ],
    inclusions: ["Accommodation", "Meals", "Boat Safari", "Guide"],
    exclusions: ["Personal Expenses", "Travel Insurance", "Drinks"],
    disclaimer: "Weather dependent activities. Subject to change based on local conditions.",
    terms: {
      general: ["All bookings are subject to availability", "Cancellations must be made 48 hours in advance"],
      cancellationPolicy: {
        title: "Cancellation Policy",
        intro: "Cancellation charges apply as follows:",
        points: ["7+ days before: 80% refund", "3-6 days before: 50% refund", "Within 48 hours: no refund"]
      },
      liability: "Jatra is not responsible for personal injury or loss during the tour.",
      contact: "Contact us at support@jatra.com or call +880 1711-000000"
    },
    avgRating: 4.5,
    reviewCount: 25,
    reviews: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Cox's Bazar Beach Paradise",
    location: "Cox's Bazar",
    sublocation: "Chittagong Division",
    price: 6500,
    priceForForeignGuests: 9500,
    capacity: 30,
    spotsLeft: 22,
    totalBooked: 8,
    totalPerson: 30,
    days: 3,
    nights: 2,
    dateFrom: "2024-11-01",
    dateTo: "2024-11-03",
    time: "10:00",
    division: "Chittagong",
    community: "Combined",
    description: "Relax on the world's longest natural sea beach with water sports and local cuisine.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800"
    ],
    itinerary: [
      { day: 1, title: "Beach Arrival", description: "Arrive and settle in beach resort" },
      { day: 2, title: "Water Sports", description: "Enjoy jet skiing, parasailing, and beach activities" },
      { day: 3, title: "Departure", description: "Relax and depart with beach memories" }
    ],
    inclusions: ["Beach Resort", "Meals", "Water Sports", "Transport"],
    exclusions: ["International Flights", "Personal Expenses", "Alcohol"],
    disclaimer: "Beach activities depend on weather conditions.",
    terms: {
      general: ["Valid ID required for check-in", "Beach safety rules must be followed"],
      cancellationPolicy: {
        title: "Cancellation Policy",
        intro: "Cancellation charges apply as follows:",
        points: ["7+ days before: 80% refund", "3-6 days before: 50% refund", "Within 48 hours: no refund"]
      },
      liability: "Jatra is not responsible for accidents during water sports.",
      contact: "Contact us at support@jatra.com or call +880 1711-000000"
    },
    avgRating: 4.3,
    reviewCount: 42,
    reviews: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Sylhet Tea Gardens & Hills",
    location: "Sylhet",
    sublocation: "Sylhet Division",
    price: 7200,
    priceForForeignGuests: 10500,
    capacity: 25,
    spotsLeft: 18,
    totalBooked: 7,
    totalPerson: 25,
    days: 4,
    nights: 3,
    dateFrom: "2024-12-01",
    dateTo: "2024-12-04",
    time: "08:00",
    division: "Sylhet",
    community: "Family",
    description: "Explore the breathtaking tea gardens, waterfalls, and hill tracts of Sylhet.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
    ],
    itinerary: [
      { day: 1, title: "Sylhet Arrival", description: "Arrive in Sylhet and visit local attractions" },
      { day: 2, title: "Tea Gardens", description: "Explore tea plantations and factories" },
      { day: 3, title: "Waterfalls & Hills", description: "Visit Jaflong, Bisnakandi, and Ratargul" },
      { day: 4, title: "Departure", description: "Return with hill station memories" }
    ],
    inclusions: ["Hotel Accommodation", "Meals", "Local Transport", "Guide"],
    exclusions: ["Airfare", "Personal Expenses", "Entry Fees"],
    disclaimer: "Some areas may be inaccessible during monsoon season.",
    terms: {
      general: ["Comfortable walking shoes recommended", "Weather-appropriate clothing advised"],
      cancellationPolicy: {
        title: "Cancellation Policy",
        intro: "Cancellation charges apply as follows:",
        points: ["7+ days before: 80% refund", "3-6 days before: 50% refund", "Within 48 hours: no refund"]
      },
      liability: "Jatra is not responsible for weather-related cancellations.",
      contact: "Contact us at support@jatra.com or call +880 1711-000000"
    },
    avgRating: 4.7,
    reviewCount: 38,
    reviews: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Bandarban Hill Adventure",
    location: "Bandarban",
    sublocation: "Chittagong Division",
    price: 7800,
    priceForForeignGuests: 11000,
    capacity: 15,
    spotsLeft: 12,
    totalBooked: 3,
    totalPerson: 15,
    days: 3,
    nights: 2,
    dateFrom: "2024-11-10",
    dateTo: "2024-11-12",
    time: "07:00",
    division: "Chittagong",
    community: "Male",
    description: "Trek through the misty hills of Bandarban with breathtaking views and tribal culture.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
    ],
    itinerary: [
      { day: 1, title: "Bandarban Arrival", description: "Arrive and start hill trekking" },
      { day: 2, title: "Tribal Village Visit", description: "Visit local tribal communities" },
      { day: 3, title: "Departure", description: "Return with hill memories" }
    ],
    inclusions: ["Mountain Lodge", "Meals", "Guide", "Transport"],
    exclusions: ["Personal Expenses", "Entry Fees", "Drinks"],
    disclaimer: "Trekking requires good physical fitness.",
    terms: {
      general: ["Comfortable trekking shoes required", "Weather-appropriate clothing advised"],
      cancellationPolicy: {
        title: "Cancellation Policy",
        intro: "Cancellation charges apply as follows:",
        points: ["7+ days before: 80% refund", "3-6 days before: 50% refund", "Within 48 hours: no refund"]
      },
      liability: "Jatra is not responsible for trekking accidents.",
      contact: "Contact us at support@jatra.com or call +880 1711-000000"
    },
    avgRating: 4.6,
    reviewCount: 31,
    reviews: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Rangamati Lake Paradise",
    location: "Rangamati",
    sublocation: "Chittagong Division",
    price: 6200,
    priceForForeignGuests: 8800,
    capacity: 18,
    spotsLeft: 14,
    totalBooked: 4,
    totalPerson: 18,
    days: 2,
    nights: 1,
    dateFrom: "2024-12-15",
    dateTo: "2024-12-16",
    time: "08:00",
    division: "Chittagong",
    community: "Male",
    description: "Boat ride on Kaptai Lake with stunning views and local tribal culture.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
    ],
    itinerary: [
      { day: 1, title: "Lake Arrival", description: "Arrive and start boat journey" },
      { day: 2, title: "Tribal Culture", description: "Experience local culture and cuisine" }
    ],
    inclusions: ["Lake Resort", "Boat Ride", "Meals", "Guide"],
    exclusions: ["Personal Expenses", "Entry Fees", "Alcohol"],
    disclaimer: "Boat rides depend on weather conditions.",
    terms: {
      general: ["Life jackets provided", "Swimming skills recommended"],
      cancellationPolicy: {
        title: "Cancellation Policy",
        intro: "Cancellation charges apply as follows:",
        points: ["7+ days before: 80% refund", "3-6 days before: 50% refund", "Within 48 hours: no refund"]
      },
      liability: "Jatra is not responsible for water accidents.",
      contact: "Contact us at support@jatra.com or call +880 1711-000000"
    },
    avgRating: 4.4,
    reviewCount: 28,
    reviews: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

// Sample bookings data
const bookings = [
  {
    eventId: "tour-1", // Will be updated with actual tour ID after seeding
    userId: "user-1", // Will be updated with actual user ID after seeding
    travelers: 2,
    primaryTraveler: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+8801712345678",
      address: "Dhaka, Bangladesh",
      nidNo: "1234567890123",
      emergencyContact: "Jane Doe",
      emergencyRelationship: "Wife",
      whatsappNo: "+8801712345678"
    },
    additionalTravelers: [
      {
        fullName: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "+8801712345679",
        address: "Dhaka, Bangladesh",
        nidNo: "1234567890124",
        emergencyContact: "John Doe",
        emergencyRelationship: "Husband",
        whatsappNo: "+8801712345679"
      }
    ],
    emergencyContact: "Jane Doe",
    emergencyRelationship: "Wife",
    paymentMethod: "bkash",
    totalAmount: 17000, // 2 travelers * 8500
    priceType: "local",
    status: "confirmed",
    tourSnapshot: {
      title: "Sundarbans Adventure",
      location: "Sundarbans",
      dateFrom: "2024-10-15",
      dateTo: "2024-10-18"
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    eventId: "tour-2", // Will be updated with actual tour ID after seeding
    userId: "user-2", // Will be updated with actual user ID after seeding
    travelers: 1,
    primaryTraveler: {
      fullName: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      phone: "+8801723456789",
      address: "Chittagong, Bangladesh",
      nidNo: "2345678901234",
      emergencyContact: "Mike Wilson",
      emergencyRelationship: "Brother",
      whatsappNo: "+8801723456789"
    },
    additionalTravelers: [],
    emergencyContact: "Mike Wilson",
    emergencyRelationship: "Brother",
    paymentMethod: "card",
    totalAmount: 6500,
    priceType: "local",
    status: "confirmed",
    tourSnapshot: {
      title: "Cox's Bazar Beach Paradise",
      location: "Cox's Bazar",
      dateFrom: "2024-11-01",
      dateTo: "2024-11-03"
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    eventId: "tour-3", // Will be updated with actual tour ID after seeding
    userId: "user-3", // Will be updated with actual user ID after seeding
    travelers: 3,
    primaryTraveler: {
      fullName: "Ahmed Khan",
      email: "ahmed.khan@example.com",
      phone: "+8801734567890",
      address: "Sylhet, Bangladesh",
      nidNo: "3456789012345",
      emergencyContact: "Fatima Khan",
      emergencyRelationship: "Sister",
      whatsappNo: "+8801734567890"
    },
    additionalTravelers: [
      {
        fullName: "Fatima Khan",
        email: "fatima.khan@example.com",
        phone: "+8801734567891",
        address: "Sylhet, Bangladesh",
        nidNo: "3456789012346",
        emergencyContact: "Ahmed Khan",
        emergencyRelationship: "Brother",
        whatsappNo: "+8801734567891"
      },
      {
        fullName: "Omar Khan",
        email: "omar.khan@example.com",
        phone: "+8801734567892",
        address: "Sylhet, Bangladesh",
        nidNo: "3456789012347",
        emergencyContact: "Ahmed Khan",
        emergencyRelationship: "Father",
        whatsappNo: "+8801734567892"
      }
    ],
    emergencyContact: "Fatima Khan",
    emergencyRelationship: "Sister",
    paymentMethod: "bkash",
    totalAmount: 21600, // 3 travelers * 7200
    priceType: "local",
    status: "pending",
    tourSnapshot: {
      title: "Sylhet Tea Gardens & Hills",
      location: "Sylhet",
      dateFrom: "2024-12-01",
      dateTo: "2024-12-04"
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

async function seedUsers() {
  console.log('Seeding users...');
  const userRefs = [];
  for (const user of users) {
    const docRef = await db.collection('users').add(user);
    userRefs.push({ id: docRef.id, ...user });
    console.log(`Added user: ${user.name}`);
  }
  return userRefs;
}

async function seedAgents() {
  console.log('Seeding agents...');
  const agentRefs = [];
  for (const agent of agents) {
    const docRef = await db.collection('users').add(agent); // Agents also go in users collection with role: 'agent'
    agentRefs.push({ id: docRef.id, ...agent });
    console.log(`Added agent: ${agent.name}`);
  }
  return agentRefs;
}

async function seedTours() {
  console.log('Seeding tours...');
  const tourRefs = [];
  for (const tour of tours) {
    const docRef = await db.collection('tours').add(tour);
    tourRefs.push({ id: docRef.id, ...tour });
    console.log(`Added tour: ${tour.title}`);
  }
  return tourRefs;
}

async function seedBookings(userRefs, tourRefs) {
  console.log('Seeding bookings...');
  const bookingRefs = [];

  // Map the placeholder IDs to actual Firestore IDs
  const userIdMap = {};
  const tourIdMap = {};

  userRefs.forEach((user, index) => {
    userIdMap[`user-${index + 1}`] = user.id;
  });

  tourRefs.forEach((tour, index) => {
    tourIdMap[`tour-${index + 1}`] = tour.id;
  });

  for (const booking of bookings) {
    const updatedBooking = {
      ...booking,
      userId: userIdMap[booking.userId] || booking.userId,
      eventId: tourIdMap[booking.eventId] || booking.eventId,
    };

    const docRef = await db.collection('bookings').add(updatedBooking);
    bookingRefs.push({ id: docRef.id, ...updatedBooking });
    console.log(`Added booking for: ${updatedBooking.primaryTraveler.fullName}`);
  }

  return bookingRefs;
}

async function clearCollections() {
  console.log('Clearing existing data...');

  const collections = ['users', 'tours', 'bookings'];

  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Cleared ${snapshot.docs.length} documents from ${collectionName}`);
  }
}

async function seedAll() {
  try {
    // Clear existing data first
    await clearCollections();

    const userRefs = await seedUsers();
    const agentRefs = await seedAgents();
    const tourRefs = await seedTours();
    const bookingRefs = await seedBookings(userRefs, tourRefs);

    console.log('\nSeeding complete!');
    console.log(`Users: ${userRefs.length}`);
    console.log(`Agents: ${agentRefs.length}`);
    console.log(`Tours: ${tourRefs.length}`);
    console.log(`Bookings: ${bookingRefs.length}`);

    // Log sample IDs for testing
    console.log('\nSample IDs for testing:');
    if (userRefs.length > 0) console.log(`First user ID: ${userRefs[0].id}`);
    if (agentRefs.length > 0) console.log(`First agent ID: ${agentRefs[0].id}`);
    if (tourRefs.length > 0) console.log(`First tour ID: ${tourRefs[0].id}`);
    if (bookingRefs.length > 0) console.log(`First booking ID: ${bookingRefs[0].id}`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit();
  }
}

seedAll();