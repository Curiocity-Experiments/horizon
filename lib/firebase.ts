import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import admin from 'firebase-admin';
import { getApps as getAdminApps } from 'firebase-admin/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let adminDb: admin.firestore.Firestore | undefined;

if (typeof window === 'undefined') {
  if (!getAdminApps().length) {
    try {
      console.log('Initializing Admin Firebase...');
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
      console.log('Service account project_id:', serviceAccount.project_id);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
      });
      adminDb = admin.firestore();
      console.log('Admin Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Admin Firebase:', error);
    }
  } else {
    console.log('Admin Firebase already initialized, getting Firestore instance');
    adminDb = admin.firestore();
  }
} else {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('Client Firebase initialized successfully');
  } else {
    console.log('Client Firebase already initialized');
  }
}

export { app, db, auth, adminDb };