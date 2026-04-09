import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyB_B3rdT-6jSvrNmuz6MqZucy33paakM0A',
  authDomain: 'jatratourismplatform-dbb8d.firebaseapp.com',
  projectId: 'jatratourismplatform-dbb8d',
  storageBucket: 'jatratourismplatform-dbb8d.firebasestorage.app',
  messagingSenderId: '359873981978',
  appId: '1:359873981978:web:56e21f5b41251b53662ba3',
  measurementId: 'G-RT2ZXEXW7V',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let analytics;

if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Firebase analytics initialization failed:', error);
  }
}

export { app, auth, analytics };
