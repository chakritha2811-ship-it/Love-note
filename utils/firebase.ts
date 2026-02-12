// utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbyA0djdTEwE1K583xIMoZ4kk5rxAPEXk",
  authDomain: "love-board-b16a9.firebaseapp.com",
  projectId: "love-board-b16a9",
  storageBucket: "love-board-b16a9.firebasestorage.app",
  messagingSenderId: "273699947245",
  appId: "1:273699947245:web:d6f36c016b39f4edbf82e4",
  measurementId: "G-F9ESWE022H"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);
