# 🎳 Willard Tigers Bowling - Setup Instructions

## Current Status
✅ Site deployed at: https://willard-tigers-bowling.web.app
✅ Firebase project: willard-tigers-bowling
✅ Security rules deployed
⏳ **Waiting for**: Coach account setup + real player data

---

## Step 1: Enable Google Sign-In (2 minutes)

1. Go to **Firebase Console Authentication**:
   https://console.firebase.google.com/project/willard-tigers-bowling/authentication/providers

2. Click on **"Google"**

3. Click **"Enable"**

4. **Support email**: Select `davesfx@gmail.com`

5. Click **"Save"**

---

## Step 2: Sign In & Get Your UID (1 minute)

1. Visit: **https://willard-tigers-bowling.web.app**

2. Click **"Sign In"** button

3. Click **"Sign in with Google"** (should appear after Step 1)

4. Select **davesfx@gmail.com**

5. After signing in, open **browser console** (Press F12)

6. In the console, type:
   ```javascript
   firebase.auth().currentUser.uid
   ```

7. **Copy your UID** (looks like: `abc123def456ghi789...`)
   Write it down - you'll need it in the next step!

---

## Step 3: Create Coach Account in Firestore (3 minutes)

1. Go to **Firestore Database**:
   https://console.firebase.google.com/project/willard-tigers-bowling/firestore/databases/-default-/data

2. You should see a `users` collection. If not, click **"+ Start collection"**, enter `users`, then click Next.

3. Click **"+ Add document"**

4. **Document ID**: Paste your UID from Step 2

5. **Add these fields** (click "+ Add field" for each):

   | Field | Type | Value |
   |-------|------|-------|
   | email | string | `davesfx@gmail.com` |
   | displayName | string | `Coach Stevens` (or your name) |
   | role | string | `coach` |
   | programId | string | `willard-tigers` |
   | createdAt | timestamp | Click clock icon → "timestamp" → set to now |
   | updatedAt | timestamp | Click clock icon → "timestamp" → set to now |

6. Click **"Save"**

---

## Step 4: Import Player Data from Stats App (5 minutes)

### Option A: Using Firebase Console (Manual - Recommended for first time)

1. Go to your **Stats app Firebase project**:
   (You mentioned you have ~14 players in Stats)

2. Open the **Firestore Database** in that project

3. Find your **players collection**

4. For each player, note:
   - Name
   - Email
   - Grade level
   - Average score
   - High game
   - Games played

5. Go back to **WHS Firestore** and create each player manually:
   https://console.firebase.google.com/project/willard-tigers-bowling/firestore/databases/-default-/data

6. Click on `players` collection (or create it)

7. For each player, click "+ Add document":

   **Auto-ID** (let Firebase generate)

   | Field | Type | Value |
   |-------|------|-------|
   | uid | string | (will be filled when player signs in) |
   | name | string | Player's full name |
   | email | string | Player's email |
   | grade | string | `9`, `10`, `11`, or `12` |
   | programId | string | `willard-tigers` |
   | averageScore | number | e.g., `205` |
   | highGame | number | e.g., `278` |
   | gamesPlayed | number | e.g., `24` |
   | isActive | boolean | `true` |
   | bio | string | `Member of Willard Tigers Bowling Team` |
   | photoURL | string | `null` or empty |
   | createdAt | timestamp | Set to now |
   | updatedAt | timestamp | Set to now |

### Option B: Using Firebase Admin SDK (Automated - Advanced)

If you want to automate this, I can create a script that:
1. Reads from Stats app Firebase
2. Imports into WHS Firebase
3. Matches players by email/name

Let me know if you want Option B and I'll create it!

---

## Step 5: Test Everything (3 minutes)

1. **Sign Out** from https://willard-tigers-bowling.web.app

2. **Sign In** again with Google (davesfx@gmail.com)

3. You should now see **"Coach Dashboard"** in the navigation

4. Click **"Coach Dashboard"** - you should see:
   - Roster management
   - Team statistics
   - Add player button

5. Click **"Roster"** in navigation - you should see:
   - All 14 players with their stats
   - Clicking a player shows detailed modal

6. Test adding a new player (optional)

---

## What's Working Now:

✅ **Public Pages**: Home, Roster, Stats, Contact
✅ **Authentication**: Google Sign-In
✅ **Coach Dashboard**: Full roster management
✅ **Player Profiles**: With stats, photos, grades
✅ **Security**: Role-based access control
✅ **Design**: World-class monochrome aesthetic

---

## Next Steps (After Setup):

### 1. Stats App Integration
- Deploy Stats app to same Firebase project
- Stats app writes game data
- WHS site reads it (already configured!)

### 2. Player Onboarding
- Send each player their login credentials
- Players can upload profile photos
- Players can edit their bios

### 3. Content Management
- Add team announcements
- Upload team photos
- Create practice schedule

---

## Need Help?

**If something doesn't work:**
1. Check browser console (F12) for errors
2. Verify Firestore security rules are deployed
3. Make sure `role: "coach"` is exactly spelled in your user document
4. Ensure programId is `willard-tigers` (lowercase, hyphenated)

**If you want me to automate player import:**
Just say "automate player import" and I'll create a script that pulls from your Stats app Firebase!

---

## Summary of Manual Steps:

1. ✅ Enable Google Auth (2 min)
2. ✅ Sign in to get UID (1 min)
3. ✅ Create coach document (3 min)
4. ✅ Import 14 players (5 min per player = ~70 min total OR 10 min with automation)
5. ✅ Test everything (3 min)

**Total Time**: 15-90 minutes depending on automation choice

Let me know if you want me to create the automated import script!
