import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add state
state_block = """  const [showJft, setShowJft] = useState(() => {
    if (currentUser?.uid) {
      const stored = localStorage.getItem(`ui_showJft_${currentUser.uid}`);
      if (stored !== null) return stored === 'true';
    }
    return true;
  });"""

new_state_block = state_block + """
  const [showKosakata, setShowKosakata] = useState(() => {
    if (currentUser?.uid) {
      const stored = localStorage.getItem(`ui_showKosakata_${currentUser.uid}`);
      if (stored !== null) return stored === 'true';
    }
    return true;
  });"""

content = content.replace(state_block, new_state_block)

# Add toggle
toggle_block = """  const toggleJft = () => {
    const newVal = !showJft;
    setShowJft(newVal);
    if (currentUser?.uid) localStorage.setItem(`ui_showJft_${currentUser.uid}`, String(newVal));
  };"""

new_toggle_block = toggle_block + """
  const toggleKosakata = () => {
    const newVal = !showKosakata;
    setShowKosakata(newVal);
    if (currentUser?.uid) localStorage.setItem(`ui_showKosakata_${currentUser.uid}`, String(newVal));
  };"""

content = content.replace(toggle_block, new_toggle_block)

# Add UI section
ui_block = """              {/* Other Categories if any */}
              {categories.filter(c => !c.name.startsWith('MNN') && !c.name.startsWith('JFT')).length > 0 && ("""

new_ui_block = """              {/* Kosakata Tambahan Section */}
              <div className="mb-6">
                <button 
                  onClick={toggleKosakata}
                  className="w-full flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                      <BookOpen size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-slate-800">Kosakata Dasar</h3>
                      <p className="text-xs text-slate-500">Kata Kerja, Sifat, Benda</p>
                    </div>
                  </div>
                  {showKosakata ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                </button>
                
                {showKosakata && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.filter(c => c.name.startsWith('Kata ')).map((cat, idx) => (
                      <div 
                        key={idx}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-slate-800 text-lg">{cat.formattedName || cat.name}</h3>
                          <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
                            {cat.count} kata
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Link to={`/deck/${cat.name}`} className="bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white text-center py-2 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
                            <BookOpen size={16} /> Pelajari
                          </Link>
                          <Link to={`/flashcard/${cat.name}`} className="bg-slate-50 text-slate-700 hover:bg-slate-800 hover:text-white text-center py-2 rounded-xl font-bold transition-colors shadow-sm">
                            Flashcard
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Categories if any */}
              {categories.filter(c => !c.name.startsWith('MNN') && !c.name.startsWith('JFT') && !c.name.startsWith('Kata ')).length > 0 && ("""

content = content.replace(ui_block, new_ui_block)

# Fix map for Lainnya
content = content.replace("categories.filter(c => !c.name.startsWith('MNN') && !c.name.startsWith('JFT')).map((cat, idx) => (", "categories.filter(c => !c.name.startsWith('MNN') && !c.name.startsWith('JFT') && !c.name.startsWith('Kata ')).map((cat, idx) => (")


with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
