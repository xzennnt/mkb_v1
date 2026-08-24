import re

with open('src/pages/WeakQuiz.tsx', 'r') as f:
    content = f.read()

old_finish = """  const finishSession = async () => {
    if (!currentUser) return;
    setIsFinished(true);"""

new_finish = """  const [sessionStartTimeObj] = useState(Date.now());

  const finishSession = async () => {
    if (!currentUser) return;
    setIsFinished(true);"""

content = content.replace(old_finish, new_finish)

old_str = """      Object.keys(vocabSuccessMap).forEach(async (vId) => {
        const success = vocabSuccessMap[vId];
        if (success.p1 && success.p2) {"""

new_str = """      const sessionEndTime = Date.now();
      const durationSec = Math.floor((sessionEndTime - sessionStartTimeObj) / 1000);
      const correctCount = currentReports.filter(r => r.isCorrect).length;
      const incorrectCount = currentReports.length - correctCount;

      const sessionId = doc(collection(db, 'study_sessions')).id;
      setDoc(doc(db, 'study_sessions', sessionId), {
        id: sessionId,
        userId: currentUser.uid,
        startTime: sessionStartTimeObj,
        endTime: sessionEndTime,
        totalDuration: durationSec,
        cardsReviewed: sessionCards.length,
        correctCount,
        incorrectCount,
        type: 'Kuis Remidial',
        category: category || 'Remidial',
        failedVocabs: currentReports.filter(r => !r.isCorrect).map(r => ({ jp: r.jp, id_translation: r.id_translation }))
      }).catch(console.error);

      Object.keys(vocabSuccessMap).forEach(async (vId) => {
        const success = vocabSuccessMap[vId];
        if (success.p1 && success.p2) {"""

content = content.replace(old_str, new_str)

with open('src/pages/WeakQuiz.tsx', 'w') as f:
    f.write(content)
