// lib/firebase.ts

// TODO: Implement connection pooling for Firestore to improve performance
// TODO: Add retry logic for failed Firebase operations

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  // For server-side rendering, initialize with a dummy app
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  auth = getAuth(app);
}

// TODO: Implement a mechanism to refresh Firebase token before expiration
export { app, db, auth };

// Client-side only exports
// TODO: Implement lazy loading for these functions to reduce initial bundle size
export const getRemoteConfig = async () => {
  if (typeof window !== 'undefined') {
    const { getRemoteConfig } = await import('firebase/remote-config');
    return getRemoteConfig(app);
  }
  return null;
};

export const fetchAndActivate = async (remoteConfig: any) => {
  if (typeof window !== 'undefined') {
    const { fetchAndActivate } = await import('firebase/remote-config');
    return fetchAndActivate(remoteConfig);
  }
};

export const getValue = async (remoteConfig: any, key: string) => {
  if (typeof window !== 'undefined') {
    const { getValue } = await import('firebase/remote-config');
    return getValue(remoteConfig, key);
  }
  return null;
};