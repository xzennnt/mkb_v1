import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add showJft
target_state_2 = """  const [showMnn2, setShowMnn2] = useState(() => {
    if (currentUser?.uid) {
      const stored = localStorage.getItem(`ui_showMnn2_${currentUser.uid}`);
      if (stored !== null) return stored === 'true';
    }
    return false;
  });"""
  
replace_state_2 = """  const [showMnn2, setShowMnn2] = useState(() => {
    if (currentUser?.uid) {
      const stored = localStorage.getItem(`ui_showMnn2_${currentUser.uid}`);
      if (stored !== null) return stored === 'true';
    }
    return false;
  });

  const [showJft, setShowJft] = useState(() => {
    if (currentUser?.uid) {
      const stored = localStorage.getItem(`ui_showJft_${currentUser.uid}`);
      if (stored !== null) return stored === 'true';
    }
    return true;
  });"""

content = content.replace(target_state_2, replace_state_2)

# Add toggleJft
target_toggle_2 = """  const toggleMnn2 = () => {
    const newVal = !showMnn2;
    setShowMnn2(newVal);
    if (currentUser?.uid) localStorage.setItem(`ui_showMnn2_${currentUser.uid}`, String(newVal));
  };"""
  
replace_toggle_2 = """  const toggleMnn2 = () => {
    const newVal = !showMnn2;
    setShowMnn2(newVal);
    if (currentUser?.uid) localStorage.setItem(`ui_showMnn2_${currentUser.uid}`, String(newVal));
  };

  const toggleJft = () => {
    const newVal = !showJft;
    setShowJft(newVal);
    if (currentUser?.uid) localStorage.setItem(`ui_showJft_${currentUser.uid}`, String(newVal));
  };"""

content = content.replace(target_toggle_2, replace_toggle_2)

# Render block for JFT A2
target_render_mnn2 = """              {/* Minna no Nihongo 2 */}"""
  
replace_render_mnn2 = """              {/* JFT A2 */}
              <div className="mb-6">
                <button 
                  onClick={toggleJft} 
                  className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                      <BookOpen size={20} />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Kosakata JFT A2 (1-50)</span>
                  </div>
                  {showJft ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                </button>
                
                {showJft && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.filter(c => c.name.startsWith('JFT_A2')).map((cat, idx) => (
                      <div 
                        key={idx}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-slate-800 text-lg">{cat.formattedName || cat.name}</h3>
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">
                            {cat.count} kata
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Link to={`/deck/${cat.name}`} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white text-center py-2 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
                            <BookOpen size={16} /> Pelajari
                          </Link>
                          <Link to={`/flashcard/${cat.name}`} className="bg-slate-50 text-slate-700 hover:bg-slate-800 hover:text-white text-center py-2 rounded-xl font-bold transition-colors shadow-sm">
                            Flashcard
                          </Link>
                        </div>
                      </div>
                    ))}
                    {categories.filter(c => c.name.startsWith('JFT_A2')).length === 0 && (
                      <div className="col-span-1 sm:col-span-2 text-center p-4 text-slate-500">Belum ada data.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Minna no Nihongo 2 */}"""
content = content.replace(target_render_mnn2, replace_render_mnn2)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

