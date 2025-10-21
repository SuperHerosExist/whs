/**
 * Setup Coach Account - Create Firestore document for davesfx@gmail.com
 * This script assumes you've already signed in with Google OAuth
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Your Google Account details
const COACH_UID = 'YOUR_GOOGLE_UID_HERE'; // Will be provided after first Google sign-in
const COACH_EMAIL = 'davesfx@gmail.com';
const COACH_NAME = 'Coach Dave Stevens';

async function setupCoach() {
  console.log('🎳 Setting up Coach Account for Willard Tigers Bowling...\n');
  console.log('═══════════════════════════════════════════════════');
  console.log('IMPORTANT: Manual Setup Required');
  console.log('═══════════════════════════════════════════════════\n');

  console.log('Since you\'re using Google OAuth (davesfx@gmail.com), follow these steps:\n');

  console.log('📋 Step 1: Enable Google Sign-In');
  console.log('   1. Go to: https://console.firebase.google.com/project/willard-tigers-bowling/authentication/providers');
  console.log('   2. Click on "Google"');
  console.log('   3. Click "Enable"');
  console.log('   4. Add your email: davesfx@gmail.com to support email');
  console.log('   5. Click "Save"\n');

  console.log('📋 Step 2: Sign In to Get Your UID');
  console.log('   1. Visit: https://willard-tigers-bowling.web.app');
  console.log('   2. Click "Sign In"');
  console.log('   3. Choose "Sign in with Google"');
  console.log('   4. Select davesfx@gmail.com');
  console.log('   5. Open browser console (F12)');
  console.log('   6. Type: firebase.auth().currentUser.uid');
  console.log('   7. Copy your UID (looks like: abc123def456...)\n');

  console.log('📋 Step 3: Create Coach User Document in Firestore');
  console.log('   1. Go to: https://console.firebase.google.com/project/willard-tigers-bowling/firestore/databases/-default-/data');
  console.log('   2. Click "+ Start collection"');
  console.log('   3. Collection ID: users');
  console.log('   4. Document ID: (paste your UID from step 2)');
  console.log('   5. Add these fields:');
  console.log('      - email (string): davesfx@gmail.com');
  console.log('      - displayName (string): Coach Dave Stevens');
  console.log('      - role (string): coach');
  console.log('      - programId (string): willard-tigers');
  console.log('      - createdAt (timestamp): (click "timestamp" and set to now)');
  console.log('      - updatedAt (timestamp): (click "timestamp" and set to now)');
  console.log('   6. Click "Save"\n');

  console.log('═══════════════════════════════════════════════════');
  console.log('✅ After completing these steps, you can:');
  console.log('═══════════════════════════════════════════════════\n');
  console.log('   - Sign in with Google at: https://willard-tigers-bowling.web.app');
  console.log('   - Access the Coach Dashboard');
  console.log('   - Add/edit players');
  console.log('   - Manage the team\n');

  console.log('💡 TIP: Run "node scripts/seed-players.js" after this to add sample players\n');
}

setupCoach();
