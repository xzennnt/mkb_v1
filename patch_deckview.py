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

old_state = "  const [weakCount, setWeakCount] = useState(0);"
new_state = """  const [weakCount, setWeakCount] = useState(0);
  const [weakFlashcardCount, setWeakFlashcardCount] = useState(0);
  const [weakQuizCount, setWeakQuizCount] = useState(0);"""
replace_in_file('src/pages/DeckView.tsx', old_state, new_state)

old_calc = """        let wCount = 0;
        Object.values(pMap).forEach(p => {
          let pCat = p.category;
          if (!pCat) {
            const v = allVocabularies.find(voc => voc.id === p.vocabId);
            if (v) pCat = v.category;
            
            // Dynamic Backfill: Fire and forget to fix the DB
            if (pCat && p.id) {
               updateDoc(doc(db, 'user_progress', p.id), { category: pCat }).catch(() => {});
            }
          }
          if (p.isWeak && (pCat === category || category === 'Review')) {
            wCount++;
          }
        });
        setWeakCount(wCount);"""
new_calc = """        let wCount = 0;
        let wFCount = 0;
        let wQCount = 0;
        Object.values(pMap).forEach(p => {
          let pCat = p.category;
          if (!pCat) {
            const v = allVocabularies.find(voc => voc.id === p.vocabId);
            if (v) pCat = v.category;
            
            if (pCat && p.id) {
               updateDoc(doc(db, 'user_progress', p.id), { category: pCat }).catch(() => {});
            }
          }
          if (p.isWeak && (pCat === category || category === 'Review')) {
            wCount++;
            if (p.weakFlashcard !== false) wFCount++;
            if (p.weakQuiz !== false) wQCount++;
          }
        });
        setWeakCount(wCount);
        setWeakFlashcardCount(wFCount);
        setWeakQuizCount(wQCount);"""
replace_in_file('src/pages/DeckView.tsx', old_calc, new_calc)

old_ui = """            {weakCount > 0 && (
              <div className="w-full max-w-sm mx-auto bg-rose-50 border border-rose-200 p-4 rounded-2xl mt-4 shadow-sm">
                <div className="flex items-center gap-2 text-rose-600 font-bold mb-3 justify-center">
                  <Flame size={20} />
                  <span>Bank Kotoba Lemah (Remidial Bab)</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => navigate(`/weak-flashcard/${category}`)}
                    className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-xl transition-all"
                  >
                    <BookOpen size={18} /> Flashcard ({weakCount})
                  </button>
                  <button 
                    onClick={() => navigate(`/weak-quiz/${category}`)}
                    className="flex items-center justify-center gap-2 bg-white text-rose-600 hover:bg-rose-100 border border-rose-200 font-bold py-3 px-4 rounded-xl transition-all"
                  >
                    <Play size={18} /> Kuis 2 Arah ({weakCount})
                  </button>
                </div>
              </div>
            )}"""

new_ui = """            {(weakFlashcardCount > 0 || weakQuizCount > 0) && (
              <div className="w-full max-w-sm mx-auto bg-rose-50 border border-rose-200 p-4 rounded-2xl mt-4 shadow-sm">
                <div className="flex items-center gap-2 text-rose-600 font-bold mb-3 justify-center">
                  <Flame size={20} />
                  <span>Bank Kotoba Lemah (Remidial Bab)</span>
                </div>
                <div className="flex flex-col gap-2">
                  {weakFlashcardCount > 0 && (
                    <button 
                      onClick={() => navigate(`/weak-flashcard/${category}`)}
                      className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm"
                    >
                      <BookOpen size={18} /> Flashcard ({weakFlashcardCount})
                    </button>
                  )}
                  {weakQuizCount > 0 && (
                    <button 
                      onClick={() => navigate(`/weak-quiz/${category}`)}
                      className="flex items-center justify-center gap-2 bg-white text-rose-600 hover:bg-rose-100 border border-rose-200 font-bold py-3 px-4 rounded-xl transition-all shadow-sm"
                    >
                      <Play size={18} /> Kuis 2 Arah ({weakQuizCount})
                    </button>
                  )}
                </div>
              </div>
            )}"""
replace_in_file('src/pages/DeckView.tsx', old_ui, new_ui)

