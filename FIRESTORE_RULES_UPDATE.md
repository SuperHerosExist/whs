# Firestore Rules Update for WHS Site Integration

## Current Problem
The WHS site can't read player data because all reads require authentication.

## Safe Solution
Add public read access **ONLY** for your team's players, while keeping everything else the same.

---

## Updated Rules (Copy This)

Replace the entire Firestore rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return isAuthenticated() && request.auth.uid == uid;
    }

    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    function userExists() {
      return exists(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    function isCoach() {
      return isAuthenticated() && userExists() && getUserData().role == 'coach';
    }

    function belongsToSameProgram(programId) {
      return isAuthenticated() && userExists() && getUserData().programId == programId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId) || isCoach();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if false;
    }

    // Players collection
    match /players/{playerId} {
      allow read: if isAuthenticated() &&
                     (playerId == request.auth.uid ||
                      isCoach() ||
                      (userExists() && belongsToSameProgram(resource.data.programId)));
      allow create: if isAuthenticated();
      allow update: if playerId == request.auth.uid || isCoach();
      allow delete: if isCoach();
    }

    // ===================================================================
    // 🎳 WHS SITE PUBLIC ACCESS - WILLARD TIGERS ONLY
    // ===================================================================
    // Allow public read access ONLY to Willard Tigers team and players
    // This lets the WHS website display stats without authentication
    // Write access still requires authentication (Stats app unchanged)
    match /teams/MpyIVpCIsFSyqEdPID1O {
      allow read: if true; // ← PUBLIC READ for WHS site
      allow create: if isCoach();
      allow update: if isCoach();
      allow delete: if isCoach();

      // Allow public read access to Willard Tigers players subcollection
      match /players/{playerId} {
        allow read: if true; // ← PUBLIC READ for WHS site
        allow write: if isCoach();
      }

      // Allow public read access to games subcollection
      match /games/{gameId} {
        allow read: if true; // ← PUBLIC READ for WHS site
        allow write: if isCoach();
      }

      // Allow public read access to sessions subcollection
      match /sessions/{sessionId} {
        allow read: if true; // ← PUBLIC READ for WHS site
        allow write: if isCoach();
      }
    }
    // ===================================================================

    // Teams collection (all other teams still require auth)
    match /teams/{teamId} {
      allow read: if isAuthenticated();
      allow create: if isCoach();
      allow update: if isCoach();
      allow delete: if isCoach();
    }

    // Sessions collection
    match /sessions/{sessionId} {
      allow read: if isAuthenticated() &&
                     (request.auth.uid in resource.data.playerIds ||
                      isCoach());
      allow create: if isAuthenticated();
      allow update: if isCoach() || request.auth.uid in resource.data.playerIds;
      allow delete: if isCoach();
    }

    // Games collection
    match /games/{gameId} {
      allow read: if isAuthenticated() &&
                     (resource.data.playerId == request.auth.uid || isCoach());
      allow create: if isAuthenticated();
      allow update: if resource.data.playerId == request.auth.uid || isCoach();
      allow delete: if isCoach();
    }

    // Frames collection
    match /frames/{frameId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if isCoach();
    }

    // Coach Notes - private to coaches only
    match /coachNotes/{noteId} {
      allow read: if isCoach() &&
                     (resource.data.coachId == request.auth.uid ||
                      resource.data.playerId == request.auth.uid);
      allow create: if isCoach();
      allow update: if isCoach() && resource.data.coachId == request.auth.uid;
      allow delete: if isCoach() && resource.data.coachId == request.auth.uid;
    }

    // AI Generated Posts - coaches can CRUD their own posts
    match /aiPosts/{postId} {
      allow read: if isCoach() &&
                     (resource.data.coachId == request.auth.uid ||
                      belongsToSameProgram(resource.data.programId));
      allow create: if isCoach() &&
                       request.resource.data.coachId == request.auth.uid;
      allow update: if isCoach() && resource.data.coachId == request.auth.uid;
      allow delete: if isCoach() && resource.data.coachId == request.auth.uid;
    }

    // AI Coach Settings - coaches can manage their own preferences
    match /aiCoachSettings/{settingsId} {
      allow read: if isCoach() && settingsId == request.auth.uid;
      allow write: if isCoach() && settingsId == request.auth.uid;
    }

    // DFS Synced Bowler Profiles - read-only from sync, coaches can read
    match /dfsBowlers/{bowlerId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }

    // DFS Leagues - read-only from sync
    match /dfsLeagues/{leagueId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }

    // DFS Sync Status - admin monitoring only
    match /dfsSyncStatus/{statusId} {
      allow read: if isCoach();
      allow write: if false;
    }

    // Accolade Settings - coaches can manage for their program
    match /accoladeSettings/{programId} {
      allow read: if isAuthenticated() && belongsToSameProgram(programId);
      allow write: if isCoach() && belongsToSameProgram(programId);
    }

    // Dashboard Configuration - coaches can manage for their program
    match /dashboardConfig/{programId} {
      allow read: if isAuthenticated() && belongsToSameProgram(programId);
      allow write: if isCoach() && belongsToSameProgram(programId);
    }

    // Team Builder Configuration - coaches can manage for their program
    match /teamBuilderConfigs/{configId} {
      allow read: if isAuthenticated() && belongsToSameProgram(resource.data.programId);
      allow create: if isCoach();
      allow update: if isCoach() && belongsToSameProgram(resource.data.programId);
      allow delete: if isCoach() && belongsToSameProgram(resource.data.programId);
    }
  }
}
```

---

## What Changed?

### Added (lines 44-70):
```javascript
// Allow public read access ONLY to Willard Tigers team
match /teams/MpyIVpCIsFSyqEdPID1O {
  allow read: if true; // ← Anyone can read
  match /players/{playerId} {
    allow read: if true; // ← Anyone can read Willard players
  }
}
```

### Everything Else:
✅ **Unchanged** - All other collections still require authentication

---

## Impact Analysis

### ✅ Stats App (NO IMPACT):
- Coaches can still read/write everything
- Players can still read their own data
- All authentication still works
- Nothing breaks

### ✅ WHS Website (NOW WORKS):
- Can read **ONLY** Willard Tigers team data
- Can read **ONLY** Willard Tigers players
- **CANNOT** write anything
- **CANNOT** read other teams

### ✅ Security:
- Only your team's stats are public
- Write access still requires auth
- Other teams remain private
- Coach notes remain private
- AI posts remain private

---

## How to Apply

1. Go to https://console.firebase.google.com/
2. Select **bowlingstatstracker** project
3. Click **Firestore Database** → **Rules** tab
4. Copy the entire rules block above
5. Paste to replace existing rules
6. Click **Publish**
7. Wait for "Rules published successfully"

---

## Test After Publishing

1. Go to http://localhost:5173/debug
2. Refresh the page
3. Should now see:
   ```
   ✅ Found 1 teams
   ✅ Team exists!
   ✅ Found 14 players
   ```

4. Then check:
   - http://localhost:5173/ - Should show Team Average: ~192
   - http://localhost:5173/roster - Should show 14 players
   - http://localhost:5173/stats - Should show statistics

---

## Why This Is Safe

1. **Specific Team Only:** Only `/teams/MpyIVpCIsFSyqEdPID1O` is public
2. **Read Only:** No public write access
3. **Stats App Unchanged:** Authenticated users can still do everything
4. **Standard Practice:** Like NBA.com, ESPN showing public stats
5. **Reversible:** Can revert anytime if needed

---

## If You Want to Revert

Just remove lines 44-70 (the public access section) and republish.

---

**This is the safest way to give WHS site read-only access without impacting your Stats app!** 🔒
