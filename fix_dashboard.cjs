const fs = require('fs');
const content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

const regex = /<\/div>\s*<\/div>\s*<h2 className="text-2xl font-black text-slate-800 mb-4">Menu Belajar \(Bab\)<\/h2>/;

const replacement = `                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-xl text-emerald-500">
                      <span className="text-2xl font-bold">が</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">Hiragana Lanjutan</h3>
                      <p className="text-sm text-slate-500">Dakuten, Yoon, dll</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <button 
                      onClick={() => navigate(\`/deck/Hiragana Lanjutan\`)}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Tabel
                    </button>
                    <button 
                      onClick={() => navigate(\`/flashcard/Hiragana Lanjutan\`)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Flashcard
                    </button>
                    <button 
                      onClick={() => navigate(\`/quiz/Hiragana Lanjutan/0\`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Latihan
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-xl text-emerald-500">
                      <span className="text-2xl font-bold">ガ</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">Katakana Lanjutan</h3>
                      <p className="text-sm text-slate-500">Dakuten, Yoon, dll</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <button 
                      onClick={() => navigate(\`/deck/Katakana Lanjutan\`)}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Tabel
                    </button>
                    <button 
                      onClick={() => navigate(\`/flashcard/Katakana Lanjutan\`)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Flashcard
                    </button>
                    <button 
                      onClick={() => navigate(\`/quiz/Katakana Lanjutan/0\`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Latihan
                    </button>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-800 mb-4">Menu Belajar (Bab)</h2>`;

if (regex.test(content)) {
  fs.writeFileSync('src/pages/Dashboard.tsx', content.replace(regex, replacement));
  console.log('Success');
} else {
  console.log('Target not found');
}
