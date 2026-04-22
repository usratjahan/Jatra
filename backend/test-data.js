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

async function testData() {
  console.log('Testing seeded data...\n');

  // Test users
  const usersSnapshot = await db.collection('users').get();
  console.log(`Users collection: ${usersSnapshot.size} documents`);
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`- ${data.name} (${data.role}): ${doc.id}`);
  });

  // Test tours
  const toursSnapshot = await db.collection('tours').get();
  console.log(`\nTours collection: ${toursSnapshot.size} documents`);
  toursSnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`- ${data.title}: ${doc.id}`);
  });

  // Test bookings
  const bookingsSnapshot = await db.collection('bookings').get();
  console.log(`\nBookings collection: ${bookingsSnapshot.size} documents`);
  bookingsSnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`- Booking for ${data.primaryTraveler.fullName}: ${doc.id}`);
    console.log(`  User ID: ${data.userId}, Tour ID: ${data.eventId}`);
  });

  process.exit();
}

testData();