// lib/firebase.ts
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
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth };

// Client-side only exports
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