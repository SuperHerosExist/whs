# Deployment Guide - WHS Bowling Site

Complete deployment guide for production deployment to Google Cloud Platform and Firebase.

## Pre-Deployment Checklist

### 1. Firebase Project Setup

- [ ] Firebase project created at https://console.firebase.google.com
- [ ] Billing enabled on GCP project
- [ ] Authentication enabled (Email/Password, Google OAuth)
- [ ] Firestore database created (production mode)
- [ ] Cloud Storage bucket created
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)

### 2. Configuration Files

- [ ] `.env` file created from `.env.example` with production values
- [ ] `firebase.json` configured
- [ ] `firestore.rules` reviewed and tested
- [ ] `storage.rules` reviewed and tested
- [ ] `infrastructure.json` updated with correct GCP project ID

### 3. Security Review

- [ ] Firestore security rules tested
- [ ] Storage security rules tested
- [ ] Authentication flows tested
- [ ] Role-based access control verified
- [ ] File upload size limits configured
- [ ] CORS settings configured

### 4. Code Quality

- [ ] TypeScript compilation successful (`npm run build`)
- [ ] No ESLint errors
- [ ] All environment variables set
- [ ] Production build tested locally (`npm run preview`)

## Step 1: Initial Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase in project directory
cd c:\Users\daves\GCP-INFRA-BASE\gcp-mvps\WHS

# Select your Firebase project
firebase use --add

# Enter project ID when prompted
# Example: willard-tigers-bowling

# Set project alias
firebase use willard-tigers-bowling
```

## Step 2: Environment Configuration

Create `.env` file in project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx

# GCP Configuration
VITE_GCP_PROJECT_ID=your-project-id
VITE_GCP_REGION=us-central1

# Stats App Integration
VITE_STATS_APP_URL=https://stats.your-domain.com

# School Branding
VITE_SCHOOL_NAME="Willard High School"
VITE_TEAM_NAME="Tigers"
VITE_SCHOOL_MOTTO="Focused. Connected. Driven."
```

**IMPORTANT**: Never commit `.env` to version control!

## Step 3: Deploy Security Rules

Deploy Firestore and Storage security rules BEFORE deploying the app:

```bash
# Deploy all security rules and indexes
firebase deploy --only firestore:rules,firestore:indexes,storage:rules

# Verify deployment
firebase firestore:rules get
firebase storage:rules get
```

### Verify Security Rules

Test rules in Firebase Console:
1. Go to Firestore → Rules
2. Click "Rules Playground"
3. Test read/write operations for different user roles

## Step 4: Build Application

```bash
# Install dependencies (if not already done)
npm install

# Run TypeScript compilation and Vite build
npm run build

# Verify build output
ls dist/
```

Expected output in `dist/`:
- `index.html`
- `assets/` folder with bundled JS and CSS
- Static assets

## Step 5: Deploy to Firebase Hosting

```bash
# Deploy everything (hosting + rules)
firebase deploy

# OR deploy only hosting
firebase deploy --only hosting
```

After deployment, Firebase will output your hosting URL:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL: https://your-project.web.app
```

## Step 6: Custom Domain Setup (Optional)

### Add Custom Domain

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `willardtigersbowling.com`)
4. Follow verification steps:
   - Add TXT record to DNS
   - Wait for verification (can take up to 24 hours)
5. Add A records to point to Firebase:
   ```
   A    @    151.101.1.195
   A    @    151.101.65.195
   ```
6. SSL certificate will be provisioned automatically

### Update Environment Variables

After custom domain is set up, update `.env`:
```env
VITE_FIREBASE_AUTH_DOMAIN=willardtigersbowling.com
```

Rebuild and redeploy:
```bash
npm run build
firebase deploy --only hosting
```

## Step 7: Initialize First Coach Account

**CRITICAL**: Create the first coach account manually via Firebase Console:

1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Enter email and password
4. Copy the generated UID
5. Go to Firestore Database
6. Create document in `users` collection:
   ```json
   {
     "uid": "paste-uid-here",
     "email": "coach@willardschools.net",
     "displayName": "Coach Name",
     "role": "coach",
     "programId": "willard-tigers",
     "createdAt": (timestamp),
     "updatedAt": (timestamp)
   }
   ```

Now the coach can sign in and manage the team!

## Step 8: Stats App Integration

See [STATS_APP_INTEGRATION.md](./STATS_APP_INTEGRATION.md) for detailed steps.

**Quick Setup**:

1. Deploy Stats app to same Firebase project:
   ```bash
   cd /path/to/Stats
   firebase target:apply hosting stats stats-site
   firebase deploy --only hosting:stats
   ```

2. Update Stats app URL in `.env`:
   ```env
   VITE_STATS_APP_URL=https://stats.willardtigersbowling.com
   ```

3. Rebuild and redeploy WHS Site

## Step 9: Post-Deployment Verification

### Test Public Pages
- [ ] Home page loads correctly
- [ ] Navigation works
- [ ] All public pages accessible
- [ ] Contact form submits successfully
- [ ] Mobile responsive

### Test Authentication
- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] Google OAuth works
- [ ] Sign out works
- [ ] Password reset works

### Test Player Portal
- [ ] Player can access dashboard
- [ ] Profile editing works
- [ ] Photo upload works (max 5MB)
- [ ] Stats display correctly
- [ ] Link to Stats app works

### Test Coach Portal
- [ ] Coach can access dashboard
- [ ] Roster management works
- [ ] Player activation/deactivation works
- [ ] Team stats display correctly
- [ ] Schedule management accessible

### Test Security
- [ ] Public users cannot access protected routes
- [ ] Players cannot access coach routes
- [ ] Players can only edit their own profiles
- [ ] Coaches can edit all player profiles
- [ ] File upload size limits enforced
- [ ] File type validation works

## Continuous Deployment with GitHub Actions

### Setup

1. Generate Firebase CI token:
   ```bash
   firebase login:ci
   ```

2. Copy the token

3. Add to GitHub repository secrets:
   - Go to Settings → Secrets → Actions
   - Add `FIREBASE_TOKEN` with the token value

4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          VITE_STATS_APP_URL: ${{ secrets.VITE_STATS_APP_URL }}

      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

5. Add all environment variables to GitHub Secrets

Now every push to `main` will auto-deploy!

## Monitoring and Maintenance

### Firebase Console

Monitor your app in Firebase Console:
- **Authentication**: User signups, active users
- **Firestore**: Database usage, reads/writes
- **Storage**: File uploads, storage usage
- **Hosting**: Traffic, bandwidth
- **Performance**: Page load times, errors

### Set Up Alerts

1. Go to Firebase Console → Project Settings → Integrations
2. Enable Cloud Monitoring
3. Set up alerts for:
   - High error rates
   - Unusual traffic spikes
   - Storage quota approaching limit
   - Database read/write quotas

### Backup Strategy

1. **Firestore Backups**:
   ```bash
   # Export Firestore data
   gcloud firestore export gs://your-bucket/backups/$(date +%Y%m%d)
   ```

2. **Scheduled Backups** (Cloud Scheduler + Cloud Functions):
   - Set up weekly automated backups
   - Retain backups for 90 days

### Updates and Maintenance

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Test after updates
npm run build
npm run preview

# Deploy if all tests pass
firebase deploy
```

## Troubleshooting

### Deployment Fails

```bash
# Check Firebase CLI version
firebase --version

# Update Firebase CLI
npm install -g firebase-tools@latest

# Clear build cache
rm -rf dist node_modules .vite
npm install
npm run build
firebase deploy
```

### Security Rules Errors

```bash
# Validate rules locally
firebase emulators:start

# Check rules syntax
firebase deploy --only firestore:rules --dry-run

# View deployed rules
firebase firestore:rules get
```

### Performance Issues

1. Enable Gzip compression (already configured in `firebase.json`)
2. Optimize images (use WebP format)
3. Enable caching headers (already configured)
4. Check bundle size:
   ```bash
   npm run build
   # Check dist/ folder size
   ```

### Authentication Issues

1. Check Firebase Console → Authentication → Sign-in method
2. Verify authorized domains
3. Check CORS settings
4. Test in incognito mode

## Rollback Procedure

If deployment causes issues:

```bash
# View deployment history
firebase hosting:releases

# Rollback to previous version
firebase hosting:rollback
```

## Cost Estimation

**Free Tier Limits**:
- Firestore: 1 GiB storage, 50K reads/day, 20K writes/day
- Storage: 5 GB storage, 1 GB downloads/day
- Hosting: 10 GB storage, 360 MB/day downloads
- Authentication: Unlimited

**Expected Monthly Cost** (with 200 active users):
- ~$0-5 for small team website
- Costs increase with Stats app usage

Monitor usage in Firebase Console → Usage and Billing

## Support

For deployment issues:
- Check Firebase status: https://status.firebase.google.com
- Firebase documentation: https://firebase.google.com/docs
- GCP support: https://cloud.google.com/support

---

**Deployment completed! Your world-class bowling site is live!**
