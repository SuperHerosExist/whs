/**
 * Seed Script - Add 14 Bowlers to WHS Bowling Team
 *
 * This script adds sample bowler data to the Firestore database
 * including Mila Collins and 13 other team members
 *
 * Usage: node scripts/seed-bowlers.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '..', 'serviceAccountKey.json'));

initializeApp({
  credential: cert(serviceAccount),
  projectId: 'willard-tigers-bowling'
});

const db = getFirestore();

// 14 Bowlers for Willard Tigers Bowling Team
const bowlers = [
  {
    name: 'Mila Collins',
    email: 'mila.collins@willardschools.net',
    grade: '11',
    graduationYear: 2026,
    averageScore: 160,
    highGame: 230,
    gamesPlayed: 12,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '11',
    bio: 'Passionate bowler with a focus on consistent spare shooting and lane reading.',
    photoURL: null,
  },
  {
    name: 'Alex Thompson',
    email: 'alex.thompson@willardschools.net',
    grade: '12',
    graduationYear: 2025,
    averageScore: 215,
    highGame: 289,
    gamesPlayed: 18,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '1',
    bio: 'Team captain with strong leadership skills and powerful strike ball.',
  },
  {
    name: 'Sarah Martinez',
    email: 'sarah.martinez@willardschools.net',
    grade: '11',
    graduationYear: 2026,
    averageScore: 198,
    highGame: 267,
    gamesPlayed: 15,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '7',
    bio: 'Versatile bowler known for clutch performances in tournaments.',
  },
  {
    name: 'Jordan Lee',
    email: 'jordan.lee@willardschools.net',
    grade: '10',
    graduationYear: 2027,
    averageScore: 182,
    highGame: 245,
    gamesPlayed: 10,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '10',
    bio: 'Rising star with exceptional ball speed and accuracy.',
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@willardschools.net',
    grade: '12',
    graduationYear: 2025,
    averageScore: 192,
    highGame: 256,
    gamesPlayed: 16,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '3',
    bio: 'Consistent performer with great spare conversion rate.',
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@willardschools.net',
    grade: '11',
    graduationYear: 2026,
    averageScore: 205,
    highGame: 278,
    gamesPlayed: 14,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '21',
    bio: 'Technical bowler who excels at reading oil patterns.',
  },
  {
    name: 'Rachel Kim',
    email: 'rachel.kim@willardschools.net',
    grade: '10',
    graduationYear: 2027,
    averageScore: 175,
    highGame: 238,
    gamesPlayed: 9,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '15',
    bio: 'Newcomer with natural talent and quick learning ability.',
  },
  {
    name: 'Tyler Johnson',
    email: 'tyler.johnson@willardschools.net',
    grade: '12',
    graduationYear: 2025,
    averageScore: 210,
    highGame: 280,
    gamesPlayed: 17,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '23',
    bio: 'Power bowler with high rev rate and strong pin carry.',
  },
  {
    name: 'Jessica Wang',
    email: 'jessica.wang@willardschools.net',
    grade: '11',
    graduationYear: 2026,
    averageScore: 188,
    highGame: 251,
    gamesPlayed: 13,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '8',
    bio: 'Smooth delivery with excellent ball control.',
  },
  {
    name: 'Brandon White',
    email: 'brandon.white@willardschools.net',
    grade: '9',
    graduationYear: 2028,
    averageScore: 165,
    highGame: 225,
    gamesPlayed: 8,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '9',
    bio: 'Freshman with lots of potential and enthusiasm.',
  },
  {
    name: 'Olivia Davis',
    email: 'olivia.davis@willardschools.net',
    grade: '10',
    graduationYear: 2027,
    averageScore: 195,
    highGame: 262,
    gamesPlayed: 11,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '12',
    bio: 'Accurate bowler with excellent spare shooting skills.',
  },
  {
    name: 'Ethan Brown',
    email: 'ethan.brown@willardschools.net',
    grade: '12',
    graduationYear: 2025,
    averageScore: 203,
    highGame: 268,
    gamesPlayed: 15,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '5',
    bio: 'Experienced competitor with strong mental game.',
  },
  {
    name: 'Sophia Garcia',
    email: 'sophia.garcia@willardschools.net',
    grade: '11',
    graduationYear: 2026,
    averageScore: 178,
    highGame: 241,
    gamesPlayed: 10,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '17',
    bio: 'Improving rapidly with dedication to practice.',
  },
  {
    name: 'Nathan Taylor',
    email: 'nathan.taylor@willardschools.net',
    grade: '10',
    graduationYear: 2027,
    averageScore: 186,
    highGame: 249,
    gamesPlayed: 12,
    programId: 'willard-tigers',
    isActive: true,
    jerseyNumber: '14',
    bio: 'Well-rounded bowler with strong fundamentals.',
  },
];

async function seedBowlers() {
  console.log('🎳 Starting WHS Bowling Team Seed Script...\n');

  try {
    const batch = db.batch();
    let count = 0;

    for (const bowler of bowlers) {
      // Create a document ID based on email
      const playerId = bowler.email.split('@')[0].replace(/\./g, '-');
      const playerRef = db.collection('players').doc(playerId);

      const playerData = {
        ...bowler,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      batch.set(playerRef, playerData, { merge: true });
      count++;
      console.log(`✅ Added/Updated: ${bowler.name} (Grade ${bowler.grade}) - Avg: ${bowler.averageScore}, High: ${bowler.highGame}`);
    }

    await batch.commit();

    console.log(`\n🎉 Successfully seeded ${count} bowlers to Willard Tigers Bowling Team!`);
    console.log(`\nTeam Statistics:`);
    const totalAverage = bowlers.reduce((sum, b) => sum + b.averageScore, 0) / bowlers.length;
    const highestGame = Math.max(...bowlers.map(b => b.highGame));
    const totalGames = bowlers.reduce((sum, b) => sum + b.gamesPlayed, 0);

    console.log(`  - Team Average: ${Math.round(totalAverage)}`);
    console.log(`  - Highest Game: ${highestGame}`);
    console.log(`  - Total Games Played: ${totalGames}`);
    console.log(`  - Total Players: ${bowlers.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding bowlers:', error);
    process.exit(1);
  }
}

seedBowlers();
