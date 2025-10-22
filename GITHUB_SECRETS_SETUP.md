# GitHub Secrets Setup Guide

## The White Screen Issue - FIXED! ✅

The white screen was caused by missing Firebase configuration during the build.

**The workflow is now fixed** - you just need to add your Firebase config values to GitHub Secrets.

## 🔑 Get Your Firebase Configuration

### Method 1: From Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **willard-tigers-bowling**
3. Click the gear icon ⚙️ → **Project settings**
4. Scroll down to **Your apps** section
5. Find your web app or click **Add app** → **Web** (</> icon)
6. Copy the config values from the `firebaseConfig` object

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "willard-tigers-bowling.firebaseapp.com",
  projectId: "willard-tigers-bowling",
  storageBucket: "willard-tigers-bowling.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Method 2: From Firebase CLI (Alternative)

```bash
firebase apps:sdkconfig web
```

## 📝 Add Secrets to GitHub

1. Go to your GitHub repository:
   ```
   https://github.com/SuperHerosExist/whs/settings/secrets/actions
   ```

2. Click **"New repository secret"** for each of these:

### Required Secrets:

| Secret Name | Example Value | Where to find it |
|-------------|---------------|------------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyXXX...` | Firebase Console → Project Settings → Web App Config |
| `VITE_FIREBASE_AUTH_DOMAIN` | `willard-tigers-bowling.firebaseapp.com` | Same as above |
| `VITE_FIREBASE_PROJECT_ID` | `willard-tigers-bowling` | Same as above |
| `VITE_FIREBASE_STORAGE_BUCKET` | `willard-tigers-bowling.firebasestorage.app` | Same as above |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` | Same as above |
| `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abc...` | Same as above |
| `VITE_STATS_APP_URL` | `https://your-stats-app.web.app` | Your Stats app URL (optional) |

### How to Add Each Secret:

For each secret:
1. Click **"New repository secret"**
2. **Name**: Enter the exact secret name (e.g., `VITE_FIREBASE_API_KEY`)
3. **Secret**: Paste the value
4. Click **"Add secret"**

## 🚀 Deploy After Adding Secrets

Once all secrets are added:

### Option 1: Push a New Commit (Automatic)
```bash
git push
```

### Option 2: Re-run the Workflow (Manual)
1. Go to `https://github.com/SuperHerosExist/whs/actions`
2. Click on the latest failed workflow
3. Click **"Re-run all jobs"**

### Option 3: Trigger New Workflow Run
1. Go to `https://github.com/SuperHerosExist/whs/actions`
2. Click **"Deploy to Firebase"**
3. Click **"Run workflow"**
4. Select your branch
5. Click **"Run workflow"**

## ✅ Verify Deployment

After adding secrets and deploying:
- The workflow should complete successfully ✅
- Visit `https://willard-tigers-bowling.web.app`
- You should see your beautiful redesigned site! 🎉

## 📌 Note About Firebase Config

Firebase configuration values (API key, project ID, etc.) are **not sensitive secrets**. They're designed to be public and embedded in client-side code. Security comes from:
- Firestore security rules
- Firebase Authentication
- Storage security rules

So don't worry about exposing them in your codebase or browser.

## 🆘 Still Having Issues?

If you still see a white screen after adding secrets:
1. Check browser console for errors (F12 → Console tab)
2. Verify all 7 secrets are added correctly
3. Make sure secret names match exactly (including `VITE_` prefix)
4. Re-run the deployment workflow

---

**Need help?** Share any error messages from:
- GitHub Actions workflow logs
- Browser console (F12 → Console)
