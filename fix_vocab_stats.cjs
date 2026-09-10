const fs = require('fs');

function injectVocabStats(file, isFlashcard) {
    let code = fs.readFileSync(file, 'utf8');
    
    const tryBlockRegex = /try\s*\{\s*await setDoc\(doc\(db,\s*'user_progress', progressId\), newProg, \{ merge: true \}\);/g;
    
    // For Flashcard
    const flashcardReplacement = `try {
        await setDoc(doc(db, 'user_progress', progressId), newProg, { merge: true });
        
        // Update global vocab stats for Admin Kotoba Lemah
        const safeVocabId = currentCard.originalId || currentCard.id;
        if (safeVocabId && safeVocabId !== 'undefined') {
          const vocabStatsRef = doc(db, 'vocabStats', safeVocabId);
          if (!isRemembered) {
             setDoc(vocabStatsRef, {
               failCount: increment(1),
               jp: currentCard.jp,
               romaji: currentCard.romaji,
               id_translation: currentCard.id_translation,
               category: category || currentCard.category
             }, { merge: true }).catch(() => {});
          } else if (srsLevel === 'hard') {
             setDoc(vocabStatsRef, {
               hardCount: increment(1),
               jp: currentCard.jp,
               romaji: currentCard.romaji,
               id_translation: currentCard.id_translation,
               category: category || currentCard.category
             }, { merge: true }).catch(() => {});
          }
        }
`;

    // For Quiz
    const quizTryBlockRegex = /\/\/ Update user stats/g;
    
    if (isFlashcard) {
        code = code.replace(tryBlockRegex, flashcardReplacement);
    }
    
    fs.writeFileSync(file, code);
}

injectVocabStats('src/pages/Flashcard.tsx', true);
injectVocabStats('src/pages/ReviewFlashcardSRS.tsx', true);
