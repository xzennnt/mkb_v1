import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, doc, setDoc, where, updateDoc } from 'firebase/firestore';
import { Vocabulary, StudyReport, UserProgress } from '../types';
import { generateOptions } from '../lib/srs';
import { Trophy, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { allVocabularies } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function WeakQuiz() {
  const navigate = useNavigate();
  const { category } = useParams();
  const { currentUser } = useAuth();
  
  const [sessionCards, setSessionCards] = useState<Vocabulary[]>([]);
  const [allVocabs, setAllVocabs] = useState<Vocabulary[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  
  const [directions, setDirections] = useState<('jp-to-id' | 'id-to-jp')[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  const [reports, setReports] = useState<StudyReport[]>([]);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchData = async () => {
      setLoading(true);
      let allV = allVocabularies;
      setAllVocabs(allV);
      
      const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid), where('isWeak', '==', true));
      const progSnap = await getDocs(progQ);
      
      let baseCards: Vocabulary[] = [];
      const docs = progSnap.docs.map(d => ({ ...d.data(), id: d.id } as UserProgress));
      
      docs.forEach(data => {
        if (category && data.category !== category && category !== 'Review') return;
        const v = allV.find(voc => voc.id === data.vocabId);
        if (v) baseCards.push(v);
      });
      
      // Limit to 20 for a session
      baseCards = baseCards.slice(0, 20);
      
      const shuffle = <T,>(array: T[]): T[] => array.slice().sort(() => 0.5 - Math.random());
      
      const phase1Cards = shuffle([...baseCards]);
      const phase1Dirs = phase1Cards.map(() => 'jp-to-id' as const);
      
      const phase2Cards = shuffle([...baseCards]);
      const phase2Dirs = phase2Cards.map(() => 'id-to-jp' as const);
      
      const finalCards = [...phase1Cards, ...phase2Cards];
      const finalDirs = [...phase1Dirs, ...phase2Dirs];
      
      setSessionCards(finalCards);
      setDirections(finalDirs);
      
      if (finalCards.length > 0) {
        setupCard(finalCards[0], allV, finalDirs[0]);
      } else {
        setIsFinished(true);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [currentUser, category]);

  const setupCard = (vocab: Vocabulary, allV: Vocabulary[], dir: 'jp-to-id' | 'id-to-jp') => {
    setStartTime(Date.now());
    setSelectedAnswer(null);
    setOptions(generateOptions(vocab, allV, dir));
  };

  const handleAnswer = async (answer: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    
    const currentVocab = sessionCards[currentIndex];
    const dir = directions[currentIndex];
    const correctAns = dir === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp;
    const isCorrect = answer === correctAns;
    
    setReports(prev => [...prev, {
      vocabId: currentVocab.id,
      jp: currentVocab.jp,
      id_translation: currentVocab.id_translation,
      timeSpentMs: Date.now() - startTime,
      status: isCorrect ? 'Hafal' : 'Belum hafal',
      isCorrect
    }]);

    setTimeout(() => {
      if (currentIndex + 1 < sessionCards.length) {
        setCurrentIndex(prev => prev + 1);
        setupCard(sessionCards[currentIndex + 1], allVocabs, directions[currentIndex + 1]);
      } else {
        finishSession();
      }
    }, 1500);
  };

  const finishSession = async () => {
    if (!currentUser) return;
    setIsFinished(true);
    
    setReports(currentReports => {
      // Check if they passed both directions
      const vocabSuccessMap: Record<string, { p1: boolean, p2: boolean }> = {};
      
      currentReports.forEach((r, idx) => {
        const dir = directions[idx];
        if (!vocabSuccessMap[r.vocabId]) vocabSuccessMap[r.vocabId] = { p1: false, p2: false };
        if (dir === 'jp-to-id') vocabSuccessMap[r.vocabId].p1 = r.isCorrect;
        else vocabSuccessMap[r.vocabId].p2 = r.isCorrect;
      });
      
      Object.keys(vocabSuccessMap).forEach(async (vId) => {
        const success = vocabSuccessMap[vId];
        if (success.p1 && success.p2) {
          // LULUS!
          const progressRef = doc(db, 'user_progress', `${currentUser.uid}_${vId}`);
          await updateDoc(progressRef, { isWeak: false }).catch(console.error);
        }
      });
      
      return currentReports;
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold tracking-widest uppercase animate-pulse">Memuat...</div>;
  }

  if (isFinished) {
    const successVocabs = new Set();
    reports.forEach((r, i) => {
      if (r.isCorrect && reports.some((r2, j) => j !== i && r2.vocabId === r.vocabId && r2.isCorrect)) {
        successVocabs.add(r.vocabId);
      }
    });

    return (
      <div className="max-w-2xl mx-auto p-4 py-8 w-full flex-1">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center mb-8 relative overflow-hidden">
          <Trophy size={64} className="mx-auto text-yellow-400 mb-6 drop-shadow-md" />
          <h2 className="text-3xl font-black text-slate-800 mb-4">Latihan Selesai!</h2>
          <p className="text-slate-500 mb-8 font-medium">Anda berhasil meluluskan {successVocabs.size} kosakata dari Bank Kotoba Lemah.</p>
          <button onClick={() => navigate(-1)} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md">Kembali</button>
        </div>
      </div>
    );
  }

  const currentVocab = sessionCards[currentIndex];
  const dir = directions[currentIndex];
  const progress = ((currentIndex) / sessionCards.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-4 py-8 w-full flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl shadow-sm border border-slate-200 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 mx-6">
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="font-bold text-slate-500">{currentIndex + 1} / {sessionCards.length}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col justify-center">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 mb-8 text-center flex-1 flex flex-col justify-center min-h-[300px]">
            <span className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-6 block">
              {dir === 'jp-to-id' ? 'Apa arti dari kata ini?' : 'Apa bahasa Jepangnya?'}
            </span>
            <h2 className="text-5xl font-black text-slate-800 mb-4 leading-tight">
              {dir === 'jp-to-id' ? currentVocab.jp : currentVocab.id_translation}
            </h2>
            {dir === 'jp-to-id' && currentVocab.romaji && (
              <p className="text-xl text-slate-400 font-medium">{currentVocab.romaji}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((opt, idx) => {
              const correctAns = dir === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp;
              let btnClass = 'bg-white border-slate-200 text-slate-700 hover:border-rose-400 hover:shadow-md';
              if (selectedAnswer !== null) {
                if (opt === correctAns) btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500 ring-opacity-50';
                else if (opt === selectedAnswer) btnClass = 'bg-rose-50 border-rose-500 text-rose-700';
                else btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  disabled={selectedAnswer !== null}
                  className={`p-6 rounded-xl font-bold text-lg text-left transition-all shadow-sm flex items-center justify-between border-2 ${btnClass}`}
                >
                  <span className="text-2xl font-medium flex-1">{opt}</span>
                  {selectedAnswer !== null && opt === correctAns && <CheckCircle className="text-emerald-500 ml-4" />}
                  {selectedAnswer === opt && opt !== correctAns && <XCircle className="text-rose-500 ml-4" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
