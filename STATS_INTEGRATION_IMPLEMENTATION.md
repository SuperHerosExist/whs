# Stats Integration Implementation Guide

## Overview
This document describes the **implemented** stats integration solution for the Willard Tigers Bowling site using **Option 4: Public Stats Collection** with scheduled Cloud Functions.

## Implementation Summary

### What Was Implemented

1. **Public Stats Collection** (`publicStats` in Firestore)
   - World-readable (no authentication required)
   - Contains aggregated team and player statistics
   - Updated daily at 2 AM Central Time

2. **Cloud Functions** (3 functions)
   - `updatePublicStats` - Scheduled function (daily at 2 AM)
   - `triggerPublicStatsUpdate` - Manual trigger endpoint (HTTP)
   - `getPublicStats` - Public API to fetch stats (HTTP)

3. **Security Rules**
   - Added `publicStats` collection with public read access
   - Write access restricted to Cloud Functions only (via Admin SDK)

4. **Firebase Functions Infrastructure**
   - TypeScript-based Cloud Functions
   - Node.js 20 runtime
   - Automatic build on deploy

## Architecture

```
┌─────────────────┐
│   Stats App     │ (Separate app)
│  (writes data)  │
└────────┬────────┘
         │ writes
         ▼
┌─────────────────────────────────┐
│      Firestore Database         │
│                                 │
│  ┌──────────────────────────┐  │
│  │  players (secured)       │  │
│  │  games (secured)         │  │
│  │  sessions (secured)      │  │
│  └──────────────────────────┘  │
│           │                     │
│           │ reads               │
│           ▼                     │
│  ┌──────────────────────────┐  │
│  │ Cloud Function           │  │
│  │ updatePublicStats        │  │
│  │ (runs daily at 2 AM)     │  │
│  └──────────────────────────┘  │
│           │                     │
│           │ writes              │
│           ▼                     │
│  ┌──────────────────────────┐  │
│  │ publicStats (public)     │  │
│  │ - teamAverage            │  │
│  │ - topPlayers             │  │
│  │ - recentHighGames        │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
         │ reads (no auth!)
         ▼
┌─────────────────┐
│  WHS Site       │
│  (public)       │
└─────────────────┘
```

## Public Stats Schema

The `publicStats` collection contains documents with this structure:

```typescript
{
  programId: string;              // e.g., "willard-tigers"
  teamAverage: number;            // Team average score
  totalGames: number;             // Total games played
  topPlayers: [                   // Top 10 players (min 3 games)
    {
      name: string;               // Player name
      average: number;            // Bowling average
      highGame: number;           // High game score
      highSeries: number;         // High series score
      accolades?: string[];       // Optional accolades
      achievements?: string[];    // Optional achievements
    }
  ],
  recentHighGames: [              // Recent high games (last 30 days)
    {
      playerName: string;         // Player name
      score: number;              // Game score
      date: string;               // ISO date string
    }
  ],
  updatedAt: Timestamp;           // Last update timestamp
}
```

## Exposed Data (Public)

Based on your requirements, the following data is **public** (no auth required):

### Team Stats
- Team average
- Total games played

### Individual Player Stats
- Player name
- Bowling average
- High game
- High series
- Accolades/achievements (if added)

### Recent Activity
- Top 10 recent high games (last 30 days)
- One high game per player

## Protected Data (Not Exposed)

The following data remains **private** (authentication required):

- Individual game details (frame-by-frame)
- Practice games
- Session data
- Player UIDs
- Player email addresses
- Detailed game history
- Player-specific analytics

## Deployment Instructions

### 1. Install Function Dependencies

```bash
cd functions
npm install
```

### 2. Build Functions

```bash
cd functions
npm run build
```

### 3. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 4. Deploy Cloud Functions

```bash
firebase deploy --only functions
```

**Note**: First deployment may take 5-10 minutes as Firebase provisions the Cloud Functions infrastructure.

### 5. Verify Deployment

After deployment, you should see three functions:
- `updatePublicStats` (scheduled)
- `triggerPublicStatsUpdate` (http)
- `getPublicStats` (http)

## Usage

### Manual Trigger (For Testing)

You can manually trigger the stats update:

```bash
curl -X POST https://us-central1-willard-tigers-bowling.cloudfunctions.net/triggerPublicStatsUpdate
```

Or with a specific program:

```bash
curl -X POST "https://us-central1-willard-tigers-bowling.cloudfunctions.net/triggerPublicStatsUpdate?programId=willard-tigers"
```

### Fetch Public Stats (API)

Get public stats via HTTP:

```bash
curl https://us-central1-willard-tigers-bowling.cloudfunctions.net/getPublicStats?programId=willard-tigers
```

### Access from WHS Site (React)

#### Option A: Direct Firestore Access (Recommended)

```typescript
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Your Firebase config

async function getPublicStats() {
  const statsRef = doc(db, 'publicStats', 'willard-tigers');
  const statsSnap = await getDoc(statsRef);

  if (statsSnap.exists()) {
    return statsSnap.data();
  }
  return null;
}
```

#### Option B: HTTP API Access

```typescript
async function getPublicStats() {
  const response = await fetch(
    'https://us-central1-willard-tigers-bowling.cloudfunctions.net/getPublicStats?programId=willard-tigers'
  );

  const data = await response.json();
  return data.data; // Contains public stats
}
```

#### Option C: Real-time Updates

```typescript
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

function subscribeToPublicStats(callback: (stats: any) => void) {
  const statsRef = doc(db, 'publicStats', 'willard-tigers');

  return onSnapshot(statsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
}

// Usage
const unsubscribe = subscribeToPublicStats((stats) => {
  console.log('Updated stats:', stats);
  // Update your UI
});

// Later, cleanup
unsubscribe();
```

## Update Schedule

- **Automatic**: Daily at 2:00 AM Central Time
- **Manual**: Via HTTP trigger (see above)
- **On-demand**: Can be triggered from Firebase Console

## Monitoring

### View Function Logs

```bash
firebase functions:log --only updatePublicStats
```

Or view in Firebase Console:
1. Go to Firebase Console
2. Navigate to Functions
3. Click on function name
4. View Logs tab

### Check Last Update Time

The `updatedAt` field in the `publicStats` document shows when stats were last updated.

## Required Firestore Indexes

The Cloud Functions require these composite indexes (add to `firestore.indexes.json`):

```json
{
  "indexes": [
    {
      "collectionGroup": "games",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "programId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" },
        { "fieldPath": "score", "order": "DESCENDING" }
      ]
    }
  ]
}
```

Firebase will automatically prompt you to create required indexes on first run if they don't exist.

## Troubleshooting

### Stats Not Updating

1. **Check function logs**:
   ```bash
   firebase functions:log
   ```

2. **Manually trigger update**:
   ```bash
   curl -X POST https://us-central1-willard-tigers-bowling.cloudfunctions.net/triggerPublicStatsUpdate
   ```

3. **Verify players exist**:
   - Check `players` collection has active players
   - Ensure `programId` = 'willard-tigers'
   - Verify `isActive` = true

### No Data Returned

1. **Check publicStats collection**:
   - Open Firebase Console
   - Navigate to Firestore
   - Check if `publicStats/willard-tigers` document exists

2. **Verify security rules deployed**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Permission Denied Errors

- Ensure `publicStats` collection rule has `allow read: true`
- Check that the document exists
- Verify client is reading from correct collection path

## Cost Considerations

### Cloud Functions
- **Scheduled function**: Runs once per day = ~30 invocations/month
- **HTTP functions**: Depends on traffic
- **Free tier**: 2 million invocations/month
- **Estimated cost**: $0/month (well within free tier)

### Firestore
- **Reads**: Public stats read on page load
- **Writes**: 1 write per day (scheduled update)
- **Free tier**: 50,000 reads/day, 20,000 writes/day
- **Estimated cost**: $0/month (within free tier)

## Security Notes

1. **No Authentication Required**: Public stats are readable by anyone
2. **Write Protection**: Only Cloud Functions can write (via Admin SDK)
3. **Data Privacy**: Individual game details remain private
4. **CORS**: Functions allow cross-origin requests (public API)
5. **Rate Limiting**: Consider adding rate limiting for HTTP functions in production

## Future Enhancements

### Potential Additions

1. **Historical Stats**
   - Track stats over time
   - Season-by-season comparison
   - Trend analysis

2. **Additional Metrics**
   - Strike percentage
   - Spare percentage
   - Average first ball
   - Pin accuracy

3. **Accolades System**
   - Award badges for achievements
   - Auto-detect milestones (200+ game, etc.)
   - Display on public stats

4. **Caching Layer**
   - Add Redis or Firebase Hosting cache
   - Reduce Firestore reads
   - Improve performance

5. **AI Analysis**
   - Include AI-generated insights
   - Performance trends
   - Improvement suggestions (public summary only)

## Next Steps

1. **Deploy the functions** (see deployment instructions above)
2. **Test manual trigger** to verify functionality
3. **Integrate into WHS Site UI** (see usage examples)
4. **Monitor for 24 hours** to ensure scheduled function runs
5. **Add UI components** to display public stats

## Support

For issues or questions:
- Check function logs in Firebase Console
- Review Firestore security rules
- Verify data exists in `players` and `games` collections
- Test with manual trigger first before debugging scheduled function

## Files Modified/Created

```
functions/
├── package.json          (new)
├── tsconfig.json         (new)
├── .gitignore            (new)
└── src/
    └── index.ts          (new - Cloud Functions code)

firestore.rules           (modified - added publicStats rule)
firebase.json             (modified - added functions config)
firestore.indexes.json    (needs update - see Required Indexes)
```

## Summary

You now have a secure, scalable stats integration that:
- ✅ Exposes team and player stats publicly (name, average, high game, high series)
- ✅ Keeps detailed game data private
- ✅ Updates automatically every day at 2 AM
- ✅ Can be manually triggered for testing
- ✅ Provides both API and direct Firestore access
- ✅ Costs $0/month (within Firebase free tier)
- ✅ Requires no authentication for public data
- ✅ Maintains full security for private data
