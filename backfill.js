import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZ9H3HrD6shnffLI_YjSvFt1wuhCSBdos",
  authDomain: "distributed-sequence-m1ttq.firebaseapp.com",
  projectId: "distributed-sequence-m1ttq",
  storageBucket: "distributed-sequence-m1ttq.firebasestorage.app",
  messagingSenderId: "581720298510",
  appId: "1:581720298510:web:c9debe00e1d15d78c2585f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-1d3a31c2-fef7-41c9-8981-5cdd54f163b6");

// Note: we can't easily import allVocabularies because it's a TS file with React deps.
// Instead, we will fetch 'vocabularies' collection first.
async function backfill() {
  console.log("Fetching vocabularies...");
  const vocabsSnap = await getDocs(collection(db, "vocabularies"));
  const vocabMap = {};
  vocabsSnap.docs.forEach(d => {
    vocabMap[d.data().id] = d.data().category;
    // Also by jp just in case
    vocabMap[d.data().jp] = d.data().category;
  });

  console.log("Fetching user_progress...");
  const progSnap = await getDocs(collection(db, "user_progress"));
  let count = 0;
  for (const d of progSnap.docs) {
    const data = d.data();
    if (!data.category) {
      let cat = vocabMap[data.vocabId];
      if (!cat && data.vocabId) {
          // If vocabId is like 'MNN1_Bab1_0', category is 'MNN1_Bab1'
          if (data.vocabId.includes('_')) {
             const parts = data.vocabId.split('_');
             parts.pop();
             cat = parts.join('_');
          }
      }
      
      if (cat) {
        await updateDoc(doc(db, 'user_progress', d.id), { category: cat });
        count++;
        console.log(`Updated ${d.id} with category ${cat}`);
      }
    }
  }
  console.log(`Finished. Updated ${count} records.`);
  process.exit(0);
}

backfill().catch(console.error);
