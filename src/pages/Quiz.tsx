import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, doc, setDoc, where, updateDoc, increment } from 'firebase/firestore';
import { Vocabulary, StudyReport } from '../types';
import { generateOptions } from '../lib/srs';
import { Trophy, CheckCircle, XCircle } from 'lucide-react';
import { hiraganaData, katakanaData } from '../data/kana';

export default function Quiz() {
  const { category, sessionIndex } = useParams<{ category: string, sessionIndex: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [sessionCards, setSessionCards] = useState<Vocabulary[]>([]);
  const [allVocabs, setAllVocabs] = useState<Vocabulary[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  
  // Array of directions for each question
  const [directions, setDirections] = useState<('jp-to-id' | 'id-to-jp')[]>([]);

  // Timer State
  const [startTime, setStartTime] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  
  // Reporting
  const [reports, setReports] = useState<StudyReport[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || !category || !sessionIndex) return;
    
    const fetchData = async () => {
      setLoading(true);
      
      let allV: Vocabulary[] = [];
      let catV: Vocabulary[] = [];

      if (category === 'Hiragana' || category === 'Katakana') {
        catV = (category === 'Hiragana' ? hiraganaData : katakanaData) as any;
        allV = catV;
        setAllVocabs(allV);
      } else {
        const qAll = query(collection(db, 'vocabularies'));
        const snapAll = await getDocs(qAll);
        allV = snapAll.docs.map(d => ({ ...d.data(), id: d.id } as Vocabulary));
        setAllVocabs(allV);
        
        const qCat = query(collection(db, 'vocabularies'), where('category', '==', category));
        const snapCat = await getDocs(qCat);
        const rawCatV = snapCat.docs.map(d => ({ ...d.data(), id: d.id } as Vocabulary));
        
        // Remove duplicates
        const seen = new Set();
        catV = rawCatV.filter(v => {
          if (seen.has(v.jp)) return false;
          seen.add(v.jp);
          return true;
        });
      }

      // Fetch user progress to sort by difficulty
      if (currentUser && catV.length > 0) {
        const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
        const progSnap = await getDocs(progQ);
        const pMap: Record<string, any> = {};
        progSnap.docs.forEach(d => {
          pMap[d.data().vocabId] = d.data();
        });

        // Sort by difficulty: again/hard first, then new/no progress, then good/easy
        catV.sort((a, b) => {
          const pa = pMap[a.id];
          const pb = pMap[b.id];
          
          const getScore = (p: any) => {
            if (!p) return 1; // New / No progress
            if (p.srsLevel === 'again') return 3;
            if (p.srsLevel === 'hard') return 2;
            if (p.srsLevel === 'good') return 0;
            if (p.srsLevel === 'easy') return -1;
            return 1;
          };

          return getScore(pb) - getScore(pa);
        });
      }

      // Slice for this session
      const sIdx = parseInt(sessionIndex, 10);
      const baseCards = catV.slice(sIdx * 10, (sIdx + 1) * 10);
      
      const shuffle = <T,>(array: T[]): T[] => array.slice().sort(() => 0.5 - Math.random());

      // Phase 1: JP to ID (10 items shuffled)
      const phase1Cards = shuffle(baseCards);
      const phase1Dirs = phase1Cards.map(() => 'jp-to-id' as const);

      // Phase 2: ID to JP (10 items shuffled)
      const phase2Cards = shuffle(baseCards);
      const phase2Dirs = phase2Cards.map(() => 'id-to-jp' as const);

      const combinedCards = [...phase1Cards, ...phase2Cards];
      const combinedDirs = [...phase1Dirs, ...phase2Dirs];
      
      setSessionCards(combinedCards);
      setDirections(combinedDirs);
      
      if (combinedCards.length > 0) {
        setupCard(combinedCards[0], allV, combinedDirs[0]);
        setSessionStartTime(Date.now());
      }
      setLoading(false);
    };
    
    fetchData();
  }, [currentUser, category, sessionIndex]);

  const setupCard = (vocab: Vocabulary, allV: Vocabulary[], dir: 'jp-to-id' | 'id-to-jp') => {
    setStartTime(Date.now());
    setSelectedAnswer(null);
    setOptions(generateOptions(vocab, allV, dir));
  };

  const handleAnswer = async (answer: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    
    const timeSpentMs = Date.now() - startTime;
    const currentVocab = sessionCards[currentIndex];
    const dir = directions[currentIndex];
    const correctAns = dir === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp;
    const isCorrect = answer === correctAns;

    let status: 'Hafal' | 'Belum otomatis' | 'Belum hafal' = 'Belum hafal';
    if (isCorrect) {
      status = timeSpentMs <= 5000 ? 'Hafal' : 'Belum otomatis';
    }

    const report: StudyReport = {
      vocabId: currentVocab.id,
      jp: currentVocab.jp,
      id_translation: currentVocab.id_translation,
      timeSpentMs,
      status,
      isCorrect
    };

    setReports(prev => [...prev, report]);

    // Update user stats
    const userRef = doc(db, 'users', currentUser.uid);
    const timeSpentSec = timeSpentMs / 1000;
    const pointsGained = isCorrect ? 10 : 0;
    const newlyMastered = (isCorrect && timeSpentMs <= 5000) ? 1 : 0;
    
    updateDoc(userRef, {
      points: increment(pointsGained),
      masteredVocabCount: increment(newlyMastered),
      totalStudyTime: increment(Math.floor(timeSpentSec))
    }).catch(console.error);

    // Update vocab difficult stats
    const vocabRef = doc(db, 'vocabularies', currentVocab.id);
    if (!isCorrect) {
      updateDoc(vocabRef, { failCount: increment(1) }).catch(console.error);
    } else if (timeSpentSec > 10) {
      updateDoc(vocabRef, { hardCount: increment(1) }).catch(console.error);
    }

    // Wait a bit before next card
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
    setTotalTime(Date.now() - sessionStartTime);
    
    setReports(currentReports => {
      const sessionEndTime = Date.now();
      const durationSec = Math.floor((sessionEndTime - sessionStartTime) / 1000);
      const correctCount = currentReports.filter(r => r.isCorrect).length;
      const incorrectCount = currentReports.length - correctCount;
      const sessionId = doc(collection(db, 'study_sessions')).id;
      
      setDoc(doc(db, 'study_sessions', sessionId), {
        id: sessionId,
        userId: currentUser.uid,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        totalDuration: durationSec,
        cardsReviewed: sessionCards.length,
        correctCount,
        incorrectCount,
        type: 'makanan_bergizi'
      }).catch(console.error);
      
      return currentReports;
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Menyiapkan Makanan Bergizi...</div>;
  }

  if (sessionCards.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-white rounded-2xl shadow-md border border-slate-200 text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-4">Sesi Selesai</h2>
        <p className="text-slate-500 mb-6">Tidak ada kosakata lagi di sesi ini.</p>
        <button onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">
          Kembali
        </button>
      </div>
    );
  }

  if (isFinished) {
    const correctCount = reports.filter(r => r.isCorrect).length;
    return (
      <div className="max-w-3xl mx-auto p-4 py-8 w-full">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 text-center mb-8">
          <Trophy size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-4xl font-black mb-2 text-slate-800">Sesi Latihan Selesai!</h2>
          <p className="text-slate-500 font-medium mb-2">Anda menjawab {correctCount} dari {sessionCards.length} dengan benar.</p>
          <p className="text-indigo-600 font-bold mb-6 flex items-center justify-center gap-2">
            ⏱️ Total Waktu: {(totalTime / 1000).toFixed(1)} detik
          </p>
          <button onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)} className="mt-4 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md">
            Kembali ke Daftar Menu
          </button>
        </div>
        
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Laporan Gizi (Hasil)</h3>
        <div className="space-y-3">
          {reports.map((report, idx) => (
            <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${report.isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              <div>
                <p className={`font-bold text-lg ${report.isCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>{report.jp}</p>
                <p className={report.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{report.id_translation}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-1 ${
                  report.status === 'Hafal' ? 'bg-emerald-200 text-emerald-800' : 
                  report.status === 'Belum otomatis' ? 'bg-amber-200 text-amber-800' : 
                  'bg-rose-200 text-rose-800'
                }`}>
                  {report.status}
                </span>
                <span className={`text-xs font-mono font-bold ${report.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(report.timeSpentMs / 1000).toFixed(1)}s
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentVocab = sessionCards[currentIndex];
  const dir = directions[currentIndex];
  const questionText = dir === 'jp-to-id' ? currentVocab.jp : currentVocab.id_translation;

  const isKana = category === 'Hiragana' || category === 'Katakana';
  const promptText = dir === 'jp-to-id' 
    ? (isKana ? 'Huruf Jepang → Romaji' : 'Japanese → Indonesian') 
    : (isKana ? 'Romaji → Huruf Jepang' : 'Indonesian → Japanese');

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 min-h-screen flex flex-col w-full">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <span className="font-bold">MKB</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-800">
            Latihan {currentIndex + 1} / {sessionCards.length}
          </h1>
        </div>
        <button onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)} className="text-sm font-bold text-slate-500 hover:text-indigo-600">
          KELUAR
        </button>
      </header>
      
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 flex-1 flex flex-col items-center justify-center relative">
        <div className="text-center mb-12 flex-1 flex flex-col justify-center mt-12">
          <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-4">
            {promptText}
          </p>
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-slate-800 leading-tight">
            {questionText}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-auto">
          {options.map((opt, idx) => {
            let btnClass = "bg-white border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 group";
            
            if (selectedAnswer !== null) {
              const correctAns = dir === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp;
              if (opt === correctAns) {
                btnClass = "bg-emerald-50 border-2 border-emerald-500 text-emerald-900";
              } else if (opt === selectedAnswer) {
                btnClass = "bg-rose-50 border-2 border-rose-500 text-rose-900";
              } else {
                btnClass = "bg-white border-2 border-slate-100 text-slate-300 opacity-50";
              }
            }
            
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                disabled={selectedAnswer !== null}
                className={`p-6 rounded-xl font-bold text-lg text-left transition-all shadow-sm flex items-center justify-between ${btnClass}`}
              >
                <span className={`text-xl font-bold mr-4 ${selectedAnswer !== null ? '' : 'group-hover:text-indigo-700'} text-slate-400 transition-colors`}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="text-2xl font-medium flex-1">
                  {opt}
                </span>
                {selectedAnswer !== null && opt === (dir === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp) && (
                  <CheckCircle className="text-emerald-500 ml-4" />
                )}
                {selectedAnswer === opt && opt !== (dir === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp) && (
                  <XCircle className="text-rose-500 ml-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
