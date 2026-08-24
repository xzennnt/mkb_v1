import re

def replace_in_file(filename, old_str, new_str):
    with open(filename, 'r') as f:
        content = f.read()
    if old_str not in content:
        print(f"Failed to find old string in {filename}")
        return
    content = content.replace(old_str, new_str)
    with open(filename, 'w') as f:
        f.write(content)

# WeakFlashcard.tsx
replace_in_file('src/pages/WeakFlashcard.tsx', 
                "import { collection, query, getDocs, where, doc, updateDoc } from 'firebase/firestore';", 
                "import { collection, query, getDocs, where, doc, updateDoc, getDoc } from 'firebase/firestore';")

old_wfc_fetch = """      docs.forEach(data => {
        let pCat = data.category;"""
new_wfc_fetch = """      docs.forEach(data => {
        if (data.weakFlashcard === false) return;
        let pCat = data.category;"""
replace_in_file('src/pages/WeakFlashcard.tsx', old_wfc_fetch, new_wfc_fetch)

old_wfc_next = """  const handleNext = async (correct: boolean) => {
    if (correct) {
      const vId = vocabs[currentIndex].id;
      setSuccessVocabs(prev => new Set(prev).add(vId));
      // NOTE: Flashcard review alone does NOT graduate from Weak Words.
      // User requested that remedial flashcards do NOT remove the items from remedial,
      // only the 2-way remedial quiz does.
    }"""
new_wfc_next = """  const handleNext = async (correct: boolean) => {
    if (correct) {
      const vId = vocabs[currentIndex].id;
      setSuccessVocabs(prev => new Set(prev).add(vId));
      
      const progressRef = doc(db, 'user_progress', `${currentUser?.uid}_${vId}`);
      try {
        const progSnap = await getDoc(progressRef);
        if (progSnap.exists()) {
          const pData = progSnap.data();
          if (pData.weakQuiz === false) {
             await updateDoc(progressRef, { isWeak: false, weakFlashcard: false });
          } else {
             await updateDoc(progressRef, { weakFlashcard: false });
          }
        }
      } catch(e) { console.error(e); }
    }"""
replace_in_file('src/pages/WeakFlashcard.tsx', old_wfc_next, new_wfc_next)

# WeakQuiz.tsx
replace_in_file('src/pages/WeakQuiz.tsx', 
                "import { collection, query, getDocs, doc, setDoc, where, updateDoc } from 'firebase/firestore';", 
                "import { collection, query, getDocs, doc, setDoc, where, updateDoc, getDoc } from 'firebase/firestore';")

old_wq_fetch = """      docs.forEach(data => {
        let pCat = data.category;"""
new_wq_fetch = """      docs.forEach(data => {
        if (data.weakQuiz === false) return;
        let pCat = data.category;"""
replace_in_file('src/pages/WeakQuiz.tsx', old_wq_fetch, new_wq_fetch)

old_wq_lulus = """          // LULUS!
          const progressRef = doc(db, 'user_progress', `${currentUser.uid}_${vId}`);
          await updateDoc(progressRef, { isWeak: false }).catch(console.error);"""
new_wq_lulus = """          // LULUS!
          const progressRef = doc(db, 'user_progress', `${currentUser.uid}_${vId}`);
          try {
            const progSnap = await getDoc(progressRef);
            if (progSnap.exists()) {
              const pData = progSnap.data();
              if (pData.weakFlashcard === false) {
                 await updateDoc(progressRef, { isWeak: false, weakQuiz: false });
              } else {
                 await updateDoc(progressRef, { weakQuiz: false });
              }
            }
          } catch(e) { console.error(e); }"""
replace_in_file('src/pages/WeakQuiz.tsx', old_wq_lulus, new_wq_lulus)

