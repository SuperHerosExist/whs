/**
 * Type definitions for WHS Bowling Site
 * Integrated with Stats app types from https://github.com/SuperHerosExist/Stats.git
 */

// User Roles
export type UserRole = 'public' | 'player' | 'coach';

// User Profile
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  programId: string; // Links to bowling program
  createdAt: Date;
  updatedAt: Date;
  photoURL?: string;
  phone?: string;
}

// Player Profile (extended from User)
export interface Player {
  id: string;
  uid: string; // Firebase Auth UID
  name: string;
  email: string;
  photoURL?: string;
  programId: string;
  teamIds: string[];
  grade: string; // '9', '10', '11', '12'
  graduationYear: number;
  jerseyNumber?: string;
  bio?: string;
  hometown?: string;
  favoriteQuote?: string;
  bowlingGoals?: string;

  // Stats (synced from Stats app)
  averageScore: number;
  average: number; // Alias for averageScore
  highGame: number;
  highSeries: number;
  gamesPlayed: number;

  // Profile status
  isActive: boolean;
  isClaimed: boolean; // Has a user claimed this profile?
  createdAt: Date;
  updatedAt: Date;
}

// Team
export interface Team {
  id: string;
  name: string;
  programId: string;
  coachId: string;
  playerIds: string[]; // Active roster
  alternateIds: string[]; // Alternate players
  season: string; // e.g., "2024-2025"
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Public Content (for website)
export interface PublicContent {
  id: string;
  type: 'announcement' | 'news' | 'achievement' | 'event';
  title: string;
  content: string;
  imageURL?: string;
  authorId: string; // Coach who posted
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Schedule/Event
export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  type: 'practice' | 'match' | 'tournament' | 'meeting';
  date: Date;
  time: string;
  location: string;
  isHome: boolean;
  opponent?: string;
  result?: MatchResult;
  programId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Match Result
export interface MatchResult {
  homeScore: number;
  awayScore: number;
  winner: 'home' | 'away' | 'tie';
  topPerformers: {
    playerId: string;
    playerName: string;
    score: number;
  }[];
}

// Achievement
export interface Achievement {
  id: string;
  playerId: string;
  playerName: string;
  type: 'high-game' | 'improvement' | 'milestone' | 'award';
  title: string;
  description: string;
  value?: number;
  date: Date;
  isPublic: boolean;
  createdAt: Date;
}

// Photo Gallery
export interface PhotoGalleryItem {
  id: string;
  title: string;
  description?: string;
  imageURL: string;
  thumbnailURL?: string;
  uploadedBy: string; // Coach UID
  category: 'team' | 'tournament' | 'practice' | 'social';
  tags: string[];
  isPublic: boolean;
  uploadedAt: Date;
}

// Contact Form Submission
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'general' | 'join-team' | 'question';
  status: 'new' | 'read' | 'responded';
  submittedAt: Date;
}

// Stats Integration Types (from Stats app)
export interface StatsAppPlayer {
  id: string;
  uid: string;
  name: string;
  email: string;
  programId: string;
  averageScore: number;
  gamesPlayed: number;
}

export interface StatsAppGame {
  id: string;
  playerId: string;
  totalScore: number;
  timestamp: number;
  isComplete: boolean;
}

export interface PlayerStats {
  playerId: string;
  totalGames: number;
  averageScore: number;
  highGame: number;
  strikePercentage: number;
  sparePercentage: number;
  firstBallAverage: number;
}

// Public Stats (from Cloud Functions)
export interface PublicStats {
  programId: string;
  teamAverage: number;
  totalGames: number;
  topPlayers: PublicPlayerStats[];
  recentHighGames: RecentHighGame[];
  updatedAt: Date;
}

export interface PublicPlayerStats {
  name: string;
  average: number;
  highGame: number;
  highSeries: number;
  accolades?: string[];
  achievements?: string[];
}

export interface RecentHighGame {
  playerName: string;
  score: number;
  date: string;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
  roles?: UserRole[];
}

// Form States
export interface PlayerProfileForm {
  name: string;
  email: string;
  phone: string;
  grade: string;
  graduationYear: number;
  jerseyNumber: string;
  bio: string;
  photo?: File;
}

export interface JoinTeamForm {
  name: string;
  email: string;
  phone: string;
  grade: string;
  experience: 'none' | 'beginner' | 'intermediate' | 'advanced';
  message: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Context Types
export interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}
