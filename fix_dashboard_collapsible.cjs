const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

// add icons imports
code = code.replace("import { Play, Trophy, Clock, BrainCircuit, Settings, LogOut, BookOpen, ChevronRight } from 'lucide-react';", "import { Play, Trophy, Clock, BrainCircuit, Settings, LogOut, BookOpen, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';");

// add states
code = code.replace("const [loading, setLoading] = useState(true);", "const [loading, setLoading] = useState(true);\n  const [showMnn1, setShowMnn1] = useState(false);\n  const [showMnn2, setShowMnn2] = useState(true);");

// group rendering
const searchStr = `<h2 className="text-2xl font-black text-slate-800 mb-4">Menu Belajar (Bab)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat, idx) => (`;

const replaceStr = `<div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-slate-800">Menu Belajar (Bab)</h2>
              </div>
              
              {/* Minna no Nihongo 1 */}
              <div className="mb-6">
                <button 
                  onClick={() => setShowMnn1(!showMnn1)} 
                  className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                      <BookOpen size={20} />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Minna no Nihongo 1 (Bab 1 - 25)</span>
                  </div>
                  {showMnn1 ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                </button>
                
                {showMnn1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.filter(c => c.name.startsWith('MNN1')).map((cat, idx) => (
                      <div 
                        key={idx}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-500">
                            <BookOpen size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{cat.formattedName || cat.name}</h3>
                            <p className="text-sm text-slate-500">{cat.count} kosakata</p>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <button 
                            onClick={() => navigate(\`/deck/\${encodeURIComponent(cat.name)}\`)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm text-center transition-colors flex items-center justify-center gap-2"
                          >
                            <Play size={18} /> Mulai Belajar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Minna no Nihongo 2 */}
              <div className="mb-6">
                <button 
                  onClick={() => setShowMnn2(!showMnn2)} 
                  className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                      <BookOpen size={20} />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Minna no Nihongo 2 (Bab 26 - 50)</span>
                  </div>
                  {showMnn2 ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                </button>
                
                {showMnn2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.filter(c => c.name.startsWith('MNN2')).map((cat, idx) => (
                      <div 
                        key={idx}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-500">
                            <BookOpen size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{cat.formattedName || cat.name}</h3>
                            <p className="text-sm text-slate-500">{cat.count} kosakata</p>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <button 
                            onClick={() => navigate(\`/deck/\${encodeURIComponent(cat.name)}\`)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm text-center transition-colors flex items-center justify-center gap-2"
                          >
                            <Play size={18} /> Mulai Belajar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Other Categories if any */}
              {categories.filter(c => !c.name.startsWith('MNN')).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Lainnya</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.filter(c => !c.name.startsWith('MNN')).map((cat, idx) => (`;

const afterSearchStr = `                    <div className="mt-auto">
                      <button 
                        onClick={() => navigate(\`/deck/\${encodeURIComponent(cat.name)}\`)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm text-center transition-colors flex items-center justify-center gap-2"
                      >
                        <Play size={18} /> Mulai Belajar
                      </button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (`;

const replaceAfterStr = `                    <div className="mt-auto">
                      <button 
                        onClick={() => navigate(\`/deck/\${encodeURIComponent(cat.name)}\`)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm text-center transition-colors flex items-center justify-center gap-2"
                      >
                        <Play size={18} /> Mulai Belajar
                      </button>
                    </div>
                  </div>
                ))}
                  </div>
                </div>
              )}
                {categories.length === 0 && (`;

if (code.includes(searchStr)) {
  code = code.replace(searchStr, replaceStr);
  code = code.replace(afterSearchStr, replaceAfterStr);
  fs.writeFileSync('src/pages/Dashboard.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Pattern not found");
}
