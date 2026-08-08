import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

// Replaces literal escaped newlines with actual newline characters
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
  : undefined;

if (!getApps().length && process.env.FIREBASE_PROJECT_ID) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
} else if (!getApps().length) {
  console.warn("Firebase config missing. Firebase Admin will not be initialized.");
}

export const auth = process.env.FIREBASE_PROJECT_ID ? getAuth() : null;
