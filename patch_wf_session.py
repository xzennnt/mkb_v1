import re

with open('src/pages/WeakFlashcard.tsx', 'r') as f:
    content = f.read()

old_state = """  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [successVocabs, setSuccessVocabs] = useState<Set<string>>(new Set());"""

new_state = """  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [successVocabs, setSuccessVocabs] = useState<Set<string>>(new Set());
  const [sessionStartTime] = useState(Date.now());
  const [failedList, setFailedList] = useState<{jp: string, id_translation: string}[]>([]);"""
content = content.replace(old_state, new_state)

old_finish = """    if (currentIndex + 1 < vocabs.length) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }"""

new_finish = """    if (!correct) {
      setFailedList(prev => [...prev, { jp: vocabs[currentIndex].jp, id_translation: vocabs[currentIndex].id_translation }]);
    }
    
    if (currentIndex + 1 < vocabs.length) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      const sessionEndTime = Date.now();
      const durationSec = Math.floor((sessionEndTime - sessionStartTime) / 1000);
      const sessionId = doc(collection(db, 'study_sessions')).id;
      // We pass doc from firebase/firestore which is already imported.
      // Wait, let's use setDoc
      import('firebase/firestore').then(({ setDoc, doc, collection }) => {
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
      });
    }"""
content = content.replace(old_finish, new_finish)

with open('src/pages/WeakFlashcard.tsx', 'w') as f:
    f.write(content)
