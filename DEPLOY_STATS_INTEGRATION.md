# Deploy Stats Integration - Manual Steps

## Prerequisites

You must have Firebase CLI authenticated. If not already logged in:

```bash
firebase login
```

## Deployment Steps

Follow these steps **in order** to deploy the stats integration:

### Step 1: Verify You're in the Project Directory

```bash
cd /home/user/whs
firebase use willard-tigers-bowling
```

### Step 2: Deploy Firestore Rules and Indexes

This deploys the updated security rules that include the public `publicStats` collection:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

**Expected output:**
- ✓ Deploy complete!
- Firestore rules and indexes updated

**What this does:**
- Adds `publicStats` collection with world-readable access
- Creates composite index for games queries (programId + date + score)

### Step 3: Deploy Cloud Functions

This deploys the three Cloud Functions for stats aggregation:

```bash
firebase deploy --only functions
```

**Expected output:**
- ✓ functions[us-central1-updatePublicStats]: Successful create operation.
- ✓ functions[us-central1-triggerPublicStatsUpdate]: Successful create operation.
- ✓ functions[us-central1-getPublicStats]: Successful create operation.

**Note:** First deployment may take 5-10 minutes.

**What this deploys:**
1. `updatePublicStats` - Scheduled function (runs daily at 2 AM)
2. `triggerPublicStatsUpdate` - HTTP endpoint for manual updates
3. `getPublicStats` - Public API to fetch stats

### Step 4: Test Manual Trigger

Once functions are deployed, trigger a manual stats update:

```bash
curl -X POST "https://us-central1-willard-tigers-bowling.cloudfunctions.net/triggerPublicStatsUpdate?programId=willard-tigers"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Public stats updated successfully",
  "data": {
    "programId": "willard-tigers",
    "teamAverage": 165,
    "totalGames": 250,
    "playerCount": 12,
    "topPlayersCount": 10,
    "recentHighGamesCount": 10
  }
}
```

**If you get an error:**
- Check that players exist in Firestore with `programId: 'willard-tigers'`
- Verify players have `isActive: true`
- Check Firebase Console > Functions > Logs for details

### Step 5: Verify Data in Firestore

Check that the public stats were created:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `willard-tigers-bowling`
3. Navigate to **Firestore Database**
4. Look for collection: `publicStats`
5. Look for document: `willard-tigers`

**Expected document structure:**
```javascript
{
  programId: "willard-tigers",
  teamAverage: 165,
  totalGames: 250,
  topPlayers: [
    {
      name: "Player Name",
      average: 180,
      highGame: 245,
      highSeries: 650
    },
    // ... more players
  ],
  recentHighGames: [
    {
      playerName: "Player Name",
      score: 245,
      date: "2025-10-21T18:30:00.000Z"
    },
    // ... more games
  ],
  updatedAt: Timestamp
}
```

### Step 6: Test Public API

Test the public API endpoint:

```bash
curl "https://us-central1-willard-tigers-bowling.cloudfunctions.net/getPublicStats?programId=willard-tigers"
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "programId": "willard-tigers",
    "teamAverage": 165,
    "totalGames": 250,
    "topPlayers": [...],
    "recentHighGames": [...],
    "updatedAt": "..."
  }
}
```

## Troubleshooting

### Function Deployment Fails

**Error: "Firebase login required"**
```bash
firebase login
```

**Error: "Project not found"**
```bash
firebase projects:list
firebase use willard-tigers-bowling
```

**Error: "Billing required"**
- Cloud Functions require Blaze plan
- Go to Firebase Console > Usage and billing
- Upgrade to Blaze (Pay as you go)
- Set budget alert at $25/month

### Manual Trigger Returns Error

**Error: "No active players found"**

The Stats app hasn't synced player data yet. You need to:
1. Ensure players exist in the `players` collection
2. Set `programId: 'willard-tigers'` on player documents
3. Set `isActive: true` on player documents

**Error: "Permission denied"**

Security rules not deployed correctly:
```bash
firebase deploy --only firestore:rules
```

### No Stats in Firestore

If the `publicStats` collection is empty:

1. **Check function logs:**
   ```bash
   firebase functions:log --only updatePublicStats
   ```

2. **Manually trigger again:**
   ```bash
   curl -X POST "https://us-central1-willard-tigers-bowling.cloudfunctions.net/triggerPublicStatsUpdate"
   ```

3. **Verify player data exists:**
   - Open Firebase Console
   - Check `players` collection
   - Ensure documents have: `programId: 'willard-tigers'`, `isActive: true`

### Function Logs Show Errors

View detailed logs:

```bash
# All function logs
firebase functions:log

# Specific function
firebase functions:log --only updatePublicStats

# Recent logs only
firebase functions:log --only updatePublicStats -n 50
```

## Verify Scheduled Function

The `updatePublicStats` function is scheduled to run daily at 2 AM Central Time.

To verify it's scheduled correctly:

1. Go to [GCP Console](https://console.cloud.google.com)
2. Select project: `willard-tigers-bowling`
3. Navigate to **Cloud Scheduler**
4. Look for job: `firebase-schedule-updatePublicStats-us-central1`
5. Check schedule: `0 2 * * *` (2 AM daily)
6. Check timezone: `America/Chicago`

You can manually trigger the schedule from Cloud Scheduler if needed.

## Next Steps After Deployment

Once deployment is successful:

### 1. Monitor for 24 Hours

Wait for the scheduled function to run automatically at 2 AM:
- Check Cloud Scheduler ran successfully
- Verify `publicStats` document `updatedAt` field updates
- Check function logs for any errors

### 2. Integrate into WHS Site UI

Add a component to display public stats:

```typescript
// Example React component
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

async function loadPublicStats() {
  const statsRef = doc(db, 'publicStats', 'willard-tigers');
  const statsSnap = await getDoc(statsRef);

  if (statsSnap.exists()) {
    return statsSnap.data();
  }
  return null;
}
```

### 3. Add Real-time Updates (Optional)

For live stats updates:

```typescript
import { doc, onSnapshot } from 'firebase/firestore';

const unsubscribe = onSnapshot(
  doc(db, 'publicStats', 'willard-tigers'),
  (snapshot) => {
    if (snapshot.exists()) {
      // Update UI with snapshot.data()
    }
  }
);
```

### 4. Monitor Costs

Check Firebase Console > Usage and billing:
- Functions: Should be <100 invocations/day = $0/month
- Firestore reads: Depends on page views
- Set budget alert if not already set

## Summary

After completing these steps, you will have:

- ✅ Public stats collection (world-readable)
- ✅ Scheduled function (runs daily at 2 AM)
- ✅ Manual trigger endpoint (for testing)
- ✅ Public API endpoint (for external access)
- ✅ Security rules deployed
- ✅ Firestore indexes created

## Support

- **Function logs**: `firebase functions:log`
- **Firestore data**: [Firebase Console](https://console.firebase.google.com)
- **Documentation**: See `STATS_INTEGRATION_IMPLEMENTATION.md`
- **Function code**: `functions/src/index.ts`

## Quick Reference

```bash
# Deploy everything
firebase deploy --only firestore:rules,firestore:indexes,functions

# Manual stats update
curl -X POST "https://us-central1-willard-tigers-bowling.cloudfunctions.net/triggerPublicStatsUpdate"

# Get public stats
curl "https://us-central1-willard-tigers-bowling.cloudfunctions.net/getPublicStats?programId=willard-tigers"

# View logs
firebase functions:log

# Check project
firebase use
```
