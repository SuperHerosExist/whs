/**
 * Stats App Firebase Connection
 *
 * This file provides READ-ONLY access to the Stats app database (bowlingstatstracker)
 * where all bowling statistics, player data, and game records are stored.
 *
 * DO NOT use this for authentication or writes - it's for reading stats only!
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const statsFirebaseConfig = {
  apiKey: import.meta.env.VITE_STATS_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_STATS_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_STATS_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STATS_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_STATS_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_STATS_FIREBASE_APP_ID,
};

// Initialize a separate Firebase app instance for Stats
// Using a named instance 'stats' to avoid conflicts with main Firebase app
const statsApp = initializeApp(statsFirebaseConfig, 'stats');

// Export Firestore instance for querying Stats app data
export const statsDb = getFirestore(statsApp);

// Export team and program IDs for filtering
export const STATS_PROGRAM_ID = import.meta.env.VITE_STATS_PROGRAM_ID || 'willard-hs';
export const STATS_TEAM_ID = import.meta.env.VITE_STATS_TEAM_ID || 'MpyIVpCIsFSyqEdPID1O';

export default statsApp;
