# Quick Start Guide - WHS Bowling Site

Get the Willard Tigers Bowling Site up and running in under 30 minutes!

## Prerequisites

Before you begin, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Google account with billing enabled
- [ ] 30 minutes of time

## Step 1: Firebase Project Setup (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `willard-tigers-bowling`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firebase Services (5 minutes)

### Authentication
1. In Firebase Console, click "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider
4. Enable "Google" provider (optional)

### Firestore Database
1. Click "Firestore Database"
2. Click "Create database"
3. Select "Production mode"
4. Choose location: `us-central1`
5. Click "Enable"

### Cloud Storage
1. Click "Storage"
2. Click "Get started"
3. Select "Production mode"
4. Use default location
5. Click "Done"

### Get Firebase Config
1. Click gear icon (⚙️) → "Project settings"
2. Scroll to "Your apps"
3. Click "</>" (Web app)
4. Register app name: "WHS Bowling Site"
5. Copy the firebaseConfig object

## Step 3: Install Dependencies (2 minutes)

```bash
# Navigate to project directory
cd c:\Users\daves\GCP-INFRA-BASE\gcp-mvps\WHS

# Install dependencies
npm install

# Install Firebase CLI globally
npm install -g firebase-tools
```

## Step 4: Configure Environment (3 minutes)

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` with your Firebase config from Step 2:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. Update GCP config:
   ```env
   VITE_GCP_PROJECT_ID=your-project-id
   VITE_GCP_REGION=us-central1
   ```

## Step 5: Test Locally (3 minutes)

```bash
# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

You should see the Willard Tigers Bowling home page!

**Test the following:**
- [ ] Home page loads
- [ ] Navigation works
- [ ] All pages accessible
- [ ] No console errors

Press `Ctrl+C` to stop the dev server.

## Step 6: Deploy Security Rules (2 minutes)

```bash
# Login to Firebase
firebase login

# Initialize Firebase
firebase use --add
# Select your project when prompted

# Deploy security rules
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

## Step 7: Build and Deploy (5 minutes)

```bash
# Build production version
npm run build

# Deploy to Firebase Hosting
firebase deploy

# Note the hosting URL provided after deployment
```

## Step 8: Create First Coach Account (3 minutes)

1. Go to your deployed site URL
2. Click "Sign Up"
3. Create account with your email
4. Go to [Firebase Console](https://console.firebase.google.com) → Authentication
5. Find your user and copy the UID
6. Go to Firestore Database
7. Find the `users` collection
8. Open your user document
9. Edit the document and change:
   ```json
   {
     "role": "coach"
   }
   ```
10. Sign out and sign back in
11. You should now have coach access!

## Step 9: Verify Everything Works (2 minutes)

### As Coach:
- [ ] Access coach dashboard
- [ ] View team overview
- [ ] Access roster management
- [ ] All features load without errors

### Create Test Player:
1. Sign out
2. Sign up with a different email
3. Sign in as player
4. Access player dashboard
5. Upload profile photo
6. Edit profile
7. Verify Stats link works

### Public Access:
1. Open site in incognito/private window
2. View all public pages
3. Submit contact form
4. Verify can't access protected pages

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run linter

# Firebase
firebase login           # Login to Firebase
firebase deploy          # Deploy everything
firebase deploy --only hosting              # Deploy hosting only
firebase deploy --only firestore:rules      # Deploy rules only
firebase emulators:start # Start local emulators

# Troubleshooting
rm -rf node_modules dist .vite    # Clear cache
npm install                        # Reinstall dependencies
npm run build                      # Rebuild
```

## Common Issues and Solutions

### Issue: "Module not found" errors
**Solution:**
```bash
rm -rf node_modules
npm install
```

### Issue: Firebase deployment fails
**Solution:**
```bash
firebase login
firebase use --add
firebase deploy --debug
```

### Issue: Security rules errors
**Solution:**
Check the Firebase Console → Firestore → Rules
Ensure rules were deployed successfully

### Issue: Photos not uploading
**Solution:**
1. Check Storage rules deployed
2. Check file size < 5MB
3. Check file is an image
4. Check browser console for errors

### Issue: Can't sign in
**Solution:**
1. Check Authentication enabled in Firebase Console
2. Check email/password provider enabled
3. Clear browser cache
4. Try different browser

## Next Steps

### Customize Branding
1. Edit `src/config/branding.ts`
2. Update school information
3. Add coach contact details
4. Rebuild and redeploy

### Add Team Logo
1. Add logo image to `public/` folder
2. Update `index.html` favicon
3. Update `src/components/layout/Header.tsx`
4. Rebuild and redeploy

### Setup Custom Domain
1. Go to Firebase Console → Hosting
2. Add custom domain
3. Follow DNS setup instructions
4. Wait for SSL provisioning

### Integrate Stats App
See [STATS_APP_INTEGRATION.md](./STATS_APP_INTEGRATION.md)

### Add Players
As coach:
1. Go to Coach Dashboard → Roster Management
2. Click "Add Player"
3. Enter player information
4. Player receives email to create account

## Success Checklist

Your site is ready for production when:
- [x] All pages load without errors
- [x] Authentication works (sign up, sign in, sign out)
- [x] Player dashboard functional
- [x] Coach dashboard functional
- [x] Photo uploads work
- [x] Contact form submits
- [x] Mobile responsive
- [x] Security rules deployed
- [x] Custom branding applied
- [x] At least one coach account created

## Getting Help

### Documentation
- **Full Documentation**: [README.md](./README.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Testing Guide**: [TESTING.md](./TESTING.md)
- **Stats Integration**: [STATS_APP_INTEGRATION.md](./STATS_APP_INTEGRATION.md)
- **Project Summary**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

### Firebase Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)
- [Firebase Status](https://status.firebase.google.com)

### Support
- Check browser console for errors
- Review Firebase Console logs
- Check security rules in Firebase Console
- Verify environment variables in `.env`

---

## 🎉 Congratulations!

Your Willard Tigers Bowling Site is now live!

**What you've accomplished:**
- ✅ Professional school website deployed
- ✅ Secure authentication system
- ✅ Role-based access control
- ✅ Player and coach dashboards
- ✅ Photo upload system
- ✅ GCP infrastructure in place
- ✅ Production-ready and secure

**Share your site:**
- Team members
- Parents
- School administration
- Prospective bowlers

**Focused. Connected. Driven.**

*Go Tigers!* 🐯🎳
