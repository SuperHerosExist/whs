import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Set auth persistence to local storage for better cross-browser support
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('[Firebase Auth] Failed to set persistence:', error);
});

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('[Firestore] Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('[Firestore] The current browser does not support offline persistence.');
  }
});

// Ensure Firestore network is enabled
enableNetwork(db).catch((error) => {
  console.error('[Firestore] Failed to enable network:', error);
});

export default app;
