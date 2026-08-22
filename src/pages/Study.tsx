import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { calculatePoints } from '../utils/levelUtils';
import { collection, query, getDocs, doc, setDoc, where, updateDoc, increment } from 'firebase/firestore';
import { Vocabulary, UserProgress, StudyReport } from '../types';
import { calculateNextReview, generateOptions } from '../lib/srs';
import { useNavigate } from 'react-router-dom';
import { Zap, Clock, CheckCircle, XCircle, ArrowRight, Trophy } from 'lucide-react';

import { allVocabularies } from '../data';

export default function Study() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  // Data
  const [allVocabs, setAllVocabs] = useState<Vocabulary[]>([]);
  const [sessionCards, setSessionCards] = useState<Vocabulary[]>([]);
  const [userProgressMap, setUserProgressMap] = useState<Record<string, UserProgress>>({});
  
  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [direction, setDirection] = useState<'jp-to-id' | 'id-to-jp'>('jp-to-id');
  
  // Timer State
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0); // in ms
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // Reporting
  const [reports, setReports] = useState<StudyReport[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      
      // 1. Local static vocabs
      const vocabs = allVocabularies;
      
      if (vocabs.length === 0) {
        setLoading(false);
        return; // No vocabs available
      }
      setAllVocabs(vocabs);

      // 2. Fetch user progress
      const q = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
      const progSnap = await getDocs(q);
      const progMap: Record<string, UserProgress> = {};
      progSnap.docs.forEach(d => {
        const data = { ...d.data(), id: d.id } as UserProgress;
        progMap[data.vocabId] = data;
      });
      setUserProgressMap(progMap);

      // 3. Select cards for this session
      // Combine due cards and some new cards
      const now = Date.now();
      const dueCards = vocabs.filter(v => progMap[v.id] && progMap[v.id].nextReviewTime <= now);
      const newCards = vocabs.filter(v => !progMap[v.id]).slice(0, 10); // Take 10 new cards max

      const combined = [...dueCards, ...newCards].sort(() => 0.5 - Math.random());
      const selected = combined.slice(0, 20); // max 20 cards per session
      
      setSessionCards(selected);
      setSessionStartTime(Date.now());
      setLoading(false);
      
      if (selected.length > 0) {
        setupCard(selected[0], vocabs);
      } else {
        setIsFinished(true); // Nothing to study
      }
    };

    fetchData();
  }, [currentUser]);

  const setupCard = (vocab: Vocabulary, allV: Vocabulary[]) => {
    const dir = Math.random() > 0.5 ? 'jp-to-id' : 'id-to-jp';
    setDirection(dir);
    setOptions(generateOptions(vocab, allV, dir));
    setSelectedAnswer(null);
    setIsCorrect(null);
    setElapsedTime(0);
    setStartTime(Date.now());

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);
  };

  const handleAnswer = async (answer: string) => {
    if (selectedAnswer !== null || !currentUser || !userData) return; // Prevent double click
    
    if (timerRef.current) clearInterval(timerRef.current);
    const endTime = Date.now();
    const timeSpentMs = endTime - startTime;
    const timeSpentSec = timeSpentMs / 1000;
    
    const vocab = sessionCards[currentIndex];
    const correctAns = direction === 'jp-to-id' ? vocab.id_translation : vocab.jp;
    const correct = answer === correctAns;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    // Calculate SRS Next Review
    const currentProg = userProgressMap[vocab.id];
    const currentInterval = currentProg?.interval || 0;
    const reps = currentProg?.reps || 0;

    const { nextInterval, nextReviewTime, srsLevel } = calculateNextReview(timeSpentSec, correct, currentInterval);

    // Update Progress
    const progressId = currentProg?.id || doc(collection(db, 'user_progress')).id;
    const newProg: UserProgress = {
      id: progressId,
      userId: currentUser.uid,
      vocabId: vocab.id,
      interval: nextInterval,
      nextReviewTime,
      reps: reps + 1,
      srsLevel
    };

    await setDoc(doc(db, 'user_progress', progressId), newProg);
    
    // Update Map
    setUserProgressMap(prev => ({ ...prev, [vocab.id]: newProg }));

    // Status mapping
    let status: StudyReport['status'] = 'Belum hafal';
    if (correct) {
      if (timeSpentSec < 8) status = 'Hafal';
      else if (timeSpentSec <= 15) status = 'Belum otomatis';
    }

    // Add Report
    setReports(prev => [...prev, {
      vocabId: vocab.id,
      jp: vocab.jp,
      id_translation: vocab.id_translation,
      timeSpentMs,
      status,
      isCorrect: correct
    }]);

    // Update User Stats (Points, time, mastered)
    const basePoints = correct ? (timeSpentSec < 8 ? 10 : timeSpentSec <= 15 ? 5 : 2) : 0;
    const streak = userData.loginStreak || 1;
    const multiplier = 1 + (streak - 1) * 0.05;
    const pointsGained = Math.round(basePoints * multiplier);
    
    let newlyMastered = 0;
    
    if (srsLevel === 'easy' && currentProg?.srsLevel !== 'easy') newlyMastered = 1;
    if (srsLevel !== 'easy' && currentProg?.srsLevel === 'easy') newlyMastered = -1; // Lost mastery

    const userRef = doc(db, 'users', currentUser.uid);
    
    const updates: any[] = [
      updateDoc(userRef, {
        points: increment(pointsGained),
        masteredVocabCount: increment(newlyMastered),
        totalStudyTime: increment(Math.ceil(timeSpentSec)) // basic increment, full session time saved at end
      })
    ];

    const vocabStatsRef = doc(db, 'vocabStats', vocab.id);
    if (!correct) {
      updates.push(setDoc(vocabStatsRef, { failCount: increment(1) }, { merge: true }));
    } else if (timeSpentSec > 10) {
      updates.push(setDoc(vocabStatsRef, { hardCount: increment(1) }, { merge: true }));
    }

    await Promise.all(updates).catch(console.error);

    // Wait a bit before next card
    setTimeout(() => {
      if (currentIndex + 1 < sessionCards.length) {
        setCurrentIndex(prev => prev + 1);
        setupCard(sessionCards[currentIndex + 1], allVocabs);
      } else {
        finishSession();
      }
    }, 1500);
  };

  const finishSession = async () => {
    if (!currentUser) return;
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Use functional state to get the latest reports to avoid stale closure
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
        incorrectCount
      }).catch(console.error);
      
      return currentReports;
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Menyiapkan kartu...</div>;
  }

  if (sessionCards.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-white rounded-2xl shadow-md border border-slate-200 text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-4">Tidak ada kartu</h2>
        <p className="text-slate-500 mb-6">Anda sudah menyelesaikan semua review. Kembalilah nanti atau tambahkan kosakata baru.</p>
        <button onClick={() => navigate('/')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-sm">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  if (isFinished) {
    const correctCount = reports.filter(r => r.isCorrect).length;
    return (
      <div className="max-w-3xl mx-auto p-4 py-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 text-center mb-8">
          <Trophy size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-4xl font-black mb-2 text-slate-800">Sesi Selesai!</h2>
          <p className="text-slate-500 font-medium">Anda menjawab {correctCount} dari {sessionCards.length} dengan benar.</p>
          <button onClick={() => navigate('/')} className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md">
            Kembali ke Dashboard
          </button>
        </div>

        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Laporan Sesi Ini</h3>
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
  const questionText = direction === 'jp-to-id' ? currentVocab.jp : currentVocab.id_translation;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 min-h-screen flex flex-col w-full">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <span className="font-bold">MKB</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-800">
            Kartu {currentIndex + 1} / {sessionCards.length}
          </h1>
        </div>
        <button onClick={() => navigate('/')} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
          KELUAR
        </button>
      </header>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 flex-1 flex flex-col items-center justify-center relative">
        <div className="absolute top-6 right-8 flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
          <span className="text-amber-500">⚡</span>
          <span className="text-sm font-mono font-bold text-emerald-700">
            {((elapsedTime || (Date.now() - startTime)) / 1000).toFixed(1)}s
          </span>
        </div>

        <div className="text-center mb-12 flex-1 flex flex-col justify-center mt-12">
          <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-4">
            {direction === 'jp-to-id' ? 'Japanese → Indonesian' : 'Indonesian → Japanese'}
          </p>
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-slate-800 leading-tight">
            {questionText}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-auto">
          {options.map((opt, idx) => {
            let btnClass = "bg-white border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 group";
            
            if (selectedAnswer !== null) {
              const correctAns = direction === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp;
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
                {selectedAnswer !== null && opt === (direction === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp) && (
                  <CheckCircle className="text-emerald-500 ml-4" />
                )}
                {selectedAnswer === opt && opt !== (direction === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp) && (
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
