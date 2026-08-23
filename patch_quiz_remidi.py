import re

# PATCH Quiz.tsx
with open('src/pages/Quiz.tsx', 'r') as f:
    content = f.read()

handle_remidi_code = """  const handleRemidi = () => {
    removeSessionState(currentUser?.uid, 'quiz_state_' + category + '_' + sessionIndex);
    const wrongVocabIds = reports.filter(r => !r.isCorrect).map(r => r.vocabId);
    const remidiCards = sessionCards.filter(c => wrongVocabIds.includes(c.id));
    
    setSessionCards(remidiCards);
    setCurrentIndex(0);
    setReports([]);
    setIsFinished(false);
    setSelectedAnswer(null);
    setTotalTime(0);
    
    const newDirs: any[] = [];
    remidiCards.forEach(() => {
      const isKana = category === 'Hiragana' || category === 'Katakana' || category === 'Hiragana Lanjutan' || category === 'Katakana Lanjutan';
      const possibleDirs = isKana ? ['jp-to-romaji', 'romaji-to-jp'] : ['jp-to-id', 'id-to-jp', 'jp-to-romaji', 'romaji-to-id', 'id-to-romaji'];
      newDirs.push(possibleDirs[Math.floor(Math.random() * possibleDirs.length)]);
    });
    setDirections(newDirs);
    
    if (remidiCards.length > 0) {
      setupCard(remidiCards[0], allVocabs, newDirs[0]);
    }
  };

  const handleReset = () => {"""

content = content.replace("  const handleReset = () => {", handle_remidi_code)

old_buttons = """          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={handleReset} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md w-full sm:w-auto">
              Ulangi Kuis
            </button>"""

new_buttons = """          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {reports.filter(r => !r.isCorrect).length > 0 && (
              <button onClick={handleRemidi} className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 shadow-md w-full sm:w-auto">
                Remidi yang Salah
              </button>
            )}
            <button onClick={handleReset} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md w-full sm:w-auto">
              Ulangi Semua
            </button>"""

content = content.replace(old_buttons, new_buttons)

with open('src/pages/Quiz.tsx', 'w') as f:
    f.write(content)


# PATCH Review.tsx
with open('src/pages/Review.tsx', 'r') as f:
    content2 = f.read()

handle_remidi_code2 = """  const handleRemidi = () => {
    removeSessionState(currentUser?.uid, 'review_state');
    const wrongVocabIds = reports.filter(r => !r.isCorrect).map(r => r.vocabId);
    const remidiCards = sessionCards.filter(c => wrongVocabIds.includes(c.id));
    
    setSessionCards(remidiCards);
    setCurrentIndex(0);
    setReports([]);
    setIsFinished(false);
    setSelectedAnswer(null);
    setTotalTime(0);
    
    const newDirs: any[] = [];
    remidiCards.forEach(() => {
      const possibleDirs = ['jp-to-id', 'id-to-jp'];
      newDirs.push(possibleDirs[Math.floor(Math.random() * possibleDirs.length)]);
    });
    setDirections(newDirs);
    
    if (remidiCards.length > 0) {
      setupCard(remidiCards[0], allVocabs, newDirs[0]);
    }
  };

  const handleReset = () => {"""

content2 = content2.replace("  const handleReset = () => {", handle_remidi_code2)

old_buttons2 = """          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={handleReset} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md w-full sm:w-auto">
              Ulangi Kuis
            </button>"""

new_buttons2 = """          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {reports.filter(r => !r.isCorrect).length > 0 && (
              <button onClick={handleRemidi} className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 shadow-md w-full sm:w-auto">
                Remidi yang Salah
              </button>
            )}
            <button onClick={handleReset} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md w-full sm:w-auto">
              Ulangi Semua
            </button>"""

content2 = content2.replace(old_buttons2, new_buttons2)

with open('src/pages/Review.tsx', 'w') as f:
    f.write(content2)
