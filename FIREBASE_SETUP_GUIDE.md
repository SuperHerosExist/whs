# Firebase Project Setup Guide

## ⚠️ IMPORTANT: Complete These Steps Before Deployment

This guide walks you through creating and configuring your Firebase project. **You must complete these steps before the application can be deployed.**

## Prerequisites

- [ ] Google account
- [ ] Credit card for Firebase billing (required for production)
- [ ] 15-20 minutes of time

---

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)

2. Click **"Add project"** or **"Create a project"**

3. **Project Name**: `willard-tigers-bowling`
   - Or choose your own name
   - This will create project ID: `willard-tigers-bowling` (may add random suffix)

4. **Google Analytics**:
   - Recommended: Enable
   - Select "Default Account for Firebase" or create new

5. Click **"Create project"**
   - Wait 30-60 seconds for project creation

6. Click **"Continue"** when ready

---

## Step 2: Upgrade to Blaze Plan (Required)

**Why Required**:
- Cloud Storage needs outbound traffic
- Production hosting requires Blaze plan
- Stats app integration needs shared database

1. In Firebase Console, click **gear icon** (⚙️) → **Usage and billing**

2. Click **"Modify plan"**

3. Select **"Blaze (Pay as you go)"**

4. Click **"Purchase"**

5. Add payment method (credit card)

6. **Set Budget Alert** (Recommended):
   - Click "Set budget"
   - Amount: $25/month (sufficient for small team)
   - Email: your email
   - This prevents unexpected costs

**Expected Costs**:
- Small team (< 100 active users): **$0-5/month**
- With Stats app: **$5-15/month**

---

## Step 3: Enable Authentication

1. In Firebase Console, click **"Authentication"** in left menu

2. Click **"Get started"**

3. Click **"Sign-in method"** tab

4. **Enable Email/Password**:
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"

5. **Enable Google OAuth** (Recommended):
   - Click "Google"
   - Toggle "Enable"
   - Enter support email (your school email)
   - Click "Save"

6. **Configure Authorized Domains**:
   - Click "Settings" tab
   - Under "Authorized domains"
   - Your Firebase domain is already listed
   - Add custom domain later when ready

---

## Step 4: Create Firestore Database

1. In Firebase Console, click **"Firestore Database"** in left menu

2. Click **"Create database"**

3. **Select Location**:
   - Choose: **"us-central1"** (Iowa)
   - ⚠️ **Cannot be changed later!**
   - Click "Next"

4. **Security Rules**:
   - Select: **"Start in production mode"**
   - (We'll deploy proper rules from code)
   - Click "Enable"

5. Wait 30-60 seconds for database creation

6. **Verify Database Created**:
   - You should see "Cloud Firestore" tab
   - Currently empty - this is correct

---

## Step 5: Enable Cloud Storage

1. In Firebase Console, click **"Storage"** in left menu

2. Click **"Get started"**

3. **Security Rules**:
   - Select: **"Start in production mode"**
   - (We'll deploy proper rules from code)
   - Click "Next"

4. **Storage Location**:
   - Should match Firestore location: **us-central1**
   - Click "Done"

5. Wait for Storage to be created

6. **Verify Storage Created**:
   - You should see Storage bucket
   - Default bucket: `your-project-id.appspot.com`

---

## Step 6: Get Firebase Configuration

1. In Firebase Console, click **gear icon** (⚙️) → **"Project settings"**

2. Scroll down to **"Your apps"** section

3. Click **"</>"** (Web app icon)

4. **Register App**:
   - App nickname: `WHS Bowling Site`
   - ✅ Check "Also set up Firebase Hosting"
   - Click "Register app"

5. **Copy Firebase Configuration**:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```
   - **COPY THESE VALUES** - you'll need them next!

6. Click **"Continue to console"**

---

## Step 7: Configure Environment File

1. Open the `.env` file in the WHS project:
   ```bash
   c:\Users\daves\GCP-INFRA-BASE\gcp-mvps\WHS\.env
   ```

2. **Replace placeholders** with your Firebase config values:

   ```env
   # Replace these with values from Step 6
   VITE_FIREBASE_API_KEY=AIza...  # Your actual API key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123

   # Use same project ID
   VITE_GCP_PROJECT_ID=your-project-id
   VITE_GCP_REGION=us-central1

   # Leave empty for now (will fill after Stats app is deployed)
   VITE_STATS_APP_URL=
   ```

3. **Save the file**

4. **⚠️ VERIFY**: Never commit this file to git!
   ```bash
   # Check .env is in .gitignore
   cat .gitignore | grep "\.env"
   ```

---

## Step 8: Initialize Firebase CLI

1. **Check if Firebase CLI is installed**:
   ```bash
   firebase --version
   ```

2. **If not installed**, install globally:
   ```bash
   npm install -g firebase-tools
   ```

3. **Login to Firebase**:
   ```bash
   firebase login
   ```
   - Browser will open
   - Sign in with your Google account
   - Allow Firebase CLI access
   - Return to terminal

4. **Verify login**:
   ```bash
   firebase projects:list
   ```
   - You should see your new project listed

5. **Select project**:
   ```bash
   cd c:\Users\daves\GCP-INFRA-BASE\gcp-mvps\WHS
   firebase use --add
   ```
   - Select your project from the list
   - Alias: `default` (press Enter)

6. **Verify project selected**:
   ```bash
   firebase use
   ```
   - Should show your project as active

---

## Step 9: Firestore Indexes Configuration

Firestore indexes are already defined in `firestore.indexes.json`. These will be deployed automatically.

**Indexes Created**:
- Players by program, active status, grade, name
- Players by program and average score (leaderboard)
- Schedules by program and date
- Games by player and timestamp
- Games by completion status and timestamp
- Public content by published status and date

**No action needed** - indexes deploy with rules.

---

## Step 10: Verification Checklist

Before proceeding to deployment, verify:

- [ ] Firebase project created
- [ ] Blaze plan enabled with budget alert
- [ ] Authentication enabled (Email/Password + Google)
- [ ] Firestore database created (us-central1)
- [ ] Cloud Storage enabled
- [ ] Firebase web app registered
- [ ] `.env` file configured with real values
- [ ] Firebase CLI installed
- [ ] Logged in to Firebase CLI
- [ ] Project selected (`firebase use`)

---

## Next Steps

Once all steps above are complete:

1. **Deploy Security Rules**:
   ```bash
   npm run deploy:firestore
   npm run deploy:storage
   ```

2. **Build Application**:
   ```bash
   npm run build
   ```

3. **Deploy to Hosting**:
   ```bash
   npm run deploy:hosting
   ```

4. **Create First Coach Account** (see QUICKSTART.md)

---

## Stats App Integration Setup

After WHS Site is deployed, to integrate the Stats app (Option 1 - Shared Firebase Project):

1. **Clone Stats App**:
   ```bash
   cd c:\Users\daves\GCP-INFRA-BASE\gcp-mvps
   git clone https://github.com/SuperHerosExist/Stats.git
   cd Stats
   ```

2. **Configure Stats App** with **same Firebase project**:
   - Copy `.env.example` to `.env`
   - Use **SAME Firebase config** as WHS Site
   - Same project ID, API key, etc.

3. **Deploy Stats App to subdomain**:
   ```bash
   # In Stats directory
   firebase target:apply hosting stats stats-site
   firebase deploy --only hosting:stats
   ```

4. **Update WHS Site `.env`**:
   ```env
   VITE_STATS_APP_URL=https://stats-your-project.web.app
   ```

5. **Rebuild and redeploy WHS Site**:
   ```bash
   cd ../WHS
   npm run build
   firebase deploy --only hosting
   ```

See `STATS_APP_INTEGRATION.md` for complete details.

---

## Security Notes

### API Key Security

**Question**: "Is the Firebase API key safe to expose in client code?"

**Answer**: **YES** - Firebase API keys for web apps are designed to be public.

**Why it's safe**:
1. API key identifies your Firebase project, not a secret credential
2. Real security is enforced by:
   - Firestore security rules (server-side)
   - Storage security rules (server-side)
   - Firebase Authentication (server-side)
3. API key restrictions can be set in Google Cloud Console
4. Unauthorized access is blocked by security rules

**However**:
- Keep `.env` in `.gitignore` (good practice)
- Never commit actual `.env` file
- Use environment variables in CI/CD
- Monitor usage in Firebase Console

### Firestore Rules

Your security is enforced by these files:
- `firestore.rules` - Database access control
- `storage.rules` - File upload control

These rules run on Firebase servers and **cannot be bypassed** by client code.

---

## Troubleshooting

### "Firebase command not found"
```bash
npm install -g firebase-tools
```

### "Not authorized"
```bash
firebase logout
firebase login
```

### "Permission denied" in Firestore
- Wait a few minutes after creating database
- Deploy security rules: `firebase deploy --only firestore:rules`

### "Budget exceeded"
- Set budget alert in Firebase Console
- Monitor usage regularly
- Small teams typically stay under $5/month

---

## Support Resources

- **Firebase Console**: https://console.firebase.google.com
- **Firebase Documentation**: https://firebase.google.com/docs
- **Firebase Support**: https://firebase.google.com/support
- **Pricing Calculator**: https://firebase.google.com/pricing

---

## Completion

Once you've completed all steps above, you're ready for deployment!

**Next**: Run the deployment commands from the WHS directory.

**Questions?** Review DEPLOYMENT.md for detailed deployment instructions.
