const fs = require('fs');
let code = fs.readFileSync('src/pages/DeckView.tsx', 'utf8');

const oldResetFunc = `  const handleResetProgress = async () => {
    if (!currentUser) return;
    if (!window.confirm(\`Apakah Anda yakin ingin mereset semua progress flashcard untuk bab ini? Aksi ini tidak dapat dibatalkan.\`)) {
      return;
    }
    setIsResetting(true);
    try {
      // Chunking array to avoid overwhelming Firestore in one go if large
      const batchSize = 100;
      for (let i = 0; i < vocabs.length; i += batchSize) {
        const chunk = vocabs.slice(i, i + batchSize);
        const promises = chunk.map(v => {
          const docRef = doc(db, 'user_progress', \`\${currentUser.uid}_\${v.id}\`);
          return deleteDoc(docRef);
        });
        await Promise.all(promises);
      }
      
      setUserProgressMap({});
      setHardCount(0);
      setWeakCount(0);
      setWeakFlashcardCount(0);
      setWeakQuizCount(0);
      
    } catch (err) {
      console.error(err);
      alert("Gagal mereset progress");
    } finally {
      setIsResetting(false);
    }
  };`;

const newResetFunc = `  const handleResetProgress = async () => {
    if (!currentUser) return;
    if (!window.confirm(\`Apakah Anda yakin ingin mereset semua progress flashcard untuk bab ini? Aksi ini tidak dapat dibatalkan.\`)) {
      return;
    }
    setIsResetting(true);
    try {
      const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
      const progSnap = await getDocs(progQ);
      
      const docsToDelete: any[] = [];
      
      // Some progress might not have the category saved perfectly, so we'll check both by category field and by vocab prefix
      const vocabIds = new Set(vocabs.map(v => v.id));
      
      progSnap.docs.forEach(d => {
        const p = d.data();
        let shouldDelete = false;
        
        if (p.category === category) {
          shouldDelete = true;
        } else if (p.vocabId) {
           // Also check if the vocabId matches this category's vocab
           const baseId = p.vocabId.replace(/_(kanji-to-hiragana|hiragana-to-id|kanji-to-id|jp-to-romaji|romaji-to-id|jp-to-id)$/, '');
           if (vocabIds.has(baseId) || vocabIds.has(p.vocabId)) {
             shouldDelete = true;
           }
        }
        
        if (shouldDelete) {
          docsToDelete.push(d.id);
        }
      });
      
      const batchSize = 100;
      for (let i = 0; i < docsToDelete.length; i += batchSize) {
        const chunk = docsToDelete.slice(i, i + batchSize);
        const promises = chunk.map(id => {
          const docRef = doc(db, 'user_progress', id);
          return deleteDoc(docRef);
        });
        await Promise.all(promises);
      }
      
      setUserProgressMap({});
      setHardCount(0);
      setWeakCount(0);
      setWeakFlashcardCount(0);
      setWeakQuizCount(0);
      
    } catch (err) {
      console.error(err);
      alert("Gagal mereset progress");
    } finally {
      setIsResetting(false);
    }
  };`;

if(code.includes('handleResetProgress')) {
    code = code.replace(oldResetFunc, newResetFunc);
    fs.writeFileSync('src/pages/DeckView.tsx', code);
    console.log("Updated handleResetProgress in DeckView.tsx");
} else {
    console.log("Could not find oldResetFunc");
}

