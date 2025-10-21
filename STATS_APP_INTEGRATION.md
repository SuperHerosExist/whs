# Stats App Integration Guide

This document outlines safe integration options for connecting the WHS Bowling Site with the Stats app (https://github.com/SuperHerosExist/Stats.git) **without modifying the Stats app codebase**.

## Integration Philosophy

**IMPORTANT**: We will NOT modify the Stats app. Instead, we'll integrate by:
1. Sharing the same Firebase project
2. Reading data the Stats app writes (read-only)
3. Using environment variables to point to the Stats app
4. Implementing proper security rules that work for both apps

## Option 1: Shared Firebase Project (Recommended)

### Overview
Both applications share the same Firebase project and Firestore database. The Stats app continues to operate independently while the WHS Site reads data it produces.

### Implementation Steps

1. **Use Same Firebase Project**
   - Deploy both apps to the same Firebase project
   - Configure both apps with the same Firebase credentials
   - Stats app: `stats.willardtigersbowling.com`
   - WHS Site: `willardtigersbowling.com`

2. **Security Rules Strategy**
   - Merge security rules to support both apps
   - Stats app controls write access to stats collections
   - WHS Site has read-only access to stats collections
   - Each app has its own collections for app-specific data

3. **Shared Collections** (Stats app writes, WHS Site reads):
   - `players` - Player profiles and stats
   - `games` - Game data
   - `sessions` - Practice/match sessions
   - `frames` - Frame-by-frame data
   - `teams` - Team rosters

4. **WHS Site Only Collections**:
   - `users` - Authentication profiles
   - `publicContent` - News/announcements
   - `schedules` - Event schedule
   - `photoGallery` - Photo gallery
   - `contactSubmissions` - Contact form submissions

5. **Environment Configuration**:
   ```env
   # .env for WHS Site
   VITE_STATS_APP_URL=https://stats.willardtigersbowling.com
   VITE_FIREBASE_PROJECT_ID=willard-tigers-bowling
   # ... same Firebase config as Stats app
   ```

### Pros
- Simple data sharing
- Real-time sync between apps
- Single source of truth
- No API layer needed
- Both apps use same authentication

### Cons
- Requires careful security rule management
- Need to coordinate Firebase deployments

## Option 2: Stats App as External Service

### Overview
Treat the Stats app as a completely separate service with its own Firebase project. Link to it via URL only.

### Implementation Steps

1. **Deploy Stats App Independently**
   - Stats app has its own Firebase project
   - Own domain: `stats.willardtigersbowling.com`
   - Completely independent deployment

2. **WHS Site Integration**:
   - Link to Stats app via buttons/menu
   - Pass authentication token via URL parameter
   - No direct data sharing

3. **Pros**:
   - Complete separation of concerns
   - No risk of breaking Stats app
   - Independent scaling and management

4. **Cons**:
   - No real-time stats on WHS Site
   - Users must navigate to separate app
   - Duplicate player data management

## Option 3: Read-Only Data Sync

### Overview
Set up a one-way data sync from Stats app to WHS Site using Cloud Functions.

### Implementation Steps

1. **Cloud Function Triggers**:
   - Stats app writes to its Firestore
   - Cloud Function listens to writes
   - Syncs summary data to WHS Site Firestore

2. **Data Flow**:
   ```
   Stats App (write) -> Firestore -> Cloud Function -> WHS Site Firestore (read)
   ```

3. **Synced Data** (summary only):
   - Player averages, high games
   - Team statistics
   - Recent achievements

### Pros
- No risk to Stats app
- WHS Site gets curated data
- Can transform data as needed

### Cons
- Requires Cloud Functions development
- Not real-time (eventual consistency)
- Additional complexity

## Recommended Implementation: Option 1 (Shared Project)

### Step-by-Step Setup

#### 1. Firebase Project Setup

```bash
# Use the same Firebase project for both apps
firebase use willard-tigers-bowling

# Deploy WHS Site
cd /path/to/WHS
firebase deploy

# Deploy Stats App (separate hosting target)
cd /path/to/Stats
firebase target:apply hosting stats stats-site
firebase deploy --only hosting:stats
```

#### 2. Security Rules (Merged)

The `firestore.rules` file in WHS already includes Stats app collections with write protection:

```javascript
// Stats App Integration Collections
// (Shared with Stats app - read-only from website)
match /games/{gameId} {
  allow read: if isOwner(resource.data.playerId) || isCoach();
  allow write: if false; // Stats app has its own rules
}
```

#### 3. Environment Variables

WHS Site `.env`:
```env
VITE_STATS_APP_URL=https://stats.willardtigersbowling.com
VITE_FIREBASE_PROJECT_ID=willard-tigers-bowling
VITE_FIREBASE_API_KEY=... # Same as Stats app
# ... etc
```

#### 4. Update Stats App Security Rules (Without Modifying Code)

Deploy updated rules that work for both apps:

```bash
# In WHS directory
firebase deploy --only firestore:rules
```

The rules will allow:
- Stats app to write to games, sessions, frames
- WHS Site to read these collections (read-only)
- Both apps to share player data with appropriate permissions

### Data Synchronization

**Player Profiles**:
- Created in WHS Site (players collection)
- Stats app reads player data for scoring
- Stats app updates averageScore, highGame, gamesPlayed
- WHS Site displays updated stats (read-only)

**Authentication**:
- Single Firebase Auth instance
- Both apps recognize the same users
- Role-based access (player/coach) works across both

### Testing the Integration

1. **Deploy both apps** to same Firebase project
2. **Create a player account** in WHS Site
3. **Navigate to Stats app** from WHS Site dashboard
4. **Bowl a game** in Stats app
5. **Return to WHS Site** - stats should update automatically

## Future Enhancement: API Layer (Optional)

If you need more control, add a Cloud Functions API layer:

```typescript
// functions/src/index.ts
export const getPlayerStats = functions.https.onCall(async (data, context) => {
  // Validate auth
  if (!context.auth) throw new Error('Unauthorized');

  // Fetch player stats
  const stats = await getStatsFromFirestore(data.playerId);
  return stats;
});
```

This allows:
- Data transformation
- Caching
- Rate limiting
- Analytics

## Security Considerations

1. **Read-Only Access**: WHS Site never writes to Stats app collections
2. **Role Validation**: Security rules enforce player/coach permissions
3. **Data Isolation**: Each app has its own collections where needed
4. **Audit Trail**: All writes logged with timestamps
5. **FERPA Compliance**: Student data protected per security rules

## Deployment Checklist

- [ ] Firebase project configured
- [ ] Environment variables set for both apps
- [ ] Security rules deployed and tested
- [ ] Authentication working across both apps
- [ ] Player data syncing correctly
- [ ] Stats displaying on WHS Site
- [ ] Links between apps working
- [ ] Mobile responsive on both apps
- [ ] Performance tested

## Rollback Plan

If integration causes issues:

1. Deploy Stats app to separate Firebase project
2. Update WHS Site to link externally only
3. Remove shared data dependencies
4. Run apps completely independently

## Contact

For questions about this integration:
- Review Stats app documentation: https://github.com/SuperHerosExist/Stats.git
- Check Firebase console for logs
- Test in development environment first
