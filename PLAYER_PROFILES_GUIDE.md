# Player Profiles & Team Page - Implementation Guide

## Overview

Complete player profile system integrated with bowling stats from the Stats app. Players can claim their profiles, manage their information, and be featured on a public "Meet the Team" page.

## Features Implemented

### 1. Profile Claiming Flow
**Component**: `src/components/auth/ProfileClaiming.tsx`

When a new user signs up:
1. User creates account with Firebase Auth
2. System shows all unclaimed player profiles
3. User selects their profile and claims it
4. Their Firebase Auth UID links to their player document
5. User role automatically changes to 'player'

**Usage**:
```tsx
import { ProfileClaiming } from '@/components/auth/ProfileClaiming';

<ProfileClaiming onProfileClaimed={() => navigate('/player/dashboard')} />
```

### 2. Meet the Team Page (PUBLIC)
**Route**: `/team`
**Component**: `src/pages/Team.tsx`

Public-facing page showing all active players with:
- **Team Stats Header**:
  - Team average
  - Total games played
  - Number of active bowlers

- **Player Cards** (for each player):
  - Photo (or default avatar)
  - Name, grade, jersey number
  - Hometown
  - Bio (preview)
  - Bowling average
  - High game
  - High series
  - Achievement count

- **Player Detail Modal**:
  - Full bio
  - Favorite quote
  - Bowling goals
  - Complete stats
  - All public achievements

**Data Sources**:
- `players` collection (Firestore)
- `publicStats` collection (from Cloud Functions)
- `achievements` collection (where `isPublic: true`)

### 3. Player Profile Management (PROTECTED)
**Route**: `/player/profile`
**Component**: `src/pages/PlayerProfile.tsx`

Protected page where players can edit their own profiles:

**Editable Fields**:
- Profile photo (uploaded to Firebase Storage)
- Jersey number
- Hometown
- Bio
- Favorite quote
- Bowling goals

**Read-Only Fields** (synced from Stats app):
- Name
- Email
- Grade
- Bowling average
- High game
- High series
- Games played

**Photo Upload**:
- Stored in Firebase Storage at: `players/{playerId}/profile.jpg`
- Automatic thumbnail generation (if configured)
- Updates `photoURL` field in player document

## Data Structure

### Player Document (`players` collection)

```typescript
{
  id: string;                 // Document ID (same as UID after claiming)
  uid: string;                // Firebase Auth UID
  name: string;               // Full name
  email: string;              // Email address
  photoURL?: string;          // Profile photo URL
  programId: string;          // 'willard-tigers'
  teamIds: string[];          // Array of team IDs
  grade: string;              // '9', '10', '11', '12'
  graduationYear: number;     // Graduation year
  jerseyNumber?: string;      // Jersey number

  // Profile fields (editable by player)
  bio?: string;               // Short bio
  hometown?: string;          // Hometown
  favoriteQuote?: string;     // Favorite quote
  bowlingGoals?: string;      // Season goals

  // Stats (synced from Stats app - READ ONLY)
  averageScore: number;       // Bowling average
  average: number;            // Alias for averageScore
  highGame: number;           // Highest single game
  highSeries: number;         // Highest 3-game series
  gamesPlayed: number;        // Total games

  // Status
  isActive: boolean;          // Is player active?
  isClaimed: boolean;         // Has profile been claimed?
  createdAt: Date;
  updatedAt: Date;
}
```

### Public Stats Document (`publicStats/willard-tigers`)

Created by Cloud Functions daily at 2 AM:

```typescript
{
  programId: 'willard-tigers',
  teamAverage: number,
  totalGames: number,
  topPlayers: [
    {
      name: string,
      average: number,
      highGame: number,
      highSeries: number
    }
  ],
  recentHighGames: [
    {
      playerName: string,
      score: number,
      date: string
    }
  ],
  updatedAt: Timestamp
}
```

### Achievement Document (`achievements` collection)

```typescript
{
  id: string,
  playerId: string,
  playerName: string,
  type: 'high-game' | 'improvement' | 'milestone' | 'award',
  title: string,
  description: string,
  value?: number,
  date: Date,
  isPublic: boolean,        // Show on team page?
  createdAt: Date
}
```

## Security Rules

### Players Collection

```javascript
match /players/{playerId} {
  // Read: Owner, coaches, or public for active players
  allow read: if isOwner(playerId) ||
                 (isCoach() && belongsToProgram(resource.data.programId)) ||
                 (resource.data.isActive == true);

  // Create: Coaches only
  allow create: if isCoach();

  // Update: Players (limited fields) or coaches (all fields)
  allow update: if (isOwner(playerId) &&
                    // Can only update: bio, hometown, favoriteQuote,
                    // bowlingGoals, jerseyNumber, photoURL, isClaimed
                    (!request.resource.data.diff(resource.data).affectedKeys()
                    .hasAny(['uid', 'programId', 'averageScore', 'average',
                            'highGame', 'highSeries', 'gamesPlayed',
                            'isActive', 'name', 'email']))) ||
                   (isCoach() && belongsToProgram(resource.data.programId));
}
```

**Key Points**:
- ✅ Public can read active player profiles (for team page)
- ✅ Players can update ONLY their profile fields
- ❌ Players CANNOT update stats (synced from Stats app)
- ❌ Players CANNOT change name, email, uid, programId
- ✅ Coaches can update everything

## User Flows

### New Player Signup Flow

1. User visits `/signup`
2. Creates account with email/password
3. System creates `users/{uid}` document with role 'player'
4. User redirected to profile claiming page
5. User selects their player profile from list
6. System links:
   - `players/{playerId}.uid = user.uid`
   - `players/{playerId}.isClaimed = true`
   - `users/{uid}.role = 'player'`
7. User redirected to `/player/dashboard`

### Player Profile Edit Flow

1. Player visits `/player/profile`
2. System fetches player document by UID
3. Player edits allowed fields
4. Player clicks "Save Profile"
5. System updates `players/{playerId}` document
6. Only allowed fields are updated (bio, hometown, etc.)
7. Stats remain unchanged (read-only)

### Public Viewing Flow

1. Anyone visits `/team`
2. System fetches:
   - All active players from `players` collection
   - Public stats from `publicStats/willard-tigers`
   - Public achievements from `achievements` collection
3. Displays team stats and player cards
4. User clicks player card to see full profile modal
5. Modal shows detailed info and achievements

## Integration with Stats App

### Data Flow

```
Stats App
  ↓ (writes)
Firestore: players, games, sessions
  ↓ (reads)
Cloud Function: updatePublicStats
  ↓ (writes)
Firestore: publicStats
  ↓ (reads)
WHS Site: Team page
```

### Synced Fields

These fields are automatically synced from the Stats app and are **READ ONLY** on the WHS site:

- `averageScore` / `average`
- `highGame`
- `highSeries`
- `gamesPlayed`

Players see these stats on their profile but cannot edit them.

## Deployment Steps

### 1. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

This updates the security rules to allow:
- Public read access to active players
- Player profile field updates
- Protected stats fields

### 2. Create Initial Player Profiles

If players don't exist yet, coaches need to create them:

**Option A**: Manually in Firebase Console
1. Go to Firestore Database
2. Create documents in `players` collection
3. Required fields:
   - `uid`: '' (empty, will be filled on claim)
   - `name`: Full name
   - `email`: Player email
   - `programId`: 'willard-tigers'
   - `grade`: '9', '10', '11', or '12'
   - `graduationYear`: 2025, 2026, etc.
   - `isActive`: true
   - `isClaimed`: false
   - `teamIds`: []
   - `averageScore`: 0
   - `highGame`: 0
   - `highSeries`: 0
   - `gamesPlayed`: 0

**Option B**: Import from Stats app
If Stats app already has player data, it will sync automatically.

### 3. Test Profile Claiming

1. Create test account at `/signup`
2. Should see profile claiming page
3. Select a profile and claim it
4. Verify:
   - `players/{playerId}.uid` = your auth UID
   - `players/{playerId}.isClaimed` = true
   - You're redirected to dashboard

### 4. Test Profile Editing

1. Login as player
2. Visit `/player/profile`
3. Edit bio, hometown, etc.
4. Upload a photo
5. Click "Save Profile"
6. Verify changes saved in Firestore
7. Verify stats remain unchanged

### 5. Test Team Page

1. Visit `/team` (no login required)
2. Verify:
   - Team stats display
   - Player cards show
   - Click player card opens modal
   - Achievements display (if any exist)

## Adding Achievements

Coaches can add achievements via Coach Dashboard or manually:

```javascript
// In Firestore Console
// Collection: achievements
{
  playerId: "player-uid",
  playerName: "John Doe",
  type: "high-game",
  title: "200+ Game",
  description: "Bowled a 235 game!",
  value: 235,
  date: new Date(),
  isPublic: true,
  createdAt: new Date()
}
```

These will automatically appear on:
- Player's profile page
- Team page (in player modal)
- Player dashboard

## Customization

### Change Team Name/Program ID

Update in multiple places:
1. `src/lib/firebase.ts` - Default programId
2. `firestore.rules` - programId checks
3. `functions/src/index.ts` - Cloud Functions
4. Player documents - `programId` field

### Add More Profile Fields

1. Update `Player` type in `src/types/index.ts`
2. Add field to `PlayerProfile.tsx` form
3. Update Firestore rules allowed fields
4. Update `Team.tsx` to display new field

### Customize Styling

All pages use Tailwind with custom colors:
- `willard-black`: #000000
- `willard-grey-900`: #1a1a1a
- `willard-grey-800`: #2d2d2d
- etc.

Update in `tailwind.config.js` to match school colors.

## Troubleshooting

### Profile Claiming Not Working

**Issue**: Player claims profile but nothing happens

**Solution**:
1. Check Firestore rules deployed
2. Verify player document has `isClaimed: false`
3. Check browser console for errors
4. Verify `players/{playerId}` document exists

### Stats Not Showing

**Issue**: Player stats show as 0

**Solution**:
1. Check if Stats app has synced data
2. Verify `publicStats` document exists
3. Check Cloud Function logs
4. Manually trigger stats update:
   ```bash
   curl -X POST "https://us-central1-willard-tigers-bowling.cloudfunctions.net/triggerPublicStatsUpdate"
   ```

### Photo Upload Fails

**Issue**: Photo upload doesn't work

**Solution**:
1. Check Firebase Storage rules
2. Verify Storage bucket exists
3. Check file size (max 5MB)
4. Check file type (only images allowed)
5. Check browser console for errors

### Permission Denied Errors

**Issue**: "Permission denied" when updating profile

**Solution**:
1. Verify Firestore rules deployed
2. Check player is updating their own profile (`uid` matches)
3. Verify not trying to update protected fields
4. Check user role is 'player'

## Next Steps

1. **Add Coach Features**:
   - Coach dashboard to manage players
   - Create/edit player profiles
   - Add achievements

2. **Enhanced Stats**:
   - Player progress graphs
   - Season comparisons
   - Individual game history

3. **Social Features**:
   - Player comments/shoutouts
   - Team announcements
   - Photo gallery

4. **Mobile App**:
   - React Native version
   - Push notifications
   - Offline support

## Summary

You now have a complete player profile system with:

✅ Profile claiming for new users
✅ Public "Meet the Team" page
✅ Player profile management
✅ Stats integration from Stats app
✅ Photo uploads
✅ Achievements display
✅ Secure permissions

All player stats are automatically synced from the Stats app via Cloud Functions, and players can manage their own profile information while stats remain read-only.
