const fs = require('fs');

const code = `import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { Vocabulary, UserProgress } from '../types';
import { ArrowLeft } from 'lucide-react';
import { hiraganaData, katakanaData, hiraganaAdvancedData, katakanaAdvancedData } from '../data/kana';
import { useAuth } from '../contexts/AuthContext';
import { getVocabulariesByCategory } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function Flashcard() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [initialVocabs, setInitialVocabs] = useState<Vocabulary[]>([]);
  const [queue, setQueue] = useState<Vocabulary[]>([]);
  const [progressData, setProgressData] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const [masteredCount, setMasteredCount] = useState(0);

  useEffect(() => {
    const fetchVocabs = async () => {
      if (!category) return;
      
      let fetchedVocabs: Vocabulary[] = [];
      if (category === 'Hiragana') {
        fetchedVocabs = hiraganaData as any;
      } else if (category === 'Hiragana Lanjutan') {
        fetchedVocabs = hiraganaAdvancedData as any;
      } else if (category === 'Katakana Lanjutan') {
        fetchedVocabs = katakanaAdvancedData as any;
      } else if (category === 'Katakana') {
        fetchedVocabs = katakanaData as any;
      } else {
        const rawVocabs = getVocabulariesByCategory(category);
        const seen = new Set();
        fetchedVocabs = rawVocabs.filter(v => {
          if (seen.has(v.jp)) return false;
          seen.add(v.jp);
          return true;
        });
      }
      
      setInitialVocabs(fetchedVocabs);
      
      if (currentUser) {
        const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
        const progSnap = await getDocs(progQ);
        const pData: Record<string, UserProgress> = {};
        
        let mCount = 0;
        progSnap.docs.forEach(d => {
          const p = { ...d.data(), id: d.id } as UserProgress;
          pData[p.vocabId] = p;
        });
        setProgressData(pData);
        
        // Filter out vocabs that are not due (e.g. good/easy with nextReviewTime in the future)
        // Or for now, we just put everything in queue, but "Ingat" removes them from queue.
        // For SRS: if it's already 'good'/'easy', we can count it as mastered for this session.
        const dueQueue: Vocabulary[] = [];
        fetchedVocabs.forEach(v => {
          const prog = pData[v.id];
          if (prog && (prog.srsLevel === 'good' || prog.srsLevel === 'easy')) {
            mCount++;
          }
          // In a real SRS we'd check if nextReviewTime < Date.now(), 
          // but let's just let the user study all in the category for now, 
          // just placing them in queue
          dueQueue.push(v); 
        });
        
        setQueue(dueQueue);
        setMasteredCount(mCount);
      } else {
        setQueue(fetchedVocabs);
      }
      setLoading(false);
    };
    fetchVocabs();
  }, [category, currentUser]);

  const handleRating = async (isRemembered: boolean) => {
    if (queue.length === 0) return;
    
    const currentCard = queue[0];
    
    if (currentUser) {
      const now = Date.now();
      let nextInterval = isRemembered ? 24 * 60 : 1; 
      let srsLevel: 'again' | 'hard' | 'good' | 'easy' | 'new' = isRemembered ? 'good' : 'again';
      
      const currentProg = progressData[currentCard.id];
      let reps = 1;
      
      if (currentProg) {
        reps = currentProg.reps + 1;
        if (isRemembered) {
          nextInterval = currentProg.interval * 2.5; 
        } else {
          nextInterval = 1;
        }
      }
      
      const nextReviewTime = now + (nextInterval * 60 * 1000);
      const progressId = currentProg?.id || doc(collection(db, 'user_progress')).id;
      
      const newProg: UserProgress = {
        id: progressId,
        userId: currentUser.uid,
        vocabId: currentCard.id,
        interval: nextInterval,
        nextReviewTime,
        reps,
        srsLevel
      };
      
      setProgressData(prev => ({ ...prev, [currentCard.id]: newProg }));
      
      try {
        await setDoc(doc(db, 'user_progress', progressId), newProg);
      } catch (err) {
        console.error('Failed to update progress', err);
      }
    }

    setIsFlipped(false);
    
    setTimeout(() => {
      setQueue(prevQueue => {
        const newQueue = [...prevQueue];
        const card = newQueue.shift(); // remove from front
        
        if (!isRemembered && card) {
          // If not remembered, add back to end of queue
          newQueue.push(card);
        } else {
          setMasteredCount(m => m + 1);
        }
        
        if (newQueue.length === 0) {
          setIsFinished(true);
        }
        
        return newQueue;
      });
    }, 200);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] text-slate-500">Memuat flashcard...</div>;
  }

  if (initialVocabs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] p-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Tidak ada kartu</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Kembali</button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col items-center justify-center p-4"
      >
        <h2 className="text-3xl font-black text-[#1a1f36] mb-6">Selesai! 🎉</h2>
        <p className="text-lg text-slate-600 mb-8 text-center max-w-md">
          Kamu telah mengingat semua kartu pada sesi ini.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button 
            onClick={() => navigate(\`/deck/\${encodeURIComponent(category!)}\`)}
            className="py-3 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors w-full"
          >
            Kembali ke Menu
          </button>
        </div>
      </motion.div>
    );
  }

  const currentCard = queue[0];
  const isKana = category === 'Hiragana' || category === 'Katakana' || category === 'Hiragana Lanjutan' || category === 'Katakana Lanjutan';
  const remainingCount = queue.length;
  
  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans overflow-hidden">
      <header className="flex justify-between items-center p-6 relative max-w-5xl mx-auto w-full">
        <button 
          onClick={() => navigate(\`/deck/\${encodeURIComponent(category!)}\`)}
          className="flex items-center gap-2 font-bold text-lg text-indigo-600 hover:text-indigo-800 transition-colors z-10"
        >
          <ArrowLeft size={20} /> Kembali
        </button>
        <h1 className="absolute inset-0 flex items-center justify-center text-xl font-bold pointer-events-none text-slate-800">
          Belajar
        </h1>
        <div className="w-24"></div>
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col items-center">
        
        <div className="w-full max-w-xl mb-6">
          <div className="flex justify-between items-center">
            <div className="w-auto px-4 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg shadow-sm">
              Sisa: {remainingCount}
            </div>
            <div className="font-bold text-xl text-slate-700">
              {initialVocabs.length - remainingCount} / {initialVocabs.length}
            </div>
            <div className="w-auto px-4 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg shadow-sm">
              Ingat: {masteredCount}
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl flex-1 flex flex-col relative perspective-[1000px] mt-4 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard?.id || 'empty'}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute inset-0 w-full"
            >
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={\`relative w-full aspect-[4/3] max-h-[400px] cursor-pointer transition-all duration-500 transform-style-3d \${isFlipped ? 'rotate-x-180' : ''}\`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div 
                  className="absolute inset-0 bg-white rounded-3xl shadow-md border border-slate-200 flex flex-col items-center justify-center p-8 backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <h2 className="text-6xl md:text-7xl font-black text-[#1a1f36] text-center mb-8">{currentCard?.jp}</h2>
                  <p className="text-slate-400 absolute bottom-8 font-medium text-sm">
                    ketuk untuk balik
                  </p>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 bg-white rounded-3xl shadow-md border border-slate-200 flex flex-col items-center justify-center p-8 backface-hidden"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                >
                  <h2 className="text-4xl md:text-5xl font-black text-[#1a1f36] text-center mb-4">{currentCard?.id_translation}</h2>
                  {!isKana && <p className="text-slate-500 text-xl font-medium">{currentCard?.romaji || ''}</p>}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full max-w-xl grid grid-cols-2 gap-4 mt-auto">
          <button 
            onClick={() => handleRating(false)}
            className="py-4 bg-[#fff6f0] border-2 border-orange-200 text-orange-600 font-bold text-lg rounded-2xl hover:bg-orange-100 transition-colors shadow-sm"
          >
            X Belum Ingat
          </button>
          <button 
            onClick={() => handleRating(true)}
            className="py-4 bg-[#f0fdf4] border-2 border-green-200 text-green-700 font-bold text-lg rounded-2xl hover:bg-green-100 transition-colors shadow-sm"
          >
            Ingat ✓
          </button>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/Flashcard.tsx', code);
console.log("Updated Flashcard.tsx");
