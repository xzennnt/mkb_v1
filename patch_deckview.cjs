const fs = require('fs');
let code = fs.readFileSync('src/pages/DeckView.tsx', 'utf8');

// 1. Update imports
code = code.replace(
  /import { collection, query, where, getDocs, updateDoc, doc } from 'firebase\/firestore';/,
  "import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';"
);

code = code.replace(
  /import { ArrowLeft, Play, BookOpen, ArrowUp, Zap , Flame } from 'lucide-react';/,
  "import { ArrowLeft, Play, BookOpen, ArrowUp, Zap , Flame, Search, RotateCcw } from 'lucide-react';"
);

// 2. Add states & functions
const newStatesStr = `  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();`;

code = code.replace(
  /  const \[loading, setLoading\] = useState\(true\);\s*const navigate = useNavigate\(\);/,
  newStatesStr
);

const newLogicStr = `  const totalSessions = Math.ceil(vocabs.length / 10);

  const handleResetProgress = async () => {
    if (!currentUser) return;
    if (!window.confirm(\`Apakah Anda yakin ingin mereset semua progress flashcard untuk bab ini? Aksi ini tidak dapat dibatalkan.\`)) {
      return;
    }
    setIsResetting(true);
    try {
      // Chunking array to avoid overwhelming Firestore in one go if large
      const batchSize = 100;
      for (let i = 0; i < vocabs.length; i += batchSize) {
        const chunk = vocabs.slice(i, i + batchSize);
        const promises = chunk.map(v => {
          const docRef = doc(db, 'user_progress', \`\${currentUser.uid}_\${v.id}\`);
          return deleteDoc(docRef);
        });
        await Promise.all(promises);
      }
      
      setUserProgressMap({});
      setHardCount(0);
      setWeakCount(0);
      setWeakFlashcardCount(0);
      setWeakQuizCount(0);
      
    } catch (err) {
      console.error(err);
      alert("Gagal mereset progress");
    } finally {
      setIsResetting(false);
    }
  };

  const filteredVocabs = vocabs.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.jp.toLowerCase().includes(q) ||
      (v.romaji && v.romaji.toLowerCase().includes(q)) ||
      (v.id_translation && v.id_translation.toLowerCase().includes(q))
    );
  });
`;

code = code.replace(
  /  \/\/ Calculate number of sessions \(10 vocabs per session\)\s*const totalSessions = Math\.ceil\(vocabs\.length \/ 10\);/,
  newLogicStr
);

// 3. Update UI
const uiOld = `<div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Daftar Kotoba</h2>
          <span className="text-sm text-slate-500 font-medium">Diurutkan berdasarkan yang paling sering salah</span>
        </div>
        <div className="divide-y divide-slate-100">
          {vocabs.map((v, index) => {`;

const uiNew = `<div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Daftar Kotoba</h2>
            <span className="text-sm text-slate-500 font-medium">Diurutkan berdasarkan yang paling sering salah</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari kosakata..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
              />
            </div>
            {category !== 'Review' && (
              <button
                onClick={handleResetProgress}
                disabled={isResetting}
                className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-2 px-4 rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                <RotateCcw size={16} className={isResetting ? "animate-spin" : ""} />
                <span className="text-sm whitespace-nowrap">{isResetting ? "Mereset..." : "Reset Progress"}</span>
              </button>
            )}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredVocabs.map((v, index) => {`;

code = code.replace(uiOld, uiNew);
code = code.replace(
  /\{vocabs\.length === 0 && \(/,
  "{filteredVocabs.length === 0 && ("
);

fs.writeFileSync('src/pages/DeckView.tsx', code);
console.log('DeckView patched successfully');
