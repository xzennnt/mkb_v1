import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { Vocabulary, UserProgress } from '../types';
import { ArrowLeft } from 'lucide-react';
import { hiraganaData, katakanaData } from '../data/kana';
import { useAuth } from '../contexts/AuthContext';

export default function Flashcard() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
  const [progressData, setProgressData] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [difficultVocabs, setDifficultVocabs] = useState<Vocabulary[]>([]);

  useEffect(() => {
    const fetchVocabs = async () => {
      if (!category) return;
      
      let fetchedVocabs: Vocabulary[] = [];

      if (category === 'Hiragana') {
        fetchedVocabs = hiraganaData as any;
      } else if (category === 'Katakana') {
        fetchedVocabs = katakanaData as any;
      } else {
        const q = query(collection(db, 'vocabularies'), where('category', '==', category));
        const snap = await getDocs(q);
        const rawVocabs = snap.docs.map(d => ({ ...d.data(), id: d.id } as Vocabulary));
        
        // Remove duplicates based on 'jp' text
        const seen = new Set();
        fetchedVocabs = rawVocabs.filter(v => {
          if (seen.has(v.jp)) return false;
          seen.add(v.jp);
          return true;
        });
      }
      
      setVocabs(fetchedVocabs);

      if (currentUser) {
        // Fetch user progress for this category
        const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
        const progSnap = await getDocs(progQ);
        const pData: Record<string, UserProgress> = {};
        progSnap.docs.forEach(d => {
          const p = { ...d.data(), id: d.id } as UserProgress;
          pData[p.vocabId] = p;
        });
        setProgressData(pData);
      }

      setLoading(false);
    };

    fetchVocabs();
  }, [category, currentUser]);

  const handleRating = async (isRemembered: boolean) => {
    const currentCard = vocabs[currentIndex];

    if (currentUser) {
      const now = Date.now();
      let nextInterval = isRemembered ? 24 * 60 : 1; // 1 day vs 1 minute
      let srsLevel: 'again' | 'hard' | 'good' | 'easy' | 'new' = isRemembered ? 'good' : 'again';
      
      const currentProg = progressData[currentCard.id];
      let reps = 1;
      
      if (currentProg) {
        reps = currentProg.reps + 1;
        if (isRemembered) {
          nextInterval = currentProg.interval * 2.5; // simple multiplier for SRS
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

      // Optimistic UI update
      setProgressData(prev => ({ ...prev, [currentCard.id]: newProg }));
      
      // Save to Firestore
      try {
        await setDoc(doc(db, 'user_progress', progressId), newProg);
      } catch (err) {
        console.error('Failed to update progress', err);
      }
    }

    // Track difficult vocabs for the end screen
    if (!isRemembered) {
      setDifficultVocabs(prev => {
        if (!prev.find(v => v.id === currentCard.id)) {
          return [...prev, currentCard];
        }
        return prev;
      });
    }

    // Move to next card
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < vocabs.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 150);
  };

  const handleRetryDifficult = () => {
    setVocabs(difficultVocabs);
    setDifficultVocabs([]);
    setCurrentIndex(0);
    setIsFinished(false);
    setIsFlipped(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] text-slate-500">Memuat flashcard...</div>;
  }

  if (vocabs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] p-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Tidak ada kartu</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Kembali</button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-black text-[#1a1f36] mb-6">Selesai! 🎉</h2>
        <p className="text-lg text-slate-600 mb-8 text-center max-w-md">
          Kamu telah menyelesaikan semua kartu.
          {difficultVocabs.length > 0 && ` Ada ${difficultVocabs.length} kosakata yang masih perlu dilatih.`}
        </p>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          {difficultVocabs.length > 0 && (
            <button 
              onClick={handleRetryDifficult}
              className="py-3 px-6 bg-orange-100 text-orange-700 font-bold rounded-xl hover:bg-orange-200 transition-colors w-full"
            >
              Ulangi Kosakata Susah ({difficultVocabs.length})
            </button>
          )}
          <button 
            onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)}
            className="py-3 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors w-full"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  const currentCard = vocabs[currentIndex];
  const isKana = category === 'Hiragana' || category === 'Katakana';
  
  // Calculate mastered and difficult counts for the header
  const masteredCount = vocabs.filter(v => progressData[v.id]?.srsLevel === 'good' || progressData[v.id]?.srsLevel === 'easy').length;
  const difficultCount = vocabs.filter(v => progressData[v.id]?.srsLevel === 'again' || progressData[v.id]?.srsLevel === 'hard').length;

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-6 relative max-w-5xl mx-auto w-full">
        <button 
          onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)} 
          className="flex items-center gap-2 font-bold text-lg text-indigo-600 hover:text-indigo-800 transition-colors z-10"
        >
          <ArrowLeft size={20} /> Kembali
        </button>
        <h1 className="absolute inset-0 flex items-center justify-center text-xl font-bold pointer-events-none text-slate-800">
          Belajar
        </h1>
        <div className="w-24"></div> {/* Spacer to balance header */}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col items-center">
        
        {/* Progress & Tools */}
        <div className="w-full max-w-xl mb-6">
          <div className="flex justify-between items-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
              {difficultCount > 0 ? difficultCount : ''}
            </div>
            <div className="font-bold text-xl text-slate-700">
              {currentIndex + 1} / {vocabs.length}
            </div>
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg">
              {masteredCount}
            </div>
          </div>
        </div>

        {/* Flashcard Area */}
        <div className="w-full max-w-xl flex-1 flex flex-col relative perspective-[1000px] mt-4 mb-8">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`relative w-full aspect-[4/3] max-h-[400px] cursor-pointer transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-x-180' : ''}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center p-8 backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <h2 className="text-6xl md:text-7xl font-black text-[#1a1f36] text-center mb-8">{currentCard.jp}</h2>
              <p className="text-slate-400 absolute bottom-8 font-medium text-sm">
                ketuk untuk balik
              </p>
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center p-8 backface-hidden"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-[#1a1f36] text-center mb-4">{currentCard.id_translation}</h2>
              {!isKana && <p className="text-slate-500 text-xl font-medium">{currentCard.romaji || ''}</p>}
            </div>
          </div>
        </div>

        {/* Rating Controls */}
        <div className="w-full max-w-xl grid grid-cols-2 gap-4 transition-opacity duration-300 opacity-100 pointer-events-auto">
          <button 
            onClick={() => handleRating(false)}
            className="py-4 bg-[#fff6f0] border border-orange-200 text-orange-600 font-bold text-lg rounded-2xl hover:bg-orange-50 transition-colors"
          >
            X Belum
          </button>
          <button 
            onClick={() => handleRating(true)}
            className="py-4 bg-[#f0fdf4] border border-green-200 text-green-700 font-bold text-lg rounded-2xl hover:bg-green-50 transition-colors"
          >
            Ingat ✓
          </button>
        </div>

      </div>
    </div>
  );
}
