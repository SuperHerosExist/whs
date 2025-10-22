# WHS Bowling Site - Cloud Functions

This directory contains Firebase Cloud Functions for the Willard Tigers Bowling site.

## Functions

### 1. `updatePublicStats` (Scheduled)
**Schedule**: Daily at 2:00 AM Central Time

Aggregates player and team statistics into a public-facing collection.

**What it does**:
- Fetches all active players in the program
- Calculates team average
- Identifies top 10 players (min 3 games)
- Finds recent high games (last 30 days)
- Writes aggregated data to `publicStats` collection

**Triggered by**: Cloud Scheduler (automatic)

### 2. `triggerPublicStatsUpdate` (HTTP)
**Endpoint**: `POST /triggerPublicStatsUpdate?programId=willard-tigers`

Manual trigger for updating public stats. Useful for testing and on-demand updates.

**Usage**:
```bash
curl -X POST "https://us-central1-willard-tigers-bowling.cloudfunctions.net/triggerPublicStatsUpdate?programId=willard-tigers"
```

### 3. `getPublicStats` (HTTP)
**Endpoint**: `GET /getPublicStats?programId=willard-tigers`

Public API to fetch aggregated stats. No authentication required.

**Usage**:
```bash
curl "https://us-central1-willard-tigers-bowling.cloudfunctions.net/getPublicStats?programId=willard-tigers"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "programId": "willard-tigers",
    "teamAverage": 165,
    "totalGames": 250,
    "topPlayers": [...],
    "recentHighGames": [...],
    "updatedAt": "2025-10-22T02:00:00.000Z"
  }
}
```

## Development

### Setup
```bash
npm install
```

### Build
```bash
npm run build
```

### Watch Mode
```bash
npm run build:watch
```

### Local Testing (Emulator)
```bash
npm run serve
```

## Deployment

### Deploy All Functions
```bash
firebase deploy --only functions
```

### Deploy Specific Function
```bash
firebase deploy --only functions:updatePublicStats
firebase deploy --only functions:getPublicStats
firebase deploy --only functions:triggerPublicStatsUpdate
```

## Monitoring

### View Logs
```bash
npm run logs
```

Or for specific function:
```bash
firebase functions:log --only updatePublicStats
```

### Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `willard-tigers-bowling`
3. Navigate to **Functions**
4. View logs, metrics, and execution history

## Environment Variables

Functions use Firebase Admin SDK with default credentials (no environment variables needed).

## Cost

All functions are within Firebase free tier:
- Scheduled function: ~30 invocations/month
- HTTP functions: Depends on usage
- Free tier: 2 million invocations/month

Estimated monthly cost: **$0**

## Security

- Functions use Admin SDK (bypasses Firestore security rules)
- Write operations are only performed by Cloud Functions
- Public stats collection is world-readable
- No sensitive data exposed in public stats

## Troubleshooting

### Function Not Running
1. Check Firebase Console > Functions for errors
2. Verify function is deployed: `firebase functions:list`
3. Check logs: `npm run logs`

### Schedule Not Triggering
1. Verify timezone: `America/Chicago`
2. Check Cloud Scheduler in GCP Console
3. Manually trigger to test: `triggerPublicStatsUpdate`

### Permission Errors
- Functions use Admin SDK (should have full access)
- Verify Firebase Admin initialized correctly
- Check Firestore rules don't block function writes

## TypeScript

Functions are written in TypeScript and compiled to JavaScript before deployment.

**Source**: `src/index.ts`
**Output**: `lib/index.js`

## Dependencies

- `firebase-admin`: Firebase Admin SDK
- `firebase-functions`: Cloud Functions SDK
- `typescript`: TypeScript compiler

## Support

For questions or issues:
- Check function logs
- Review `STATS_INTEGRATION_IMPLEMENTATION.md` in root directory
- Test with manual trigger before debugging scheduled function
