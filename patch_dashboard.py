import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# 1. Fetch weak vocabs count
fetch_reviews_code = """
    // Fetch Due Reviews & Hard Vocabs
    const fetchReviews = async () => {
      try {
        // We fetch ALL progress for this user to avoid composite index requirements
        const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
        const progSnap = await getDocs(progQ);
"""

new_fetch_reviews = """
    const [weakCount, setWeakCount] = useState<number>(0);

    // Fetch Due Reviews & Hard Vocabs
    const fetchReviews = async () => {
      try {
        // We fetch ALL progress for this user to avoid composite index requirements
        const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
        const progSnap = await getDocs(progQ);
"""
content = content.replace(fetch_reviews_code, new_fetch_reviews)

loop_code = """
        docs.forEach(data => {
           if (seenVocabs.has(data.vocabId)) return;
           seenVocabs.add(data.vocabId);

           if (data.nextReviewTime <= now) {
              dueCount++;
           }
        });
        
        setDueReviewCount(dueCount);
"""

new_loop_code = """
        let wCount = 0;
        docs.forEach(data => {
           if (seenVocabs.has(data.vocabId)) return;
           seenVocabs.add(data.vocabId);

           if (data.nextReviewTime <= now) {
              dueCount++;
           }
           if (data.isWeak) {
              wCount++;
           }
        });
        
        setDueReviewCount(dueCount);
        setWeakCount(wCount);
"""
content = content.replace(loop_code, new_loop_code)

# Update Banner UI
banner_ui = """
          {/* LONG-TERM MEMORY (SRS) REVIEW BANNER */}
          {dueReviewCount > 0 && (
            <div className="mb-6 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl shadow-md p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <BrainCircuit size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Review Kotoba Lemah</h2>
                  <p className="text-sm text-rose-100 mt-1">Ada {dueReviewCount} kosakata yang perlu Anda ulang agar masuk ke ingatan jangka panjang.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                <button onClick={() => navigate('/review-flashcard')} className="bg-white/20 text-white hover:bg-white/30 border border-white/30 px-5 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto text-center shadow-sm flex items-center justify-center gap-2">
                  <BookOpen size={18} /> via Flashcard
                </button>
                <button onClick={() => navigate('/review')} className="bg-white text-rose-600 hover:bg-rose-50 px-5 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto text-center shadow-sm flex items-center justify-center gap-2">
                  <Play size={18} /> via Kuis
                </button>
              </div>
            </div>
          )}
"""

new_banner_ui = """
          {/* LONG-TERM MEMORY (SRS) REVIEW BANNER */}
          {dueReviewCount > 0 && (
            <div className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-md p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <BrainCircuit size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Review Berkala (Spaced Repetition)</h2>
                  <p className="text-sm text-blue-100 mt-1">Ada {dueReviewCount} kosakata yang sudah waktunya diulang berdasarkan jadwal.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                <button onClick={() => navigate('/review-flashcard')} className="bg-white/20 text-white hover:bg-white/30 border border-white/30 px-5 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto text-center shadow-sm flex items-center justify-center gap-2">
                  <BookOpen size={18} /> via Flashcard
                </button>
                <button onClick={() => navigate('/review')} className="bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto text-center shadow-sm flex items-center justify-center gap-2">
                  <Play size={18} /> via Kuis
                </button>
              </div>
            </div>
          )}

          {/* BANK KOTOBA LEMAH BANNER */}
          {weakCount > 0 && (
            <div className="mb-6 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl shadow-md p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Flame size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Bank Kotoba Lemah</h2>
                  <p className="text-sm text-rose-100 mt-1">Ada {weakCount} kosakata yang perlu Anda perdalam (Remidial).</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                <button onClick={() => navigate('/weak-flashcard')} className="bg-white/20 text-white hover:bg-white/30 border border-white/30 px-5 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto text-center shadow-sm flex items-center justify-center gap-2">
                  <BookOpen size={18} /> via Flashcard
                </button>
                <button onClick={() => navigate('/weak-quiz')} className="bg-white text-rose-600 hover:bg-rose-50 px-5 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto text-center shadow-sm flex items-center justify-center gap-2">
                  <Play size={18} /> via Kuis (2 Arah)
                </button>
              </div>
            </div>
          )}
"""
content = content.replace(banner_ui, new_banner_ui)

if 'Flame' not in content:
    content = content.replace("BrainCircuit, Play, BookOpen", "BrainCircuit, Play, BookOpen, Flame")

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

