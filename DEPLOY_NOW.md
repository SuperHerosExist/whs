# Deploy Stats Integration - Run These Commands

## Quick Deploy (All in One)

Run this from your terminal where you have Firebase authentication:

```bash
cd /home/user/whs

# Deploy everything at once
firebase deploy --only firestore:rules,firestore:indexes,functions

# Or use the automated script
./deploy-stats.sh
```

## Step-by-Step Deploy

If you prefer to deploy one piece at a time:

```bash
# 1. Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes

# 2. Deploy Cloud Functions (may take 5-10 minutes)
firebase deploy --only functions

# 3. Test manual trigger
curl -X POST "https://us-central1-willard-tigers-bowling.cloudfunctions.net/triggerPublicStatsUpdate?programId=willard-tigers"

# 4. Get public stats
curl "https://us-central1-willard-tigers-bowling.cloudfunctions.net/getPublicStats?programId=willard-tigers"

# 5. View function logs
firebase functions:log --only updatePublicStats
```

## Expected Output

### Firestore Deploy:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/willard-tigers-bowling/overview
```

### Functions Deploy:
```
✔  functions[us-central1-updatePublicStats]: Successful create operation.
✔  functions[us-central1-triggerPublicStatsUpdate]: Successful create operation.
✔  functions[us-central1-getPublicStats]: Successful create operation.

✔  Deploy complete!
```

### Manual Trigger Test:
```json
{
  "success": true,
  "message": "Public stats updated successfully",
  "data": {
    "programId": "willard-tigers",
    "teamAverage": 165,
    "totalGames": 250,
    "playerCount": 12
  }
}
```

## Troubleshooting

### Not logged in?
```bash
firebase login
```

### Wrong project?
```bash
firebase use willard-tigers-bowling
```

### Need to check what project?
```bash
firebase projects:list
```

## After Deploy

Once deployed, verify in Firebase Console:
1. Go to https://console.firebase.google.com/project/willard-tigers-bowling
2. Check Functions section - should see 3 functions
3. Check Firestore - should see `publicStats/willard-tigers` document after manual trigger
4. Check Scheduler - should see daily 2 AM job scheduled

## All Code is Ready

Everything has been committed to:
- Branch: `claude/stats-integration-guide-011CUNFnzcPKBUz29ZPdtfMx`
- All code is ready to deploy
- Functions are built and ready
- Security rules are updated
