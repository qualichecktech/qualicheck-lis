// src/services/userService.js
//
// Firebase Authentication only stores identity (email/password/uid).
// Role and profile info (name, role, department, active status) live in a
// Firestore `users` collection keyed by the auth uid. This service reads
// that profile so the rest of the app can do role-based access control.

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const USERS_COLLECTION = 'users';

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createUserProfile(uid, profile) {
  await setDoc(doc(db, USERS_COLLECTION, uid), {
    role: null,
    active: true,
    ...profile,
  });
}
