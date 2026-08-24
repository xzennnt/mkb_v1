import re

with open('src/pages/WeakFlashcard.tsx', 'r') as f:
    content = f.read()

old_func = """  const handleNext = async (correct: boolean) => {
    if (correct) {
      const vId = vocabs[currentIndex].id;
      setSuccessVocabs(prev => new Set(prev).add(vId));
      // NOTE: Flashcard review alone does NOT graduate from Weak Words, 
      // User requested "di ujikan di kuiz 2 arah" for graduation, but we can allow it 
      // if they just click "Hafal" here to make it easier if they want.
      // But let's follow strict instruction: only Kuiz graduates it. 
      // Wait, let's just make "Hafal" here remove it from weak too, as an alternate way.
      const progressRef = doc(db, 'user_progress', `${currentUser?.uid}_${vId}`);
      await updateDoc(progressRef, { isWeak: false }).catch(console.error);
    }
    
    if (currentIndex + 1 < vocabs.length) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };"""

new_func = """  const handleNext = async (correct: boolean) => {
    if (correct) {
      const vId = vocabs[currentIndex].id;
      setSuccessVocabs(prev => new Set(prev).add(vId));
      // NOTE: Flashcard review alone does NOT graduate from Weak Words.
      // User requested that remedial flashcards do NOT remove the items from remedial,
      // only the 2-way remedial quiz does.
    }
    
    if (currentIndex + 1 < vocabs.length) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };"""

content = content.replace(old_func, new_func)

with open('src/pages/WeakFlashcard.tsx', 'w') as f:
    f.write(content)
