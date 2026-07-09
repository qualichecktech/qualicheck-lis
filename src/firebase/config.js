// src/firebase/config.js
//
// This file REUSES your existing Firebase project. It does not create or
// reconfigure anything in Firebase itself. Fill in the matching values in
// your .env file (see .env.example) — these are the same values already
// shown in your Firebase console for this project.
//
// Every other part of the app (auth, firestore services, hooks) imports
// `auth` and `db` from this single file so there is only ever one
// initialized Firebase app instance.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Avoid re-initializing during hot-module-reload in dev.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
