const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const oldLoop = `        docs.forEach(data => {
           if (seenVocabs.has(data.vocabId)) return;
           seenVocabs.add(data.vocabId);
           if (data.nextReviewTime <= now) {
              dueCount++;
           }
           let pCat = data.category;
           if (!pCat) {
             const v = allVocabularies.find(voc => voc.id === data.vocabId);
             if (v) pCat = v.category;
             
             // Dynamic Backfill: Fire and forget to fix the DB when we encounter a broken one
             if (pCat && data.id) {
               updateDoc(doc(db, 'user_progress', data.id), { category: pCat }).catch(() => {});
             }
           }
           if (pCat && ((data.failCount && data.failCount > 0) || data.srsLevel === 'again' || data.srsLevel === 'hard')) {
              hardMap[pCat] = (hardMap[pCat] || 0) + 1;
           }
        });`;

const newLoop = `        let trueMasteredCount = 0;
        docs.forEach(data => {
           if (seenVocabs.has(data.vocabId)) return;
           seenVocabs.add(data.vocabId);
           if (data.nextReviewTime <= now) {
              dueCount++;
           }
           let pCat = data.category;
           if (!pCat) {
             const v = allVocabularies.find(voc => voc.id === data.vocabId);
             if (v) pCat = v.category;
             
             if (pCat && data.id) {
               updateDoc(doc(db, 'user_progress', data.id), { category: pCat }).catch(() => {});
             }
           }
           
           if (pCat && !pCat.includes('Hiragana') && !pCat.includes('Katakana')) {
              // Mastered means they have reviewed it correctly at least once (interval >= 1440 minutes = 1 day)
              if (data.interval >= 1440 && data.srsLevel !== 'again') {
                trueMasteredCount++;
              }
           }

           if (pCat && ((data.failCount && data.failCount > 0) || data.srsLevel === 'again' || data.srsLevel === 'hard')) {
              hardMap[pCat] = (hardMap[pCat] || 0) + 1;
           }
        });
        
        if (userData && (userData.masteredVocabCount || 0) !== trueMasteredCount) {
           updateDoc(doc(db, 'users', currentUser.uid), { masteredVocabCount: trueMasteredCount }).catch(() => {});
        }`;

code = code.replace(oldLoop, newLoop);
fs.writeFileSync('src/pages/Dashboard.tsx', code);
