/**
 * Seed Script - Populate Willard Tigers Bowling Database
 * Creates coach account, player profiles, and initial data
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sample player data - Willard Tigers Bowling Team
const samplePlayers = [
  { name: 'Alex Johnson', grade: '12', averageScore: 215, highGame: 289, gamesPlayed: 24, email: 'alex.johnson@willard.edu' },
  { name: 'Sarah Williams', grade: '11', averageScore: 198, highGame: 267, gamesPlayed: 22, email: 'sarah.williams@willard.edu' },
  { name: 'Mike Chen', grade: '12', averageScore: 205, highGame: 278, gamesPlayed: 26, email: 'mike.chen@willard.edu' },
  { name: 'Emily Rodriguez', grade: '10', averageScore: 192, highGame: 256, gamesPlayed: 20, email: 'emily.rodriguez@willard.edu' },
  { name: 'Josh Martinez', grade: '11', averageScore: 210, highGame: 280, gamesPlayed: 25, email: 'josh.martinez@willard.edu' },
  { name: 'Rachel Kim', grade: '12', averageScore: 203, highGame: 268, gamesPlayed: 23, email: 'rachel.kim@willard.edu' },
  { name: 'Tyler Brooks', grade: '10', averageScore: 188, highGame: 245, gamesPlayed: 18, email: 'tyler.brooks@willard.edu' },
  { name: 'Madison Taylor', grade: '11', averageScore: 195, highGame: 259, gamesPlayed: 21, email: 'madison.taylor@willard.edu' },
  { name: 'Chris Anderson', grade: '12', averageScore: 208, highGame: 275, gamesPlayed: 27, email: 'chris.anderson@willard.edu' },
  { name: 'Jessica Lee', grade: '9', averageScore: 178, highGame: 232, gamesPlayed: 15, email: 'jessica.lee@willard.edu' },
  { name: 'Brandon Smith', grade: '10', averageScore: 190, highGame: 251, gamesPlayed: 19, email: 'brandon.smith@willard.edu' },
  { name: 'Ashley Davis', grade: '11', averageScore: 201, highGame: 264, gamesPlayed: 24, email: 'ashley.davis@willard.edu' },
];

async function seedDatabase() {
  console.log('🎳 Starting Willard Tigers Bowling Database Seed...\n');

  try {
    // Step 1: Create Coach Account
    console.log('📋 Step 1: Creating Coach Account...');
    const coachEmail = 'coach@willardtigers.com';
    const coachPassword = 'TigerBowling2025!';

    let coachUser;
    try {
      coachUser = await createUserWithEmailAndPassword(auth, coachEmail, coachPassword);
      console.log(`✅ Coach account created: ${coachEmail}`);
      console.log(`   UID: ${coachUser.user.uid}`);
      console.log(`   Password: ${coachPassword}`);
      console.log(`   ⚠️  SAVE THESE CREDENTIALS!\n`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  Coach account already exists: ${coachEmail}\n`);
      } else {
        throw error;
      }
    }

    // Step 2: Create Coach User Document
    if (coachUser) {
      console.log('📋 Step 2: Creating Coach User Document...');
      await setDoc(doc(db, 'users', coachUser.user.uid), {
        email: coachEmail,
        displayName: 'Coach Stevens',
        role: 'coach',
        programId: 'willard-tigers',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Coach user document created\n');
    }

    // Step 3: Create Player Accounts & Profiles
    console.log('📋 Step 3: Creating Player Accounts & Profiles...');
    let playerCount = 0;

    for (const playerData of samplePlayers) {
      try {
        // Create auth account for player
        const playerPassword = 'Tiger2025!';
        let playerUser;

        try {
          playerUser = await createUserWithEmailAndPassword(auth, playerData.email, playerPassword);
          console.log(`   ✅ Player created: ${playerData.name} (${playerData.email})`);
        } catch (error) {
          if (error.code === 'auth/email-already-in-use') {
            console.log(`   ⚠️  Player already exists: ${playerData.name}`);
            continue;
          } else {
            throw error;
          }
        }

        // Create user document
        await setDoc(doc(db, 'users', playerUser.user.uid), {
          email: playerData.email,
          displayName: playerData.name,
          role: 'player',
          programId: 'willard-tigers',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Create player profile
        await setDoc(doc(db, 'players', playerUser.user.uid), {
          uid: playerUser.user.uid,
          name: playerData.name,
          email: playerData.email,
          grade: playerData.grade,
          programId: 'willard-tigers',
          averageScore: playerData.averageScore,
          highGame: playerData.highGame,
          gamesPlayed: playerData.gamesPlayed,
          isActive: true,
          bio: `${playerData.name} is a dedicated member of the Willard Tigers Bowling Team.`,
          photoURL: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        playerCount++;
      } catch (error) {
        console.error(`   ❌ Error creating player ${playerData.name}:`, error.message);
      }
    }

    console.log(`\n✅ Created ${playerCount} players\n`);

    // Step 4: Create Sample Team Data
    console.log('📋 Step 4: Creating Sample Team Data...');

    // Create team document
    await setDoc(doc(db, 'teams', 'varsity'), {
      name: 'Varsity Tigers',
      programId: 'willard-tigers',
      season: '2024-2025',
      wins: 15,
      losses: 3,
      championships: 3,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Team document created\n');

    // Step 5: Summary
    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 DATABASE SEEDING COMPLETE!');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('📊 Summary:');
    console.log(`   - Coach Account: ${coachEmail}`);
    console.log(`   - Coach Password: ${coachPassword}`);
    console.log(`   - Players Created: ${playerCount}`);
    console.log(`   - Player Password (all): Tiger2025!\n`);
    console.log('🌐 Next Steps:');
    console.log('   1. Visit: https://willard-tigers-bowling.web.app');
    console.log(`   2. Sign in with: ${coachEmail}`);
    console.log('   3. Test the coach dashboard');
    console.log('   4. View the roster with real player data\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the seed script
seedDatabase();
