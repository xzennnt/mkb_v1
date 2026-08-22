import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import fs from 'fs';

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
const db = getFirestore(app, "ai-studio-1d3a31c2-fef7-41c9-8981-5cdd54f163b6");

async function seed() {
  const files = ['mnn1_bab1_5.json', 'mnn1_bab6_8.json', 'mnn1_bab9_10.json'];
  const vocabRef = collection(db, 'vocabularies');
  
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      console.log(`Processing ${file}... found ${data.length} items`);
      for (let i = 0; i < data.length; i++) {
        await addDoc(vocabRef, data[i]);
        if (i % 50 === 0) console.log(`  Uploaded ${i} items from ${file}`);
      }
      console.log(`Finished ${file}`);
    } catch (e) {
      console.error(`Error processing ${file}:`, e);
    }
  }
  console.log('All files processed.');
  process.exit(0);
}

seed();
