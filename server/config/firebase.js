/**
 * Firebase Admin SDK Initialization
 * Uses service account key for server-side privileged access to Firestore
 */

const admin = require('firebase-admin');
const path  = require('path');
const fs    = require('fs');
require('dotenv').config();

let db = null;
let firebaseInitialized = false;

function initFirebase() {
  if (firebaseInitialized) return { db, admin };

  let serviceAccount = null;

  // 1. Try to load from environment variable JSON string (useful for deployment)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (err) {
      console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON env variable:', err.message);
    }
  }

  // 2. If not in env, try to load from serviceAccountKey.json file
  if (!serviceAccount) {
    const serviceAccountPath = path.resolve(
      __dirname,
      '..',
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json'
    );

    if (fs.existsSync(serviceAccountPath)) {
      try {
        serviceAccount = require(serviceAccountPath);
      } catch (err) {
        console.error('❌ Failed to load serviceAccountKey.json file:', err.message);
      }
    }
  }

  // 3. Fallback to in-memory mode if no credentials found
  if (!serviceAccount) {
    console.warn('\n⚠️  Firebase Admin: serviceAccountKey.json or FIREBASE_SERVICE_ACCOUNT_JSON not found.');
    console.warn('   Registrations will be stored in-memory only (dev mode).');
    console.warn('   To enable Firestore: download serviceAccountKey.json from or set env variable at');
    console.warn('   Firebase Console → Project Settings → Service Accounts\n');
    firebaseInitialized = true;
    return { db: null, admin: null };
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
      });
    }

    db = admin.firestore();
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized — Firestore connected');
    return { db, admin };
  } catch (err) {
    console.error('❌ Firebase Admin init failed:', err.message);
    firebaseInitialized = true;
    return { db: null, admin: null };
  }
}

module.exports = { initFirebase };
