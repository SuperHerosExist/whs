# Testing Guide - WHS Bowling Site

Comprehensive testing procedures for ensuring the WHS Bowling Site is production-ready.

## Testing Environment Setup

### Local Testing

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build and preview production build
npm run build
npm run preview
```

### Firebase Emulator Testing

```bash
# Install Firebase emulators
firebase init emulators

# Select: Authentication, Firestore, Storage

# Start emulators
firebase emulators:start

# Update .env to use emulators
# VITE_FIREBASE_AUTH_DOMAIN=localhost:9099
# VITE_FIREBASE_FIRESTORE_URL=localhost:8080
# VITE_FIREBASE_STORAGE_URL=localhost:9199
```

## Manual Testing Checklist

### 1. Public Website Testing

#### Home Page
- [ ] Page loads without errors
- [ ] Hero section displays correctly
- [ ] Team stats cards show properly
- [ ] Recent highlights section populated
- [ ] "Join the Team" button navigates to contact page
- [ ] "Meet the Team" button navigates to roster page
- [ ] Responsive on mobile, tablet, desktop
- [ ] Images load correctly
- [ ] All links work

#### About Page
- [ ] Mission statement displays
- [ ] Core values cards render correctly
- [ ] Program history section shows
- [ ] School motto displays
- [ ] Responsive layout
- [ ] All content readable

#### Roster Page
- [ ] Players list loads from Firestore
- [ ] Grade filter works correctly
- [ ] Player cards display with correct information
- [ ] Photos display or show default avatar
- [ ] Stats show correctly (average, high game)
- [ ] No players message shows when empty
- [ ] Responsive grid layout
- [ ] Loading state shows while fetching

#### Schedule Page
- [ ] Events load from Firestore
- [ ] Filter tabs work (upcoming/past/all)
- [ ] Event cards display correctly
- [ ] Date formatting correct
- [ ] Event types color-coded properly
- [ ] Past events show results when available
- [ ] Empty state shows appropriately
- [ ] Responsive layout

#### Stats Page
- [ ] Team statistics calculate correctly
- [ ] Top performers table displays
- [ ] Leaderboard sorted by average
- [ ] Grade badges show correctly
- [ ] Link to Stats app works
- [ ] Loading states display
- [ ] Empty state for no data

#### Contact Page
- [ ] Form displays correctly
- [ ] All fields validate properly
- [ ] Form submission creates Firestore document
- [ ] Success message shows after submission
- [ ] Form clears after submission
- [ ] Error handling works
- [ ] Responsive layout
- [ ] Practice schedule displays

### 2. Authentication Testing

#### Sign Up Flow
- [ ] Sign up page loads
- [ ] Email validation works
- [ ] Password requirements enforced (min 6 chars)
- [ ] Confirm password validation
- [ ] Form submission creates user in Auth
- [ ] User document created in Firestore
- [ ] Player document created
- [ ] Redirects to player dashboard after signup
- [ ] Error messages display for failures
- [ ] Google OAuth signup works (if enabled)

#### Sign In Flow
- [ ] Sign in page loads
- [ ] Email/password authentication works
- [ ] Error messages for invalid credentials
- [ ] Successful login redirects appropriately
  - Player → player dashboard
  - Coach → coach dashboard
- [ ] Session persists on page reload
- [ ] "Remember me" functionality
- [ ] Forgot password link works

#### Sign Out Flow
- [ ] Sign out button visible when logged in
- [ ] Sign out clears session
- [ ] Redirects to home page
- [ ] Protected routes inaccessible after signout

### 3. Player Dashboard Testing

#### Profile Management
- [ ] Dashboard loads with player data
- [ ] Profile photo displays or shows default
- [ ] Stats summary shows correctly
- [ ] Form pre-populated with existing data
- [ ] Name field editable
- [ ] Email field disabled (correct behavior)
- [ ] Grade dropdown works
- [ ] Graduation year input validates
- [ ] Jersey number accepts valid input
- [ ] Bio textarea with character count
- [ ] Save button updates Firestore
- [ ] Success message shows after save
- [ ] Error handling for failed saves
- [ ] Form validation works

#### Photo Upload
- [ ] File picker opens on camera icon click
- [ ] File type validation (images only)
- [ ] File size validation (max 5MB)
- [ ] Upload progress indication
- [ ] Photo displays immediately after upload
- [ ] Photo URL saved to Firestore
- [ ] Error messages for invalid files
- [ ] Error messages for oversized files

#### Stats Display
- [ ] Average score displays correctly
- [ ] High game displays correctly
- [ ] Games played count accurate
- [ ] Link to Stats app functional
- [ ] Opens in new tab
- [ ] Authentication carries over (if shared Firebase)

### 4. Coach Dashboard Testing

#### Overview Tab
- [ ] Team stats calculate correctly
- [ ] Total players count accurate
- [ ] Team average calculates from all players
- [ ] Total games sums correctly
- [ ] Quick action buttons work
- [ ] Upcoming events display
- [ ] Event sorting correct (chronological)
- [ ] Empty states show when no data

#### Roster Management Tab
- [ ] Players table loads all active players
- [ ] Player photos display correctly
- [ ] Email addresses shown
- [ ] Grades display
- [ ] Statistics accurate
- [ ] Active/Inactive toggle works
- [ ] Status updates Firestore
- [ ] Add player button visible
- [ ] Edit button functional (when implemented)
- [ ] Table responsive on mobile
- [ ] Empty state for no players

#### Schedule Management Tab
- [ ] Placeholder displays correctly
- [ ] Add event button visible
- [ ] Links to public schedule work

### 5. Security Testing

#### Role-Based Access Control
- [ ] Public users cannot access /player/* routes
- [ ] Public users cannot access /coach/* routes
- [ ] Players cannot access /coach/* routes
- [ ] Coaches can access all routes
- [ ] Unauthenticated users redirected to signin
- [ ] Wrong role redirected appropriately

#### Firestore Security Rules
```bash
# Test in Firebase Console Rules Playground

# Test 1: Public read of published content
# Role: None
# Operation: get /publicContent/{id} where isPublished=true
# Expected: Allow

# Test 2: Player reads own profile
# Role: Player (UID: player123)
# Operation: get /players/player123
# Expected: Allow

# Test 3: Player tries to read another player
# Role: Player (UID: player123)
# Operation: get /players/player456
# Expected: Deny

# Test 4: Coach reads any player
# Role: Coach
# Operation: get /players/player123
# Expected: Allow

# Test 5: Player updates own profile
# Role: Player (UID: player123)
# Operation: update /players/player123 (limited fields)
# Expected: Allow

# Test 6: Player tries to update stats
# Role: Player
# Operation: update /players/{id} with averageScore
# Expected: Deny

# Test 7: Coach updates player
# Role: Coach
# Operation: update /players/{id}
# Expected: Allow
```

#### Storage Security Rules
```bash
# Test in Firebase Console

# Test 1: Player uploads own photo
# User: player123
# Operation: create /player-profiles/player123/photo.jpg
# Expected: Allow

# Test 2: Player uploads oversized file
# User: player123
# Operation: create /player-profiles/player123/large.jpg (6MB)
# Expected: Deny

# Test 3: Player uploads wrong file type
# User: player123
# Operation: create /player-profiles/player123/file.pdf
# Expected: Deny

# Test 4: Player tries to upload to another's folder
# User: player123
# Operation: create /player-profiles/player456/photo.jpg
# Expected: Deny

# Test 5: Coach uploads team photo
# User: coach123 (role=coach)
# Operation: create /team-photos/team.jpg
# Expected: Allow
```

### 6. Performance Testing

#### Page Load Performance
```bash
# Build production version
npm run build
npm run preview

# Open Chrome DevTools
# Go to Lighthouse tab
# Run audit

# Target Scores:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 95+
```

#### Network Performance
- [ ] Initial page load < 3 seconds
- [ ] Time to Interactive < 4 seconds
- [ ] First Contentful Paint < 1.5 seconds
- [ ] Images lazy load
- [ ] Bundle size reasonable (~200KB gzipped)
- [ ] No console errors
- [ ] No 404s on assets

### 7. Mobile Testing

#### Responsive Design
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPhone 12 Pro (390px)
- [ ] Test on iPad (768px)
- [ ] Test on Desktop (1920px)
- [ ] Navigation collapses on mobile
- [ ] Forms usable on mobile
- [ ] Tables scroll/adapt on mobile
- [ ] Touch targets adequate size (44px min)
- [ ] Text readable without zooming

#### Mobile Browsers
- [ ] Safari iOS
- [ ] Chrome Mobile
- [ ] Firefox Mobile
- [ ] Samsung Internet

### 8. Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] No console errors in any browser
- [ ] Consistent appearance
- [ ] All features functional

### 9. Data Integrity Testing

#### Firestore Data
- [ ] User creation works correctly
- [ ] Player profiles sync with auth
- [ ] Stats update from Stats app (if integrated)
- [ ] Contact submissions save
- [ ] Timestamps accurate
- [ ] No orphaned documents
- [ ] Indexes created correctly

#### Photo Uploads
- [ ] Photos save to correct Storage path
- [ ] URLs save to Firestore correctly
- [ ] Old photos not deleted (or handled appropriately)
- [ ] Photos accessible via URL
- [ ] CORS configured correctly

### 10. Error Handling Testing

#### Network Errors
- [ ] Offline mode graceful
- [ ] Network timeout handling
- [ ] Retry logic for failed requests
- [ ] User-friendly error messages

#### Form Errors
- [ ] Validation errors clear
- [ ] Error messages helpful
- [ ] Errors dismissible
- [ ] Form state preserved on error

#### Authentication Errors
- [ ] Invalid credentials message
- [ ] Email already in use message
- [ ] Weak password message
- [ ] Session expired handling

## Automated Testing

### Unit Tests (Future Enhancement)

```bash
# Install testing libraries
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Coverage
npm run test:coverage
```

### E2E Tests (Future Enhancement)

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test

# Run with UI
npx playwright test --ui
```

## Test Data Seeding

### Seed Test Players

```javascript
// scripts/seed-players.js
const players = [
  {
    uid: 'test-player-1',
    name: 'Test Player 1',
    email: 'player1@test.com',
    grade: '12',
    graduationYear: 2025,
    averageScore: 215,
    highGame: 289,
    gamesPlayed: 25,
    programId: 'willard-tigers',
    isActive: true,
  },
  // ... more test players
];

// Add to Firestore
```

## Security Audit

### Pre-Deployment Security Check
- [ ] No API keys in source code
- [ ] .env not committed
- [ ] Security rules deployed
- [ ] File upload restrictions enforced
- [ ] Rate limiting configured (if applicable)
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection enabled
- [ ] CSRF protection (if applicable)

### Compliance Check
- [ ] FERPA compliance (student data protection)
- [ ] COPPA compliance (youth privacy)
- [ ] No PII exposed in logs
- [ ] Data retention policy documented
- [ ] Backup strategy in place

## Bug Reporting Template

```markdown
## Bug Report

**Description**:
Clear description of the bug

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. See error

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happened

**Screenshots**:
If applicable

**Environment**:
- Browser:
- Device:
- OS:
- User Role:

**Console Errors**:
Copy any console errors

**Additional Context**:
Any other relevant information
```

## Testing Sign-Off

Before deployment, all sections must be tested and signed off:

- [ ] Public Website Testing - Complete
- [ ] Authentication Testing - Complete
- [ ] Player Dashboard Testing - Complete
- [ ] Coach Dashboard Testing - Complete
- [ ] Security Testing - Complete
- [ ] Performance Testing - Complete
- [ ] Mobile Testing - Complete
- [ ] Cross-Browser Testing - Complete
- [ ] Data Integrity Testing - Complete
- [ ] Error Handling Testing - Complete

**Tested by**: _______________
**Date**: _______________
**Approved for Deployment**: Yes / No

---

**Ready for production when all tests pass!**
