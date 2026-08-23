import re

with open('src/pages/ReviewFlashcardSRS.tsx', 'r') as f:
    content = f.read()

old_fetch = """        const querySnapshot = await getDocs(q);
        const progresses: Record<string, UserProgress> = {};
        const hardVocabIds: string[] = [];
        
        const now = Date.now();

        querySnapshot.forEach(docSnap => {
          const prog = docSnap.data() as UserProgress;
          if (prog.category === category && ((prog.failCount && prog.failCount > 0) || prog.srsLevel === 'again' || prog.srsLevel === 'hard')) {
            progresses[prog.vocabId] = prog;
            hardVocabIds.push(prog.vocabId);
          }
        });"""

new_fetch = """        const querySnapshot = await getDocs(q);
        const progresses: Record<string, UserProgress> = {};
        const hardVocabIds: string[] = [];
        
        const now = Date.now();
        
        const docs = querySnapshot.docs.map(d => ({ ...d.data(), id: d.id } as UserProgress));
        docs.sort((a, b) => (b.nextReviewTime || 0) - (a.nextReviewTime || 0));

        docs.forEach(prog => {
          if (!progresses[prog.vocabId]) {
            progresses[prog.vocabId] = prog;
            if (prog.category === category && ((prog.failCount && prog.failCount > 0) || prog.srsLevel === 'again' || prog.srsLevel === 'hard')) {
              hardVocabIds.push(prog.vocabId);
            }
          }
        });"""

content = content.replace(old_fetch, new_fetch)

# Also fix the duplicate progressId issue in ReviewFlashcardSRS
old_progress_id = "const progressId = currentProg?.id || doc(collection(db, 'user_progress')).id;"
new_progress_id = "const progressId = currentProg?.id && currentProg.id.includes('_') ? currentProg.id : `${currentUser.uid}_${currentCard.id}`;"
content = content.replace(old_progress_id, new_progress_id)

old_set_doc = "await setDoc(doc(db, 'user_progress', progressId), newProg);"
new_set_doc = "await setDoc(doc(db, 'user_progress', progressId), newProg, { merge: true });"
content = content.replace(old_set_doc, new_set_doc)

with open('src/pages/ReviewFlashcardSRS.tsx', 'w') as f:
    f.write(content)

