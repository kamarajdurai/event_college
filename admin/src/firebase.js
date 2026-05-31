import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0PSfsBG1Kr30FvBXbcG8_Wl4wvGLREVY",
  authDomain: "clgevent-56d3a.firebaseapp.com",
  projectId: "clgevent-56d3a",
  storageBucket: "clgevent-56d3a.firebasestorage.app",
  messagingSenderId: "557093218785",
  appId: "1:557093218785:web:388ac1304f47647056caa0",
  measurementId: "G-X0DCM4JTS2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, app, db };
