import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration for willard-tigers-bowling project
// Note: These values are public and safe to commit to git
// Security is enforced through Firestore rules, not by hiding config
const firebaseConfig = {
  apiKey: "AIzaSyA_pNTE0M0zt8Y9fR3c8kYkK5UaAa5Hu9w",
  authDomain: "willard-tigers-bowling.firebaseapp.com",
  projectId: "willard-tigers-bowling",
  storageBucket: "willard-tigers-bowling.firebasestorage.app",
  messagingSenderId: "1008005824516",
  appId: "1:1008005824516:web:1aa0fc78e8e4ef8ae55ef9"
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
