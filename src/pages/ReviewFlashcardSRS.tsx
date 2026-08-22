import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { Vocabulary, UserProgress } from '../types';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { allVocabularies, formatCategoryName } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function ReviewFlashcardSRS() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [queue, setQueue] = useState<Vocabulary[]>([]);
  const [progressData, setProgressData] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchVocabs = async () => {
      if (!currentUser || !category) return;
      setLoading(true);

      const progRef = collection(db, 'user_progress');
      const q = query(
        progRef, 
        where('userId', '==', currentUser.uid),
        where('category', '==', category),
        where('failCount', '>', 1)
      );
      
      try {
        const querySnapshot = await getDocs(q);
        const progresses: Record<string, UserProgress> = {};
        const hardVocabIds: string[] = [];
        
        const now = Date.now();

        querySnapshot.forEach(docSnap => {
          const prog = docSnap.data() as UserProgress;
          progresses[prog.vocabId] = prog;
          // Only include if due for review
          if (now >= prog.nextReviewTime) {
            hardVocabIds.push(prog.vocabId);
          }
        });
        
        setProgressData(progresses);
        
        // Find vocabs from allVocabularies
        const allVocabs = allVocabularies;
        const vocabsToReview = allVocabs.filter(v => hardVocabIds.includes(v.id));
        
        // Shuffle
        setQueue(vocabsToReview.sort(() => Math.random() - 0.5));
      } catch (err) {
        console.error("Error fetching SRS progress:", err);
      }
      
      setLoading(false);
    };

    fetchVocabs();
  }, [category, currentUser]);

  const handleRating = async (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (queue.length === 0) return;
    
    const currentCard = queue[0];
    
    if (currentUser) {
      const now = Date.now();
      const currentProg = progressData[currentCard.id];
      
      let nextInterval = 1;
      let easyCount = currentProg?.easyCount || 0;
      
      if (rating === 'again') {
        nextInterval = 1;
        easyCount = 0;
      } else if (rating === 'hard') {
        nextInterval = 10;
        easyCount = 0;
      } else if (rating === 'good') {
        nextInterval = 24 * 60; // 1 day
        easyCount = 0;
      } else if (rating === 'easy') {
        if (easyCount >= 1 && currentProg?.interval) {
          // Multiply previous interval
          nextInterval = Math.round(currentProg.interval * 2.5);
        } else {
          nextInterval = 2 * 24 * 60; // 2 days
        }
        easyCount++;
      }
      
      const nextReviewTime = now + (nextInterval * 60 * 1000);
      const progressId = currentProg?.id || doc(collection(db, 'user_progress')).id;
      
      // We reduce failCount slightly on easy/good so it eventually drops out of "hard" if they actually learn it?
      // Wait, user says "jika user sudah memencet tombol mudah 2x maka kalikan sesuai SRS algoritma". 
      // User didn't specify when it drops out. Let's just keep failCount as is for now, 
      // or if easyCount >= 2 we could reset failCount to 0 so it disappears from this hard list.
      let newFailCount = currentProg?.failCount || 2;
      if (easyCount >= 2) {
         newFailCount = 0; // Graduated from Hard list!
      }

      const newProg: UserProgress = {
        id: progressId,
        userId: currentUser.uid,
        vocabId: currentCard.id,
        category: category || currentCard.category,
        interval: nextInterval,
        nextReviewTime,
        reps: (currentProg?.reps || 0) + 1,
        srsLevel: rating,
        failCount: newFailCount,
        easyCount: easyCount
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
        const card = newQueue.shift();
        
        if (rating === 'again' || rating === 'hard') {
           // Put back at the end of queue if they didn't get it right
           if (card) newQueue.push(card);
        }
        
        if (newQueue.length === 0) {
          setIsFinished(true);
        }
        return newQueue;
      });
    }, 150);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] text-slate-500">Memuat SRS Flashcard...</div>;
  }

  if (isFinished || queue.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] p-4">
        <div className="text-center">
          <h2 className="text-3xl font-black text-[#1a1f36] mb-4">Selesai! 🎉</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-md">
            Anda telah menyelesaikan semua kosakata sulit di bab ini untuk saat ini.
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentCard = queue[0];

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans overflow-hidden">
      <header className="flex justify-between items-center p-6 relative max-w-5xl mx-auto w-full">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold text-lg text-indigo-600 hover:text-indigo-800 transition-colors z-10"
        >
          <ArrowLeft size={24} />
          Kembali
        </button>
        <h1 className="absolute inset-0 flex items-center justify-center text-xl font-bold pointer-events-none text-slate-800">
          SRS: {formatCategoryName(category || '')}
        </h1>
        <div className="w-24"></div>
      </header>
      
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col items-center">
        <div className="w-full max-w-xl mb-6">
          <div className="flex justify-between items-center">
            <div className="w-auto px-4 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg shadow-sm">
              Sisa: {queue.length}
            </div>
            <div className="w-auto px-4 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg shadow-sm">
              Flashcard Sulit
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
                className={`relative w-full max-w-md h-[400px] cursor-pointer transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-x-180' : ''} mx-auto hover:scale-[1.02] shadow-xl hover:shadow-2xl rounded-3xl`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Depan */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-100 flex flex-col items-center justify-center p-8 backface-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                >
                  <h2 className="text-6xl md:text-7xl font-black text-[#1a1f36] text-center mb-8">{currentCard?.jp}</h2>
                  <p className="text-slate-400 font-bold tracking-widest uppercase text-sm mt-auto">Klik untuk membalik</p>
                </div>
                
                {/* Belakang */}
                <div 
                  className="absolute inset-0 bg-[#003399] rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden rotate-x-180 text-white"
                >
                  {currentCard?.romaji && (
                    <p className="text-blue-200 text-2xl font-medium mb-4 text-center">{currentCard.romaji}</p>
                  )}
                  <h3 className="text-4xl md:text-5xl font-black text-center leading-tight mb-8">
                    {currentCard?.id_translation}
                  </h3>
                  <p className="text-blue-300 font-bold tracking-widest uppercase text-sm mt-auto">Pilih level hafalan</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Buttons SRS */}
        {isFlipped ? (
          <div className="w-full max-w-xl grid grid-cols-4 gap-2 mt-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); handleRating('again'); }}
              className="py-3 bg-rose-100 border-2 border-rose-200 text-rose-700 font-bold text-sm md:text-base rounded-2xl hover:bg-rose-200 transition-colors shadow-sm flex flex-col items-center"
            >
              <span>Lagi</span>
              <span className="text-xs text-rose-500 font-medium">1 mnt</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleRating('hard'); }}
              className="py-3 bg-orange-100 border-2 border-orange-200 text-orange-700 font-bold text-sm md:text-base rounded-2xl hover:bg-orange-200 transition-colors shadow-sm flex flex-col items-center"
            >
              <span>Susah</span>
              <span className="text-xs text-orange-500 font-medium">10 mnt</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleRating('good'); }}
              className="py-3 bg-blue-100 border-2 border-blue-200 text-blue-700 font-bold text-sm md:text-base rounded-2xl hover:bg-blue-200 transition-colors shadow-sm flex flex-col items-center"
            >
              <span>Baik</span>
              <span className="text-xs text-blue-500 font-medium">1 hr</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleRating('easy'); }}
              className="py-3 bg-emerald-100 border-2 border-emerald-200 text-emerald-700 font-bold text-sm md:text-base rounded-2xl hover:bg-emerald-200 transition-colors shadow-sm flex flex-col items-center"
            >
              <span>Mudah</span>
              <span className="text-xs text-emerald-500 font-medium">2 hr+</span>
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xl mt-auto py-3 md:py-6 h-[88px] flex justify-center text-slate-400 font-medium">
            (Pikirkan artinya, lalu klik kartu untuk mengecek)
          </div>
        )}
      </div>
    </div>
  );
}
