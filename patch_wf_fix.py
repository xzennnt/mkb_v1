import re

with open('src/pages/WeakFlashcard.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { collection, query, getDocs, where, doc, updateDoc, getDoc } from 'firebase/firestore';", 
"import { collection, query, getDocs, where, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';")

old_str = """      import('firebase/firestore').then(({ setDoc, doc, collection }) => {
         setDoc(doc(db, 'study_sessions', sessionId), {
            id: sessionId,
            userId: currentUser?.uid,
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            totalDuration: durationSec,
            cardsReviewed: vocabs.length,
            correctCount: successVocabs.size + (correct ? 1 : 0),
            incorrectCount: vocabs.length - (successVocabs.size + (correct ? 1 : 0)),
            type: 'Flashcard Remidial',
            category: category || 'Remidial',
            failedVocabs: correct ? failedList : [...failedList, { jp: vocabs[currentIndex].jp, id_translation: vocabs[currentIndex].id_translation }]
         }).catch(console.error);
      });"""

new_str = """      setDoc(doc(db, 'study_sessions', sessionId), {
        id: sessionId,
        userId: currentUser?.uid,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        totalDuration: durationSec,
        cardsReviewed: vocabs.length,
        correctCount: successVocabs.size + (correct ? 1 : 0),
        incorrectCount: vocabs.length - (successVocabs.size + (correct ? 1 : 0)),
        type: 'Flashcard Remidial',
        category: category || 'Remidial',
        failedVocabs: correct ? failedList : [...failedList, { jp: vocabs[currentIndex].jp, id_translation: vocabs[currentIndex].id_translation }]
      }).catch(console.error);"""

content = content.replace(old_str, new_str)

with open('src/pages/WeakFlashcard.tsx', 'w') as f:
    f.write(content)
