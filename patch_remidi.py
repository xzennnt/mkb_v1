import re

files = ['src/pages/Flashcard.tsx', 'src/pages/ReviewFlashcard.tsx']

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Add handleRemidi just before handleReset
    handle_remidi_code = """  const handleRemidi = () => {
    const remidiVocabs = initialVocabs.filter(v => notRememberedIds.includes(v.id));
    setQueue([...remidiVocabs]);
    setSessionTotal(remidiVocabs.length);
    setMasteredCount(0);
    setNotRememberedIds([]);
    setIsFinished(false);
  };

  const handleReset = () => {"""
    
    content = content.replace("  const handleReset = () => {", handle_remidi_code)

    # Add Remidi button to the isFinished screen
    old_finished_screen = """        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button 
            onClick={handleReset}
            className="py-3 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors w-full"
          >
            Ulangi Flashcard
          </button>"""
          
    new_finished_screen = """        <div className="flex flex-col gap-3 w-full max-w-sm">
          {notRememberedIds.length > 0 && (
            <button 
              onClick={handleRemidi}
              className="py-3 px-6 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors w-full shadow-sm"
            >
              Ulangi yang Salah (Remidi)
            </button>
          )}
          <button 
            onClick={handleReset}
            className="py-3 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors w-full"
          >
            Ulangi Semua
          </button>"""

    content = content.replace(old_finished_screen, new_finished_screen)

    with open(file, 'w') as f:
        f.write(content)
