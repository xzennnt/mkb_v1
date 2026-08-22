import re

with open('src/pages/Quiz.tsx', 'r') as f:
    content = f.read()

reset_func = """
  const handleReset = () => {
    localStorage.removeItem('quiz_state_' + category + '_' + sessionIndex);
    setCurrentIndex(0);
    setReports([]);
    setIsFinished(false);
    setSelectedAnswer(null);
    setTotalTime(0);
    
    // Generate new directions
    const newDirs: any[] = [];
    sessionCards.forEach(() => {
      const isKana = category === 'Hiragana' || category === 'Katakana' || category === 'Hiragana Lanjutan' || category === 'Katakana Lanjutan';
      const possibleDirs = isKana ? ['jp-to-romaji', 'romaji-to-jp'] : ['jp-to-id', 'id-to-jp', 'jp-to-romaji', 'romaji-to-id', 'id-to-romaji'];
      newDirs.push(possibleDirs[Math.floor(Math.random() * possibleDirs.length)]);
    });
    setDirections(newDirs);
    
    if (sessionCards.length > 0) {
      setupCard(sessionCards[0], allVocabs, newDirs[0]);
    }
  };
"""

content = content.replace("  const handleAnswer = async (answer: string) => {", reset_func + "\n  const handleAnswer = async (answer: string) => {")

old_btns = """          <button onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)} className="mt-4 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md">
            Kembali ke Daftar Menu
          </button>"""
new_btns = """          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={handleReset} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md w-full sm:w-auto">
              Ulangi Kuis
            </button>
            <button onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)} className="bg-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-300 shadow-md w-full sm:w-auto">
              Kembali ke Menu
            </button>
          </div>"""

content = content.replace(old_btns, new_btns)

with open('src/pages/Quiz.tsx', 'w') as f:
    f.write(content)
