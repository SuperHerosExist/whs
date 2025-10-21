# Import Players from Stats App to WHS Site

## Prerequisites
1. Stats app Firebase project ID
2. Both projects should use the same Firebase account (davesfx@gmail.com)

## Option 1: Share Firebase Project (Recommended)

Since both apps are for the same team, the EASIEST approach is:

### Use the SAME Firebase project for both apps!

**Benefits:**
- Players automatically sync
- Stats automatically appear on WHS site
- No duplicate data
- No import needed

**How to do it:**

1. **Update WHS .env file** to use Stats app Firebase project:
   ```env
   VITE_FIREBASE_PROJECT_ID=<your-stats-app-project-id>
   # Copy ALL Firebase config from Stats app
   ```

2. **Rebuild and redeploy WHS:**
   ```bash
   npm run build
   firebase use <stats-app-project-id>
   firebase deploy --only hosting
   ```

3. **Done!** Both apps now share the same database.

---

## Option 2: Manual Player Export/Import

If you need separate Firebase projects:

### Step 1: Export from Stats App

1. Go to Stats app Firestore:
   ```
   https://console.firebase.google.com/project/<stats-app-id>/firestore
   ```

2. Click on `players` collection

3. For each player document, copy the data

4. Create a `players.json` file:
   ```json
   [
     {
       "name": "Alex Johnson",
       "email": "alex.johnson@willard.edu",
       "grade": "12",
       "averageScore": 215,
       "highGame": 289,
       "gamesPlayed": 24
     },
     ... (repeat for all 14 players)
   ]
   ```

### Step 2: Import to WHS

1. Save the JSON file

2. I can create a script to import it automatically

3. Or manually add each player via Firestore console (see SETUP_INSTRUCTIONS.md Step 4)

---

## Option 3: Automated Script (If needed)

If you want me to create an automated import script:

1. Give me your Stats app Firebase project ID
2. I'll create a script that:
   - Connects to Stats app
   - Reads player data
   - Creates corresponding records in WHS
   - Matches by email to avoid duplicates

---

## Recommended Approach: OPTION 1 (Shared Project)

**This is what the original requirements specified:**
> "Stats App integration will go with option #1 which was the recommended option per the stats_app_integration.md file"

**Option 1 = Shared Firebase Project**

This means:
- WHS site and Stats app use THE SAME Firebase project
- No import needed
- Data syncs automatically
- Perfect integration

**Want me to configure this?** Just say "use shared Firebase project" and I'll:
1. Update WHS to use Stats app Firebase config
2. Redeploy everything
3. Verify integration works

This is by far the cleanest solution!
