import { initializeApp } from 'firebase/app';
import { getFirestore, query, collection, where, limit, getDocs, writeBatch, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth(app);

async function run() {
  await signInWithEmailAndPassword(auth, 'edwinageng113@gmail.com', 'password123'); // I don't know the password...
  // well, I can't sign in without the password.
}
run();
