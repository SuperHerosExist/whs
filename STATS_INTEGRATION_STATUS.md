# Stats App Integration - Current Status

## Overview

The WHS Bowling Site is configured to use **SEPARATE Firebase projects** with READ-ONLY access to the Stats app data.

## Two Firebase Projects

### 1. WHS Bowling Site (Main Project)
- **Project ID:** `willard-tigers-bowling`
- **Purpose:** Website content, user authentication, contact forms
- **Collections:**
  - `users` - User authentication profiles
  - `contactSubmissions` - Join team inquiries
  - `publicContent` - News and announcements
  - `schedules` - Event calendar

### 2. Stats App (Separate Project)
- **Project ID:** `bowlingstatstracker`
- **Purpose:** Bowling statistics, game tracking, player data
- **Collections:**
  - `players` - Player profiles with bowling stats
  - `games` - Individual game records
  - `sessions` - Practice/match sessions
  - `frames` - Frame-by-frame data
  - `teams` - Team rosters

## Integration Approach: Read-Only Access

The current implementation uses **separate Firebase instances**, NOT the shared project approach described in STATS_APP_INTEGRATION.md.

### Environment Variables (.env)
```env
# WHS Site Database (willard-tigers-bowling)
VITE_FIREBASE_PROJECT_ID=willard-tigers-bowling
VITE_FIREBASE_API_KEY=AIzaSyCRT4Issh5sk4x0_LJAn3TQoE2IpkbUiZ0
# ... etc

# Stats App Database (READ-ONLY - bowlingstatstracker)
VITE_STATS_FIREBASE_PROJECT_ID=bowlingstatstracker
VITE_STATS_FIREBASE_API_KEY=AIzaSyCfC8OCLdjuWVEy4_KM3CvVWZu9ScuMB1Y
# ... etc

# Filter to only show Willard Tigers data
VITE_STATS_PROGRAM_ID=willard-hs
VITE_STATS_TEAM_ID=MpyIVpCIsFSyqEdPID1O
```

## Current Implementation Issue

**The Roster and Stats pages are currently querying the WRONG database!**

### Files That Need to Be Updated:
1. `src/pages/Roster.tsx` - Currently queries `willard-tigers-bowling` project
2. `src/pages/Stats.tsx` - Currently queries `willard-tigers-bowling` project

They SHOULD be querying the `bowlingstatstracker` project to get real bowling data.

## How to Fix Stats Integration

### Option 1: Create Dual Firebase Instance (Recommended)

Create a second Firebase instance for read-only access to the Stats app:

```typescript
// src/lib/statsFirebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const statsConfig = {
  apiKey: import.meta.env.VITE_STATS_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_STATS_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_STATS_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STATS_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_STATS_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_STATS_FIREBASE_APP_ID,
};

// Initialize separate Firebase app for Stats
const statsApp = initializeApp(statsConfig, 'stats');

// Export Firestore instance for Stats data
export const statsDb = getFirestore(statsApp);
```

### Option 2: Switch to Shared Project

Move to a single Firebase project where both apps write/read the same collections. This requires:
1. Deploy both WHS Site and Stats app to same Firebase project
2. Update security rules to allow both apps
3. Update both `.env` files to use same project ID

## What's Currently Working

✅ **Desktop Layout** - Fixed centering and full-width utilization
✅ **Contact Form** - Writes to `willard-tigers-bowling` project
✅ **User Authentication** - Works with `willard-tigers-bowling` project
✅ **Profile Updates** - Grade field optional for coaches
✅ **Build Process** - Compiles successfully

## What Needs Data

❌ **Roster Page** - Needs to read from Stats app `players` collection
❌ **Stats Page** - Needs to read from Stats app `games`/`sessions` collections
❌ **Live Stats** - Needs real-time data from Stats app

## Next Steps

### If Using Separate Projects (Current Setup):

1. **Create** `src/lib/statsFirebase.ts` with Stats app connection
2. **Update** `src/pages/Roster.tsx` to import `statsDb` instead of `db`
3. **Update** `src/pages/Stats.tsx` to import `statsDb` instead of `db`
4. **Filter** by `VITE_STATS_TEAM_ID` to show only Willard Tigers

### If Switching to Shared Project:

1. **Deploy Stats app** to `willard-tigers-bowling` project
2. **Update** security rules to allow both apps
3. **Remove** separate Stats Firebase config
4. **Update** both apps to use same project

## Security Considerations

### For Separate Projects (Current):
- Stats app Firestore rules must allow **public read access** for player data
- WHS Site has NO write access to Stats data
- Authentication is separate between apps

### For Shared Project:
- Single set of Firestore rules for both apps
- Both apps share authentication
- Need careful rule design to prevent conflicts

## Testing the Integration

Once the Stats connection is configured:

```bash
# 1. Start dev server
npm run dev

# 2. Visit Roster page
http://localhost:5173/roster

# 3. Should display players from bowlingstatstracker project
# Filtered by: teams/{VITE_STATS_TEAM_ID}/players

# 4. Visit Stats page
http://localhost:5173/stats

# 5. Should show:
# - Team average
# - High games
# - Total games
# - Top performers
```

## Expected Data Structure in Stats App

```javascript
// bowlingstatstracker/teams/{teamId}/players/{playerId}
{
  name: "Mila Collins",
  average: 160,
  highGame: 230,
  gamesPlayed: 12,
  // ... other stats from Stats app
}

// bowlingstatstracker/games/{gameId}
{
  playerId: "...",
  teamId: "MpyIVpCIsFSyqEdPID1O",
  score: 187,
  date: Timestamp,
  // ... frame data
}
```

## Summary

**Current State:**
The WHS Site is set up with SEPARATE Firebase projects but the Roster/Stats pages are querying the WRONG database (willard-tigers-bowling instead of bowlingstatstracker).

**What Was Fixed:**
✅ Desktop layout centering
✅ Profile update (grade optional for coaches)
✅ Build process
✅ Contact form functionality

**What Still Needs Work:**
❌ Roster/Stats pages need to query bowlingstatstracker project
❌ May need to create statsFirebase.ts for separate connection
❌ OR switch to shared project approach

**Recommendation:**
Create `src/lib/statsFirebase.ts` and update Roster/Stats pages to use it. This maintains separation while allowing read access to Stats app data.
