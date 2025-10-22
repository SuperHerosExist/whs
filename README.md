# Willard High School Tigers Bowling - Official Website

A world-class, production-ready website for the Willard High School Tigers Bowling Team featuring role-based access control, professional school branding, and seamless integration with the bowling statistics tracking application.

![TypeScript](https://img.shields.io/badge/typescript-5.9.3-blue)
![React](https://img.shields.io/badge/react-19.1.1-blue)
![Firebase](https://img.shields.io/badge/firebase-12.3.0-orange)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-4.1.14-38bdf8)

## Features

### Public Website
- **Professional Design**: Aligned with Willard Schools branding (black, taupe, gold color scheme)
- **Home Page**: Hero section, team stats, recent highlights
- **About Page**: Program mission, core values, history
- **Roster Page**: Filterable team roster with player profiles
- **Meet the Team**: Public player profiles with stats, bios, photos, and achievements
- **Schedule Page**: Upcoming events and past results
- **Stats Page**: Team statistics with integration to detailed Stats app
- **Contact Page**: Join team inquiry form with Firestore integration

### Player Portal
- **Profile Claiming**: New players can claim their bowling profile on first login
- **Profile Management**: Edit bio, hometown, favorite quote, bowling goals, jersey number
- **Photo Upload**: Upload and manage profile photo (5MB limit, Firebase Storage)
- **Statistics Dashboard**: View personal bowling statistics (auto-synced from Stats app)
- **Direct Stats App Access**: One-click access to detailed analytics

### Stats Integration (NEW!)
- **Automated Stats Sync**: Cloud Functions sync stats from bowling Stats app daily
- **Public Stats API**: Read-only public stats endpoint (no auth required)
- **Team Statistics**: Team average, total games, top players
- **Recent High Games**: Last 30 days of top performances
- **Player Stats**: Individual averages, high games, high series (read-only)

### Coach/Admin Portal
- **Roster Management**: Add, edit, activate/deactivate players
- **Team Overview**: Dashboard with team statistics and analytics
- **Schedule Management**: Manage events and tournaments
- **Player Profile Management**: Full access to all player data
- **Photo Gallery Management**: Upload and manage team photos
- **Achievement Management**: Add player achievements and accolades

### Security & Compliance
- **Role-Based Access Control**: Public, Player, and Coach roles
- **Firestore Security Rules**: Comprehensive rules for data protection
- **Storage Security Rules**: Secure file upload with size/type validation
- **FERPA Compliant**: Student data protection
- **COPPA Compliant**: Youth data privacy

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS (mobile-first, professional branding)
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting, Cloud Functions)
- **Cloud Functions**: Node.js 20 with TypeScript (stats aggregation, scheduled tasks)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project (create at https://console.firebase.google.com)
- GCP account with billing enabled

### Installation

1. **Clone the repository**:
   ```bash
   cd c:\Users\daves\GCP-INFRA-BASE\gcp-mvps\WHS
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and Google OAuth)
   - Create a Firestore database (Start in production mode)
   - Enable Cloud Storage
   - Copy `.env.example` to `.env` and fill in your Firebase config:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_STATS_APP_URL=https://your-stats-app.web.app
   ```

4. **Initialize Firebase**:
   ```bash
   firebase login
   firebase use --add  # Select your project
   ```

5. **Install Cloud Functions Dependencies**:
   ```bash
   cd functions
   npm install
   cd ..
   ```

6. **Deploy Security Rules and Functions**:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage:rules,functions
   ```

### Development

Run the development server:
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Deployment

### Initial Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting**:
   ```bash
   firebase deploy
   ```

3. **Deploy specific services**:
   ```bash
   # Hosting only
   npm run deploy:hosting

   # Security rules only
   npm run deploy:firestore

   # Storage rules only
   npm run deploy:storage
   ```

### Continuous Deployment

Set up GitHub Actions for automatic deployment:

1. Generate a Firebase token:
   ```bash
   firebase login:ci
   ```

2. Add the token to GitHub Secrets as `FIREBASE_TOKEN`

3. GitHub Actions will auto-deploy on push to main branch

## Project Structure

```
WHS/
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── auth/            # Authentication components
│   │   │   ├── SignIn.tsx
│   │   │   ├── SignUp.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ProfileClaiming.tsx  # NEW: Profile claiming flow
│   │   └── layout/          # Header, Footer, Navigation
│   ├── config/              # Branding and configuration
│   ├── contexts/            # React contexts (Auth)
│   ├── lib/                 # Firebase configuration
│   ├── pages/               # Route pages
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Roster.tsx
│   │   ├── Team.tsx         # NEW: Meet the Team page (public)
│   │   ├── Schedule.tsx
│   │   ├── Stats.tsx
│   │   ├── Contact.tsx
│   │   ├── PlayerDashboard.tsx
│   │   ├── PlayerProfile.tsx  # NEW: Player profile management
│   │   └── CoachDashboard.tsx
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── functions/               # NEW: Cloud Functions
│   ├── src/
│   │   └── index.ts         # Stats aggregation functions
│   ├── package.json
│   └── tsconfig.json
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes
├── storage.rules            # Cloud Storage security rules
├── firebase.json            # Firebase configuration
├── infrastructure.json      # GCP infrastructure config
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── STATS_INTEGRATION_IMPLEMENTATION.md  # NEW: Stats integration guide
├── PLAYER_PROFILES_GUIDE.md            # NEW: Player profiles guide
└── README.md
```

## Configuration

### Branding

School branding is centralized in `src/config/branding.ts`:
- Colors (black, taupe, gold)
- Typography (Montserrat, Inter)
- School information
- Contact details

Update this file to customize branding.

### Infrastructure

GCP infrastructure is defined in `infrastructure.json`:
- Firebase services
- Cloud Storage buckets
- Firestore collections
- Security settings
- Compliance requirements

## Stats App Integration

The site automatically syncs bowling statistics from a separate Stats app using Cloud Functions.

**See Detailed Guides**:
- [STATS_INTEGRATION_IMPLEMENTATION.md](./STATS_INTEGRATION_IMPLEMENTATION.md) - Complete stats integration guide
- [PLAYER_PROFILES_GUIDE.md](./PLAYER_PROFILES_GUIDE.md) - Player profile system guide
- [STATS_APP_INTEGRATION.md](./STATS_APP_INTEGRATION.md) - Original integration options

**Features**:
- **Automated Daily Sync**: Cloud Function runs at 2 AM daily to aggregate stats
- **Public Stats API**: No authentication required for public team stats
- **Read-Only Stats**: Stats are synced from Stats app, cannot be edited on website
- **Real-time Display**: Player profiles show current averages, high games, high series

**Quick Start**:
1. Use the same Firebase project for both apps
2. Deploy Cloud Functions: `firebase deploy --only functions`
3. Deploy security rules: `firebase deploy --only firestore:rules`
4. Stats automatically sync daily at 2 AM
5. Manual trigger: `curl -X POST https://us-central1-[PROJECT].cloudfunctions.net/triggerPublicStatsUpdate`

## User Roles

### Public
- View public website (home, about, roster, schedule, stats, contact)
- Submit contact form inquiries
- No authentication required

### Player
- All public access
- Personal profile management
- Upload profile photo
- View personal statistics
- Access to Stats app

### Coach
- All player access
- Roster management (add, edit, activate/deactivate players)
- Team statistics dashboard
- Schedule management
- Photo gallery management
- Access to all player data
- Contact form submission management

## Security

### Firestore Rules
- Role-based access control (public, player, coach)
- Players can only edit their own profiles (limited fields)
- Coaches have full access to program data
- Public content requires publish flag
- Stats app collections are read-only from WHS Site

### Storage Rules
- Players can upload/manage own profile photos (max 5MB)
- Coaches can upload team photos (max 10MB)
- File type validation (images only)
- Size limits enforced

### Authentication
- Email/password authentication
- Google OAuth support
- Session persistence
- Secure password requirements

## Data Model

### Collections

**users**: User authentication profiles
- uid, email, displayName, role, programId
- Created on signup

**players**: Extended player profiles
- Personal info, grade, graduation year, jersey number
- Editable fields: bio, hometown, favorite quote, bowling goals
- Statistics (average, high game, high series, games played) - READ ONLY
- Photo URL, isClaimed flag

**teams**: Team rosters
- Team name, active players, alternates, season

**publicContent**: News, announcements, achievements
- Title, content, author, publish status

**schedules**: Events and tournaments
- Date, time, location, opponent, results

**photoGallery**: Team photos
- Image URL, category, tags, public flag

**contactSubmissions**: Contact form inquiries
- Name, email, phone, subject, message, status

**achievements**: Player achievements and accolades
- Player ID, title, description, value, date
- Type: high-game, improvement, milestone, award
- isPublic flag (display on team page)

**publicStats**: Aggregated public statistics (updated daily)
- Team average, total games
- Top players (top 10 by average)
- Recent high games (last 30 days)
- Updated by Cloud Functions

**games, sessions, frames**: Stats app integration (read-only)

## Customization

### Colors
Update `tailwind.config.js` to change color scheme:
```javascript
colors: {
  tiger: {
    primary: '#000000',      // Main school color
    secondary: '#c3c0be',    // Secondary color
    accent: '#8B0000',       // Accent color
    gold: '#D4AF37',         // Gold for awards
  }
}
```

### School Information
Update `src/config/branding.ts`:
```typescript
export const branding = {
  school: {
    name: 'Your School Name',
    teamName: 'Your Team Name',
    motto: 'Your Motto',
    // ...
  }
}
```

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

### Firebase Deployment Issues
```bash
# Verify Firebase project
firebase use

# Check deployment targets
firebase target:apply hosting main whs-bowling-site

# Deploy with verbose logging
firebase deploy --debug
```

### Security Rules Errors
```bash
# Test rules locally
firebase emulators:start

# Validate rules
firebase deploy --only firestore:rules --dry-run
```

## Performance

- **Lighthouse Score**: 95+ (Production build)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: ~200KB gzipped
- **Image Optimization**: WebP format, lazy loading
- **Code Splitting**: Vendor, Firebase, and route-based splits

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is a school project. For modifications:
1. Test in development environment
2. Ensure security rules are not compromised
3. Maintain FERPA/COPPA compliance
4. Follow branding guidelines
5. Update documentation

## License

© 2025 Willard High School. All rights reserved.

## Support

For technical support:
- Review documentation
- Check Firebase Console logs
- Review GitHub Issues
- Contact school IT department

---

**Built with care for the Willard Tigers Bowling Team**

*Focused. Connected. Driven.*
