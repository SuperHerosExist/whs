# 🎳 WHS Site + Stats App Integration Plan

## Current Situation

**WHS Bowling Site:**
- Firebase Project: `willard-tigers-bowling`
- Deployed at: https://willard-tigers-bowling.web.app
- Status: ✅ Live with world-class design

**Stats App:**
- Firebase Project: `bowlingstatstracker`
- Has: ~14 real players with stats
- Status: Existing app with real data

---

## Integration Strategy: Shared Firebase Project

### What We'll Do:

**Migrate WHS site to use the Stats app Firebase project (`bowlingstatstracker`)**

This gives you:
- ✅ Single source of truth for all data
- ✅ Real player data immediately available
- ✅ Stats automatically sync between apps
- ✅ No duplicate data management
- ✅ Simpler maintenance

---

## Migration Steps

### Step 1: Update WHS .env with Stats App Firebase Config

1. Get Stats app Firebase config from console:
   https://console.firebase.google.com/project/bowlingstatstracker/settings/general

2. Update WHS `.env` file with those credentials

### Step 2: Redeploy Security Rules to Stats Project

```bash
cd WHS
firebase use bowlingstatstracker
firebase deploy --only firestore:rules,storage:rules
```

### Step 3: Rebuild and Redeploy WHS Site

```bash
npm run build
firebase deploy --only hosting
```

### Step 4: Create Coach Account

1. Enable Google Auth in `bowlingstatstracker` project
2. Sign in with davesfx@gmail.com
3. Create coach user document in Firestore

---

## Alternative: Keep Separate Projects

If you want to keep them separate, we can:

1. **Export players from bowlingstatstracker**
2. **Import to willard-tigers-bowling**
3. **Set up periodic sync** (more complex)

---

## Recommendation: USE SHARED PROJECT

**Why?**
- This was the original plan (Option 1 in STATS_APP_INTEGRATION.md)
- Eliminates data duplication
- Real-time sync
- Simpler architecture
- Lower costs (one Firebase project)

**Do you want me to:**
1. ✅ Migrate WHS to use `bowlingstatstracker` project?
2. ❌ Keep separate and create import script?

Let me know and I'll execute immediately!
