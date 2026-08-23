import re

with open('src/pages/DeckView.tsx', 'r') as f:
    content = f.read()

# Add UI for Weak
ui_code = """
            {hardCount > 0 && (
              <button 
                onClick={() => navigate(`/srs/${category}`)}
                className="flex items-center justify-center gap-2 bg-rose-500 border border-rose-600 hover:bg-rose-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-md group w-full max-w-sm mx-auto"
              >
                <div className="flex items-center gap-2 group-hover:scale-105 transition-transform">
                  <BookOpen size={20} />
                  <span>REMIDI FLASHCARD ({hardCount})</span>
                </div>
              </button>
            )}
"""

new_ui_code = """
            {hardCount > 0 && (
              <button 
                onClick={() => navigate(`/srs/${category}`)}
                className="flex items-center justify-center gap-2 bg-indigo-500 border border-indigo-600 hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-md group w-full max-w-sm mx-auto"
              >
                <div className="flex items-center gap-2 group-hover:scale-105 transition-transform">
                  <BookOpen size={20} />
                  <span>Review Berkala SRS ({hardCount})</span>
                </div>
              </button>
            )}

            {weakCount > 0 && (
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
            )}
"""
content = content.replace(ui_code, new_ui_code)

if 'import { Zap' in content and 'Flame' not in content:
    content = content.replace("import { Zap, Play, ArrowLeft, BookOpen, Star, BrainCircuit }", "import { Zap, Play, ArrowLeft, BookOpen, Star, BrainCircuit, Flame }")
elif 'Flame' not in content:
    content = content.replace("import { Zap", "import { Flame, Zap")

with open('src/pages/DeckView.tsx', 'w') as f:
    f.write(content)
