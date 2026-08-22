import re

with open('src/pages/Flashcard.tsx', 'r') as f:
    content = f.read()

# Add handleReset
target_reset_logic = """  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] text-slate-500">Memuat flashcard...</div>;
  }"""
replacement_reset_logic = """  const handleReset = () => {
    localStorage.removeItem('flashcard_state_' + category);
    setQueue([...initialVocabs]);
    setSessionTotal(initialVocabs.length);
    setMasteredCount(0);
    setNotRememberedIds([]);
    setIsFinished(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] text-slate-500">Memuat flashcard...</div>;
  }"""

content = content.replace(target_reset_logic, replacement_reset_logic)


# Update the UI for finished
target_ui_1 = """          <button 
            onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)} 
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }"""
replacement_ui_1 = """          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)} 
              className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl shadow hover:bg-slate-300 transition"
            >
              Kembali
            </button>
            <button 
              onClick={handleReset} 
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow hover:bg-indigo-700 transition"
            >
              Ulangi Flashcard
            </button>
          </div>
        </div>
      </div>
    );
  }"""
content = content.replace(target_ui_1, replacement_ui_1)


target_ui_2 = """        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button 
            onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)}
            className="py-3 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors w-full"
          >
            Kembali ke Menu
          </button>
        </div>
      </motion.div>
    );
  }"""
replacement_ui_2 = """        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button 
            onClick={handleReset}
            className="py-3 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors w-full"
          >
            Ulangi Flashcard
          </button>
          <button 
            onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)}
            className="py-3 px-6 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors w-full"
          >
            Kembali ke Menu
          </button>
        </div>
      </motion.div>
    );
  }"""
content = content.replace(target_ui_2, replacement_ui_2)

with open('src/pages/Flashcard.tsx', 'w') as f:
    f.write(content)
