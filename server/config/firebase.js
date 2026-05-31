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

  const serviceAccountPath = path.resolve(
    __dirname,
    '..',
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json'
  );

  // Check if service account key file exists
  if (!fs.existsSync(serviceAccountPath)) {
    console.warn('\n⚠️  Firebase Admin: serviceAccountKey.json not found.');
    console.warn('   Registrations will be stored in-memory only (dev mode).');
    console.warn('   To enable Firestore: download serviceAccountKey.json from');
    console.warn('   Firebase Console → Project Settings → Service Accounts\n');
    firebaseInitialized = true;
    return { db: null, admin: null };
  }

  try {
    const serviceAccount = require(serviceAccountPath);

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
