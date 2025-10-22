# Testing Checklist - WHS Bowling Site

## Dev Server Running ✅
- **URL:** http://localhost:5173/
- **Status:** Running and ready
- **Network:** http://192.168.4.30:5173/ (for mobile testing)

---

## Pages to Test

### 1. Home Page
**URL:** http://localhost:5173/

**Check:**
- [ ] Desktop layout is properly centered
- [ ] Stats cards are large and prominent
- [ ] "LIVE STATS" section shows real numbers (not 0)
- [ ] Team Average shows ~192
- [ ] Active Athletes shows 14
- [ ] Browser console shows: `✅ Home page: 14 players, 192 avg`

**Mobile:**
- [ ] Hero section looks good
- [ ] Stats cards have proper spacing
- [ ] CTA buttons are easy to tap

---

### 2. Roster Page
**URL:** http://localhost:5173/roster

**Check:**
- [ ] Shows 14 player cards
- [ ] Mila Collins appears in the list
- [ ] Each card shows: name, grade, average, high game
- [ ] Averages are NOT all 0
- [ ] Clicking a player shows detailed stats
- [ ] Browser console shows: `✅ Loaded 14 players from Stats app`

**Mila Collins Card:**
- [ ] Name: "Mila Collins"
- [ ] Grade: 11
- [ ] Average: 160
- [ ] High Game: 230

---

### 3. Stats Page
**URL:** http://localhost:5173/stats

**Check:**
- [ ] Team Average shows ~192 (not 0)
- [ ] High Game shows 289 (not 0)
- [ ] Total Games shows >0
- [ ] Active Players shows 14
- [ ] Top Performers table has rows
- [ ] Mila Collins appears in leaderboard
- [ ] Browser console shows: `✅ Loaded stats for 14 players`

---

### 4. Contact Page
**URL:** http://localhost:5173/contact

**Check:**
- [ ] Form looks professional
- [ ] All fields present: name, email, phone, grade, experience, message
- [ ] Submitting form shows success message
- [ ] Data saves to Firestore contactSubmissions collection

---

### 5. Sign In Page
**URL:** http://localhost:5173/signin

**Check:**
- [ ] Google Sign-In button is prominent
- [ ] Email/password form is visible
- [ ] Clicking Google Sign-In opens popup (may be blocked)
- [ ] If blocked, try email/password instead

**If Firebase Auth Error:**
1. Go to Firebase Console > Authentication > Settings
2. Add `localhost` to Authorized domains
3. Clear browser cache
4. Try again

---

### 6. Profile Pages (After Sign In)

**Player Dashboard:**
- [ ] Profile loads without errors
- [ ] Grade field is optional (no red asterisk)
- [ ] "Coach/Staff" option available in dropdown
- [ ] Photo upload button works
- [ ] Can save profile without grade

**Coach Dashboard:**
- [ ] Shows team roster
- [ ] Can manage players
- [ ] Stats display correctly

---

## Browser Console Checks

Open DevTools (F12) and look for these messages:

### Success Messages:
```
✅ Home page: 14 players, 192 avg
✅ Loaded 14 players from Stats app (Team: MpyIVpCIsFSyqEdPID1O)
✅ Loaded stats for 14 players from Stats app (Team: MpyIVpCIsFSyqEdPID1O)
   Team Average: 192, High Game: 289, Total Games: 170
```

### NO Errors Like:
```
❌ Error fetching players from Stats app
❌ Error fetching home stats
❌ Firebase: Error (auth/...)
```

---

## Mobile Testing

Use your phone to visit: http://192.168.4.30:5173/

**Check:**
- [ ] Hero section has proper spacing
- [ ] Stats cards don't overlap
- [ ] Navigation works on mobile
- [ ] Forms are easy to use
- [ ] Buttons are large enough to tap

---

## Desktop Testing

**Check Different Widths:**
1. **Full Screen (1920px+)**
   - [ ] Content centered with max-width
   - [ ] No excessive white space on sides
   - [ ] Stats grid spans full width
   - [ ] Looks professional

2. **Laptop (1366px)**
   - [ ] Layout adapts smoothly
   - [ ] Stats cards resize properly
   - [ ] Text is readable

3. **Tablet (768px)**
   - [ ] Grid switches to 2 columns
   - [ ] Navigation collapses
   - [ ] Images scale correctly

---

## Data Validation

### Expected Numbers:
- **Team Average:** ~190-195
- **Total Players:** 14
- **Highest Game:** 289 (Alex Thompson)
- **Total Games:** ~160-180

### Top 5 Players (by average):
1. Alex Thompson - 215
2. Tyler Johnson - 210
3. Michael Chen - 205
4. Ethan Brown - 203
5. Sarah Martinez - 198

**Mila Collins Should Appear:** Around position 11-12 with 160 average

---

## Common Issues & Fixes

### Issue: Stats Show 0
**Fix:** Check Firestore rules in bowlingstatstracker project:
```javascript
match /teams/{teamId}/players/{playerId} {
  allow read: if true;
}
```

### Issue: No Players Load
**Fix:** Verify environment variable:
```env
VITE_STATS_TEAM_ID=MpyIVpCIsFSyqEdPID1O
```

### Issue: Firebase Auth Error
**Fix:**
1. Add localhost to authorized domains
2. Clear cache
3. Use email/password signin

### Issue: Build Errors
**Fix:** Run `npm run build` and check console for TypeScript errors

---

## Performance Checks

### Page Load Times:
- [ ] Home loads in < 2 seconds
- [ ] Roster loads in < 3 seconds
- [ ] Stats loads in < 3 seconds

### Firebase Reads:
- [ ] Home: ~1 read (players collection)
- [ ] Roster: ~1 read (players collection)
- [ ] Stats: ~1 read (players collection)

Total reads per session: ~3 (well within free tier)

---

## Final Checks Before Deploy

- [ ] All pages load without errors
- [ ] Real data shows on all pages
- [ ] Mila Collins appears with correct stats
- [ ] Desktop layout looks professional
- [ ] Mobile layout is responsive
- [ ] Forms work and save data
- [ ] Authentication works (Google or email)
- [ ] Console has no critical errors
- [ ] Build succeeds: `npm run build`

---

## Deploy

Once all checks pass:

```bash
# 1. Build for production
npm run build

# 2. Test production build locally
npm run preview

# 3. Deploy to Firebase
firebase deploy

# 4. Test live site
# Visit: https://willard-tigers-bowling.web.app
```

---

## Success Criteria

✅ **Desktop:** Looks world-class, properly centered, full-width utilization
✅ **Mobile:** Clean spacing, easy navigation, touch-friendly
✅ **Data:** Shows 14 real bowlers including Mila Collins
✅ **Stats:** Displays live averages, high games, leaderboards
✅ **Integration:** Stats app data flows correctly
✅ **Build:** No TypeScript or build errors
✅ **Deploy:** Live site works without issues

---

## Test Now!

1. Open http://localhost:5173/ in your browser
2. Check each page in order
3. Open browser console (F12) to see logs
4. Verify Mila Collins appears with stats
5. Test on mobile device
6. Run through this checklist

**When all checks pass, you're ready to deploy!** 🚀
