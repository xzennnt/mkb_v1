import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { Vocabulary, UserProgress } from '../types';
import { ArrowLeft } from 'lucide-react';
import { hiraganaData, katakanaData, hiraganaAdvancedData, katakanaAdvancedData } from '../data/kana';
import { useAuth } from '../contexts/AuthContext';
import { getVocabulariesByCategory, formatCategoryName, allVocabularies } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { getSessionState, saveSessionState, removeSessionState } from '../utils/sessionState';

export default function ReviewFlashcard() {
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [initialVocabs, setInitialVocabs] = useState<Vocabulary[]>([]);
  const [queue, setQueue] = useState<Vocabulary[]>([]);
  const [progressData, setProgressData] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notRememberedIds, setNotRememberedIds] = useState<string[]>([]);
  
  const [masteredCount, setMasteredCount] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  useEffect(() => {
    const fetchVocabs = async () => {
      
      
      const savedState = await getSessionState(currentUser?.uid, 'review_flashcard_state');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setQueue(parsed.queue);
          setInitialVocabs(parsed.initialVocabs);
          setSessionTotal(parsed.sessionTotal);
          setMasteredCount(parsed.masteredCount);
          setNotRememberedIds(parsed.notRememberedIds || []);
          setLoading(false);
          
          localStorage.setItem('last_activity', JSON.stringify({
             category: 'Review',
             type: 'Flashcard',
             title: 'Review Kotoba (Flashcard)',
             link: '/review-flashcard'
           }));
          return;
        } catch(e) {
          console.error(e);
        }
      }
      
            let allV = allVocabularies;
      
      // Fetch all for this user, filter nextReviewTime locally to avoid needing a composite index
      const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
      const allProgSnap = await getDocs(progQ);
      
      const now = Date.now();
      const progSnap = {
        docs: allProgSnap.docs.filter(d => {
          const data = d.data();
          // In Review Flashcard (general), we want to review things that are overdue OR things that are marked as hard/again/failed
          return data.nextReviewTime <= now || (data.failCount && data.failCount > 0) || data.srsLevel === 'again' || data.srsLevel === 'hard';
        })
      };
      
      const pData: Record<string, UserProgress> = {};
      const fetchedVocabs: Vocabulary[] = [];
      
      const docs = progSnap.docs.map(d => ({ ...d.data(), id: d.id } as UserProgress));
      docs.sort((a, b) => b.nextReviewTime - a.nextReviewTime);
      
      const seenVocabs = new Set<string>();
      
      docs.forEach(p => {
        if (seenVocabs.has(p.vocabId)) return;
        seenVocabs.add(p.vocabId);
        pData[p.vocabId] = p;
        const v = allV.find(voc => voc.id === p.vocabId);
        if (v) {
          fetchedVocabs.push(v);
        }
      });
      
      // Sort by most overdue
      fetchedVocabs.sort((a, b) => pData[a.id].nextReviewTime - pData[b.id].nextReviewTime);
      fetchedVocabs.splice(20);
      
      setInitialVocabs(fetchedVocabs);
      setProgressData(pData);
      setQueue(fetchedVocabs);
      setSessionTotal(fetchedVocabs.length);
      setMasteredCount(0);
      setLoading(false);

    };
    fetchVocabs();
  }, [currentUser]);

  useEffect(() => {
    const saveState = async () => {
      if (!loading && initialVocabs.length > 0 && !isFinished && queue.length > 0) {
        await saveSessionState(currentUser?.uid, 'review_flashcard_state', {
          queue,
          initialVocabs,
          sessionTotal,
          masteredCount,
          notRememberedIds
        });
      } else if (isFinished || (sessionTotal === 0 && initialVocabs.length > 0)) {
        await removeSessionState(currentUser?.uid, 'review_flashcard_state');
      }
    };
    saveState();
  }, [queue, initialVocabs, sessionTotal, masteredCount, notRememberedIds, loading, isFinished]);

  const handleRating = async (isRemembered: boolean) => {
    if (queue.length === 0 || isProcessing) return;
    setIsProcessing(true);
    
    const currentCard = queue[0];
    
    if (currentUser) {
      const now = Date.now();
      let nextInterval = isRemembered ? 24 * 60 : 1; 
      let srsLevel: 'again' | 'hard' | 'good' | 'easy' | 'new' = isRemembered ? 'good' : 'again';
      
      const currentProg = progressData[currentCard.id];
      let reps = 1;
      
      if (currentProg) {
        reps = currentProg.reps + (isRemembered ? 1 : 0);
        if (isRemembered) {
          nextInterval = Math.max(24 * 60, currentProg.interval * 2.5); 
        } else {
          nextInterval = 1;
        }
      }
      
      const nextReviewTime = now + (nextInterval * 60 * 1000);
      const progressId = currentProg?.id && currentProg.id.includes('_') ? currentProg.id : `${currentUser.uid}_${currentCard.id}`;
      
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
        await setDoc(doc(db, 'user_progress', progressId), newProg, { merge: true });
      } catch (err) {
        console.error('Failed to update progress', err);
      }
    }

    setIsFlipped(false);
    
    setTimeout(() => {
      const card = queue[0];
      
      if (!isRemembered && card) {
        setNotRememberedIds(prev => {
          if (!prev.includes(card.id)) return [...prev, card.id];
          return prev;
        });
      } else {
        setMasteredCount(m => m + 1);
      }
      
      const newQueue = queue.slice(1);
      if (newQueue.length === 0) {
        setIsFinished(true);
      }
      
      setQueue(newQueue);
      setIsProcessing(false);
    }, 200);
  };

  const handleRemidi = () => {
    const remidiVocabs = initialVocabs.filter(v => notRememberedIds.includes(v.id));
    setQueue([...remidiVocabs]);
    setSessionTotal(remidiVocabs.length);
    setMasteredCount(0);
    setNotRememberedIds([]);
    setIsFinished(false);
  };

  const handleReset = () => {
    removeSessionState(currentUser?.uid, 'review_flashcard_state');
    setQueue([...initialVocabs]);
    setSessionTotal(initialVocabs.length);
    setMasteredCount(0);
    setNotRememberedIds([]);
    setIsFinished(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] text-slate-500">Memuat flashcard...</div>;
  }

  if (initialVocabs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] p-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Tidak ada kartu</h2>
        <button onClick={() => navigate(`/deck/${encodeURIComponent('Review')}`)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Kembali</button>
      </div>
    );
  }

  if (sessionTotal === 0 && initialVocabs.length > 0 && !isFinished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] p-4">
        <div className="text-center">
          <h2 className="text-3xl font-black text-[#1a1f36] mb-4">Hebat! 🎉</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-md">
            Kamu sudah mengingat semua kartu dalam kategori ini. Tidak ada kartu yang perlu diulang saat ini. Silakan kembali lagi nanti untuk mereview.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate(`/deck/${encodeURIComponent('Review')}`)} 
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
        <div className="flex flex-col gap-3 w-full max-w-sm">
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
          </button>
          <button 
            onClick={() => navigate(`/deck/${encodeURIComponent('Review')}`)}
            className="py-3 px-6 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors w-full"
          >
            Kembali ke Menu
          </button>
        </div>
      </motion.div>
    );
  }

  const currentCard = queue[0];
  const isKana = false;
  const remainingCount = queue.length;
  
  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans overflow-hidden">
      <header className="flex justify-between items-center p-6 relative max-w-5xl mx-auto w-full">
        <button 
          onClick={() => navigate(`/deck/${encodeURIComponent('Review')}`)}
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
              Belum Hafal: {notRememberedIds.length}
            </div>
            <div className="font-bold text-xl text-slate-700">
              {sessionTotal - remainingCount + 1 > sessionTotal ? sessionTotal : sessionTotal - remainingCount + 1} / {sessionTotal}
            </div>
            <div className="w-auto px-4 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg shadow-sm">
              Ingat: {masteredCount}
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl relative perspective-[1000px] my-auto flex items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard?.id || 'empty'}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full h-full flex items-center justify-center absolute"
            >
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full max-w-md h-[400px] cursor-pointer transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''} mx-auto hover:scale-[1.02] shadow-xl hover:shadow-2xl rounded-3xl`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-100 flex flex-col items-center justify-center p-8 [backface-visibility:hidden] shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <h2 className="text-6xl md:text-7xl font-black text-[#1a1f36] text-center mb-8">{currentCard?.jp}</h2>
                  <p className="text-slate-400 absolute bottom-8 font-medium text-sm">
                    ketuk untuk balik
                  </p>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-100 flex flex-col items-center justify-center p-8 [backface-visibility:hidden] shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
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
