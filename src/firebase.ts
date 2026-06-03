// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTgMb_5UbfoiUBhVY18Bl0DAHu1_vqOFs",
  authDomain: "melcho4.firebaseapp.com",
  projectId: "melcho4",
  storageBucket: "melcho4.firebasestorage.app",
  messagingSenderId: "932630127652",
  appId: "1:932630127652:web:0150d00480034ea94364b1",
  measurementId: "G-80WC8D17R2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
