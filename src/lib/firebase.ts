import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCFFLyvQE6F21GUULRfMN7k4H2R9FlgKPw",
  authDomain: "databasenihongo.firebaseapp.com",
  projectId: "databasenihongo",
  storageBucket: "databasenihongo.firebasestorage.app",
  messagingSenderId: "32435504380",
  appId: "1:32435504380:web:585f24d1d2397c6a3bc379",
  measurementId: "G-1LNY77D4JE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
