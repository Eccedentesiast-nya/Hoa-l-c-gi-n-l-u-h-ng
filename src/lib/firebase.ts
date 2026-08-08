import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  projectId: "gen-lang-client-0122360001",
  appId: "1:6281233858:web:a263f7e664baf139a9825b",
  apiKey: "AIzaSyDCE1hhlXIYfz9ycfYcilqmFMlkiq2h76M",
  authDomain: "gen-lang-client-0122360001.firebaseapp.com",
  storageBucket: "gen-lang-client-0122360001.firebasestorage.app",
  messagingSenderId: "6281233858",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);

// Initialize analytics conditionally as it may not be supported in some iframe/sandboxed environments
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
}).catch(err => console.warn("Analytics not supported:", err));

export const db = getFirestore(app, "ai-studio-hoalcginluhng-47e9ffbf-87b1-4a58-9591-80c60c6d60ce");
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);
