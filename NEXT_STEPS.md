# 🎳 NEXT STEPS - Complete Coach Account Setup

## What We Just Deployed ✅

Your WHS Bowling Site is now LIVE with:
- **World-class monochrome design** (black/white/grey with MASSIVE energy)
- **Prominent Google Sign-In button** on the sign-in page
- **Stats App integration** (shared Firebase project: bowlingstatstracker)
- **Site URL:** https://bowlingstatstracker.web.app

---

## Step 1: Sign In with Google (2 minutes)

1. **Visit:** https://bowlingstatstracker.web.app

2. **Click "Sign In"** button in top-right corner

3. You'll see a **MASSIVE Google Sign-In button** that says:
   ```
   SIGN IN WITH GOOGLE
   ```

4. **Click it** and select **davesfx@gmail.com**

5. You should be signed in successfully!

---

## Step 2: Get Your UID (1 minute)

After signing in with Google:

1. **Open browser console** (Press F12 or right-click → Inspect)

2. Click the **Console** tab

3. **Type this command:**
   ```javascript
   auth.currentUser.uid
   ```
   OR if that doesn't work, try:
   ```javascript
   firebase.auth().currentUser.uid
   ```

4. **Copy the UID** (looks like: `xYz123AbC456...`)

5. **Save it** - you'll need it in the next step!

---

## Step 3: Create Coach Account in Firestore (3 minutes)

1. **Go to Firestore Console:**
   https://console.firebase.google.com/project/bowlingstatstracker/firestore

2. Look for the **`users`** collection
   - If you see it, click on it
   - If you don't see it, click **"+ Start collection"**, enter `users`, click Next

3. **Click "Add document"** (or "+ Add document" if collection exists)

4. **Document ID:** Paste your UID from Step 2

5. **Add these fields exactly:**

   | Field         | Type      | Value                          |
   |---------------|-----------|--------------------------------|
   | email         | string    | `davesfx@gmail.com`           |
   | displayName   | string    | `Coach Stevens`               |
   | role          | string    | `coach`                        |
   | programId     | string    | `willard-tigers`              |
   | createdAt     | timestamp | Click clock icon → set to now |
   | updatedAt     | timestamp | Click clock icon → set to now |

6. **Click "Save"**

---

## Step 4: Verify Coach Access (1 minute)

1. **Go back to:** https://bowlingstatstracker.web.app

2. **Refresh the page** (Ctrl+R or Cmd+R)

3. **You should now see:**
   - "Coach Dashboard" link in navigation
   - Your name in the header
   - Access to coach-only features

4. **Click "Coach Dashboard"** to see:
   - Roster management
   - Team statistics
   - Add player functionality

---

## Step 5: Verify Stats Integration

Since we migrated to the **bowlingstatstracker** Firebase project:

1. **Check if players from Stats app appear** in the Roster

2. **If you see real player data:**
   - ✅ Integration complete!
   - Stats will automatically sync

3. **If you don't see players:**
   - You may need to check the `players` collection in Firestore
   - Or we can create a migration script to import them

---

## What's Next?

After completing these steps, you can:

### 1. **Add Player Accounts**
   - Players sign in with Google
   - They'll automatically get "player" role
   - Can edit their profiles and bios

### 2. **Upload Team Photos**
   - Use the Coach Dashboard
   - Add photos to the gallery
   - Showcase your team!

### 3. **Create Content**
   - Post announcements
   - Share achievements
   - Update schedule

### 4. **Deploy Stats App to Same Project**
   - Stats app writes game data
   - WHS site displays it automatically
   - Perfect integration!

---

## Need Help?

**If Step 2 (Get UID) doesn't work:**
- The auth object might not be exposed globally
- Instead, after signing in, look at the URL
- Or check your profile in Firebase Authentication console

**If Coach Dashboard doesn't appear:**
- Verify the `role` field is exactly `coach` (lowercase)
- Verify the `programId` is exactly `willard-tigers` (lowercase, hyphenated)
- Try signing out and signing back in

**If you want to see what's in Firestore:**
- Go to: https://console.firebase.google.com/project/bowlingstatstracker/firestore
- Check the `users` collection
- Check the `players` collection (if it exists)

---

## Summary

1. ✅ **Sign in** with Google at https://bowlingstatstracker.web.app
2. ✅ **Get your UID** from browser console
3. ✅ **Create coach document** in Firestore with your UID
4. ✅ **Refresh** and verify Coach Dashboard access
5. ✅ **Enjoy your world-class bowling site!** 🎳

The site is now ready for you to take control and manage your team!
