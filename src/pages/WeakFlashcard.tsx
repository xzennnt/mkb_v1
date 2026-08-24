import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { Vocabulary, UserProgress } from '../types';
import { Trophy, ArrowLeft, RefreshCw, XCircle, CheckCircle } from 'lucide-react';
import { allVocabularies } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function WeakFlashcard() {
  const navigate = useNavigate();
  const { category } = useParams();
  const { currentUser } = useAuth();
  
  const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [successVocabs, setSuccessVocabs] = useState<Set<string>>(new Set());
  const [sessionStartTime] = useState(Date.now());
  const [failedList, setFailedList] = useState<{jp: string, id_translation: string}[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchData = async () => {
      setLoading(true);
      const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid), where('isWeak', '==', true));
      const progSnap = await getDocs(progQ);
      
      let baseCards: Vocabulary[] = [];
      const docs = progSnap.docs.map(d => ({ ...d.data(), id: d.id } as UserProgress));
      
      docs.forEach(data => {
        if (data.weakFlashcard === false) return;
        let pCat = data.category;
        const v = allVocabularies.find(voc => voc.id === data.vocabId);
        if (!pCat && v) pCat = v.category;
        
        if (category && pCat !== category && category !== 'Review') return;
        if (v) baseCards.push(v);
      });
      
      setVocabs(baseCards.slice(0, 30));
      setLoading(false);
    };
    
    fetchData();
  }, [currentUser, category]);

  const handleNext = async (correct: boolean) => {
    if (correct) {
      const vId = vocabs[currentIndex].id;
      setSuccessVocabs(prev => new Set(prev).add(vId));
      
      const progressRef = doc(db, 'user_progress', `${currentUser?.uid}_${vId}`);
      try {
        const progSnap = await getDoc(progressRef);
        if (progSnap.exists()) {
          const pData = progSnap.data();
          if (pData.weakQuiz === false) {
             await updateDoc(progressRef, { isWeak: false, weakFlashcard: false });
          } else {
             await updateDoc(progressRef, { weakFlashcard: false });
          }
        }
      } catch(e) { console.error(e); }
    }
    
    if (!correct) {
      setFailedList(prev => [...prev, { jp: vocabs[currentIndex].jp, id_translation: vocabs[currentIndex].id_translation }]);
    }
    
    if (currentIndex + 1 < vocabs.length) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      const sessionEndTime = Date.now();
      const durationSec = Math.floor((sessionEndTime - sessionStartTime) / 1000);
      const sessionId = doc(collection(db, 'study_sessions')).id;
      // We pass doc from firebase/firestore which is already imported.
      // Wait, let's use setDoc
      setDoc(doc(db, 'study_sessions', sessionId), {
        id: sessionId,
        userId: currentUser?.uid,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        totalDuration: durationSec,
        cardsReviewed: vocabs.length,
        correctCount: successVocabs.size + (correct ? 1 : 0),
        incorrectCount: vocabs.length - (successVocabs.size + (correct ? 1 : 0)),
        type: 'Flashcard Remidial',
        category: category || 'Remidial',
        failedVocabs: correct ? failedList : [...failedList, { jp: vocabs[currentIndex].jp, id_translation: vocabs[currentIndex].id_translation }]
      }).catch(console.error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold tracking-widest uppercase animate-pulse">Memuat...</div>;

  if (isFinished || vocabs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-8 w-full flex-1">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center mb-8 relative overflow-hidden">
          <Trophy size={64} className="mx-auto text-emerald-400 mb-6 drop-shadow-md" />
          <h2 className="text-3xl font-black text-slate-800 mb-4">{vocabs.length === 0 ? 'Tidak ada Kotoba Lemah!' : 'Selesai!'}</h2>
          <button onClick={() => navigate(-1)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md">Kembali</button>
        </div>
      </div>
    );
  }

  const v = vocabs[currentIndex];

  return (
    <div className="max-w-2xl mx-auto p-4 py-8 w-full flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl shadow-sm border border-slate-200 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <span className="font-bold text-slate-500">{currentIndex + 1} / {vocabs.length}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center relative perspective-1000">
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div key="front" initial={{ opacity: 0, rotateY: -90 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 90 }} transition={{ duration: 0.2 }}
              className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200 cursor-pointer min-h-[400px] flex flex-col items-center justify-center"
              onClick={() => setIsFlipped(true)}
            >
              <h2 className="text-6xl font-black text-slate-800 mb-6 text-center">{v.jp}</h2>
              <div className="flex items-center justify-center gap-2 text-slate-400 font-medium mt-8">
                <RefreshCw size={18} /> Klik untuk melihat arti
              </div>
            </motion.div>
          ) : (
            <motion.div key="back" initial={{ opacity: 0, rotateY: -90 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 90 }} transition={{ duration: 0.2 }}
              className="bg-slate-800 p-12 rounded-3xl shadow-xl border border-slate-700 min-h-[400px] flex flex-col"
            >
              <div className="flex-1 flex flex-col items-center justify-center">
                <h2 className="text-4xl font-black text-white mb-4 text-center">{v.id_translation}</h2>
                <p className="text-2xl text-slate-300 font-medium mb-8">{v.romaji}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button onClick={() => handleNext(false)} className="bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  <XCircle size={20} /> Lupa
                </button>
                <button onClick={() => handleNext(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  <CheckCircle size={20} /> Hafal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
