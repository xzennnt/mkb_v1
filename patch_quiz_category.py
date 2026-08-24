import re

with open('src/pages/Quiz.tsx', 'r') as f:
    content = f.read()

old_set_doc = """    setDoc(progressRef, {
      id: `${currentUser?.uid}_${currentVocab.id}`,
      userId: currentUser?.uid,
      vocabId: currentVocab.id,
      nextReviewTime: srsResult.nextReviewTime,
      interval: srsResult.nextInterval,
      reps: (prevProgress?.reps || 0) + srsResult.reps,
      srsLevel: srsResult.srsLevel,
      ...(isCorrect ? {} : { isWeak: true })
    }, { merge: true }).catch(console.error);"""

new_set_doc = """    setDoc(progressRef, {
      id: `${currentUser?.uid}_${currentVocab.id}`,
      userId: currentUser?.uid,
      vocabId: currentVocab.id,
      category: currentVocab.category || category,
      nextReviewTime: srsResult.nextReviewTime,
      interval: srsResult.nextInterval,
      reps: (prevProgress?.reps || 0) + srsResult.reps,
      srsLevel: srsResult.srsLevel,
      ...(isCorrect ? {} : { isWeak: true })
    }, { merge: true }).catch(console.error);"""

content = content.replace(old_set_doc, new_set_doc)

with open('src/pages/Quiz.tsx', 'w') as f:
    f.write(content)
