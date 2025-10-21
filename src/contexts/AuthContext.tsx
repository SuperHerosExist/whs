import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User, UserRole, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('public');
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || userData.displayName || '',
          role: userData.role || 'public',
          programId: userData.programId || 'willard-tigers',
          photoURL: firebaseUser.photoURL || userData.photoURL,
          phone: userData.phone,
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Create user profile in Firestore
  const createUserProfile = async (
    firebaseUser: FirebaseUser,
    role: UserRole,
    displayName: string
  ): Promise<void> => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userRef, {
        email: firebaseUser.email,
        displayName: displayName || firebaseUser.displayName,
        role: role,
        programId: 'willard-tigers',
        photoURL: firebaseUser.photoURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole = 'player'
  ): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update Firebase Auth profile
      await updateProfile(userCredential.user, { displayName });

      // Create Firestore profile
      await createUserProfile(userCredential.user, role, displayName);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user profile exists, create if not
      const userProfile = await fetchUserProfile(result.user);
      if (!userProfile) {
        await createUserProfile(result.user, 'player', result.user.displayName || '');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserRole('public');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      setCurrentUser({ ...currentUser, ...updates, updatedAt: new Date() });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await fetchUserProfile(firebaseUser);
        if (userProfile) {
          setCurrentUser(userProfile);
          setUserRole(userProfile.role);
        } else {
          // User exists in Auth but not in Firestore - create profile
          await createUserProfile(firebaseUser, 'player', firebaseUser.displayName || '');
          const newUserProfile = await fetchUserProfile(firebaseUser);
          if (newUserProfile) {
            setCurrentUser(newUserProfile);
            setUserRole(newUserProfile.role);
          }
        }
      } else {
        setCurrentUser(null);
        setUserRole('public');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userRole,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
