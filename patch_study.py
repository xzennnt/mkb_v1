import re

with open('src/pages/Study.tsx', 'r') as f:
    content = f.read()

old_str = """      setDoc(doc(db, 'study_sessions', sessionId), {
        id: sessionId,
        userId: currentUser.uid,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        totalDuration: durationSec,
        cardsReviewed: sessionCards.length,
        correctCount,
        incorrectCount
      }).catch(console.error);"""

new_str = """      setDoc(doc(db, 'study_sessions', sessionId), {
        id: sessionId,
        userId: currentUser.uid,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        totalDuration: durationSec,
        cardsReviewed: sessionCards.length,
        correctCount,
        incorrectCount,
        type: 'Belajar Baru',
        category: category || 'Materi Baru',
        failedVocabs: currentReports.filter(r => !r.isCorrect).map(r => ({ jp: r.jp, id_translation: r.id_translation }))
      }).catch(console.error);"""

content = content.replace(old_str, new_str)

with open('src/pages/Study.tsx', 'w') as f:
    f.write(content)
