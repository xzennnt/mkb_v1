import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDZ9H3HrD6shnffLI_YjSvFt1wuhCSBdos",
  authDomain: "distributed-sequence-m1ttq.firebaseapp.com",
  projectId: "distributed-sequence-m1ttq",
  storageBucket: "distributed-sequence-m1ttq.firebasestorage.app",
  messagingSenderId: "581720298510",
  appId: "1:581720298510:web:c9debe00e1d15d78c2585f",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-1d3a31c2-fef7-41c9-8981-5cdd54f163b6");
export const googleProvider = new GoogleAuthProvider();
