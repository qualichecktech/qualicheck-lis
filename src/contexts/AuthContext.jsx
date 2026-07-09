// src/contexts/AuthContext.jsx
//
// Single source of truth for "who is logged in and what can they do".
// Wraps Firebase Authentication and merges it with the user's Firestore
// profile (role, name, department). Every protected route and permission
// check reads from this context via the useAuth() hook.

import { createContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserProfile } from '../services/userService';
import { hasPermission, hasAnyPermission } from '../utils/permissions';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setError(null);
      setFirebaseUser(user);
      if (user) {
        try {
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
        } catch (err) {
          console.error('Failed to load user profile:', err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      setError(mapAuthError(err.code));
      return false;
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const value = {
    firebaseUser,
    profile,
    role: profile?.role || null,
    isAuthenticated: !!firebaseUser,
    isActive: profile?.active !== false,
    loading,
    error,
    login,
    logout,
    can: (permission) => hasPermission(profile?.role, permission),
    canAny: (permissions) => hasAnyPermission(profile?.role, permissions),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function mapAuthError(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return 'Unable to sign in right now. Please try again.';
  }
}
