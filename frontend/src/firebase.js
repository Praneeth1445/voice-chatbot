import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Replace with your actual Firebase credentials from your Firebase Console
// 1. Go to console.firebase.google.com
// 2. Create a project
// 3. Add a Web App
// 4. Copy the config object below
const firebaseConfig = {
  apiKey: "AIzaSyCKAZc_NaIrwP1tixx8lmDwwrk-w9hl4JA",
  authDomain: "voice-chat-5030f.firebaseapp.com",
  projectId: "voice-chat-5030f",
  storageBucket: "voice-chat-5030f.firebasestorage.app",
  messagingSenderId: "225937776553",
  appId: "1:225937776553:web:de35013aa610386a2e2eb8",
  measurementId: "G-41R9ZDY15Q"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
