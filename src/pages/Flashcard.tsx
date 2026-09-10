import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { Vocabulary, UserProgress } from '../types';
import { ArrowLeft } from 'lucide-react';
import { hiraganaData, katakanaData, hiraganaAdvancedData, katakanaAdvancedData } from '../data/kana';
import { useAuth } from '../contexts/AuthContext';
import { getVocabulariesByCategory, formatCategoryName, isKanjiCategory } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { getSessionState, saveSessionState, removeSessionState } from '../utils/sessionState';

type KanjiFlashDirection = 'kanji-to-hiragana' | 'hiragana-to-id' | 'kanji-to-id' | 'random-3-ways';

export default function Flashcard() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [initialVocabs, setInitialVocabs] = useState<Vocabulary[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  
  const [flashcardDirection, setFlashcardDirection] = useState<KanjiFlashDirection>('kanji-to-hiragana');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notRememberedIds, setNotRememberedIds] = useState<string[]>([]);
  const [remidiCards, setRemidiCards] = useState<any[]>([]);
  
  const [masteredCount, setMasteredCount] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchVocabs = async () => {
      if (!category) return;
      
      const sessionKey = 'flashcard_state_' + category + (isKanjiCategory(category) ? '_' + flashcardDirection : '');
      const savedState = await getSessionState(currentUser?.uid, sessionKey);
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setQueue(parsed.queue);
          setInitialVocabs(parsed.initialVocabs);
          setSessionTotal(parsed.sessionTotal);
          setMasteredCount(parsed.masteredCount);
          setNotRememberedIds(parsed.notRememberedIds || []);
          setRemidiCards(parsed.remidiCards || []);
          setLoading(false);
          
          localStorage.setItem('last_activity', JSON.stringify({ 
            category, 
            type: 'Flashcard', 
            title: `Flashcard: ${formatCategoryName(category)}`, 
            link: `/flashcard/${encodeURIComponent(category)}` 
          }));
          return;
        } catch(e) {
          console.error(e);
        }
      }

      setLoading(true);
      
      let fetchedVocabs = initialVocabs;
      if (fetchedVocabs.length === 0) {
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
        
        // Shuffle initially
        // Removed initial shuffle for stable order
        setInitialVocabs(fetchedVocabs);
      }
      
      if (currentUser) {
        let pData = progressData;
        
        // Fetch from Firestore only if progressData is empty
        if (Object.keys(pData).length === 0) {
          const progQ = query(
            collection(db, 'user_progress'), 
            where('userId', '==', currentUser.uid),
            where('category', '==', category)
          );
          const progSnap = await getDocs(progQ);
          const newPData: Record<string, UserProgress> = {};
          
          const docs = progSnap.docs.map(d => ({ ...d.data(), id: d.id } as UserProgress));
          docs.sort((a, b) => (b.nextReviewTime || 0) - (a.nextReviewTime || 0));

          docs.forEach(p => {
            newPData[p.id] = p;
          });
          pData = newPData;
          setProgressData(pData);
        }
        
        const dueQueue: any[] = [];
        const now = Date.now();
        const isKanji = isKanjiCategory(category || '');
        
        fetchedVocabs.forEach(v => {
          if (isKanji) {
            const p1 = pData[`${currentUser.uid}_${v.id}_kanji-to-hiragana`];
            const p2 = pData[`${currentUser.uid}_${v.id}_hiragana-to-id`];
            const p3 = pData[`${currentUser.uid}_${v.id}_kanji-to-id`];
            const baseP = pData[`${currentUser.uid}_${v.id}`];
            
            const addDir1 = flashcardDirection === 'random-3-ways' || flashcardDirection === 'kanji-to-hiragana';
            const addDir2 = flashcardDirection === 'random-3-ways' || flashcardDirection === 'hiragana-to-id';
            const addDir3 = flashcardDirection === 'random-3-ways' || flashcardDirection === 'kanji-to-id';

            if (addDir1 && (!p1 || p1.nextReviewTime <= now || (baseP && baseP.nextReviewTime <= now))) {
               dueQueue.push({ ...v, originalId: v.id, _dir: 'kanji-to-hiragana', uniqueQueueId: `${v.id}_kanji-to-hiragana` });
            }
            if (addDir2 && (!p2 || p2.nextReviewTime <= now || (baseP && baseP.nextReviewTime <= now))) {
               dueQueue.push({ ...v, originalId: v.id, _dir: 'hiragana-to-id', uniqueQueueId: `${v.id}_hiragana-to-id` });
            }
            if (addDir3 && (!p3 || p3.nextReviewTime <= now || (baseP && baseP.nextReviewTime <= now))) {
               dueQueue.push({ ...v, originalId: v.id, _dir: 'kanji-to-id', uniqueQueueId: `${v.id}_kanji-to-id` });
            }
          } else {
            const prog = pData[`${currentUser.uid}_${v.id}`];
            if (!prog || prog.nextReviewTime <= now) {
              dueQueue.push({ ...v, originalId: v.id, uniqueQueueId: v.id });
            }
          }
        });
        
        // Shuffle the due queue so different directions are mixed
        // Removed dueQueue shuffle for stable order
        
        setQueue(dueQueue);
        setSessionTotal(dueQueue.length);
        setMasteredCount(0);
      } else {
        const mappedVocabs = fetchedVocabs.map(v => ({ ...v, originalId: v.id, uniqueQueueId: v.id }));
        setQueue(mappedVocabs);
        setSessionTotal(mappedVocabs.length);
        setMasteredCount(0);
      }
      setLoading(false);
    };
    fetchVocabs();
  }, [category, currentUser, flashcardDirection, refreshTrigger]);

  useEffect(() => {
    const saveState = async () => {
      const sessionKey = 'flashcard_state_' + category + (isKanjiCategory(category || '') ? '_' + flashcardDirection : '');
      if (!loading && initialVocabs.length > 0 && !isFinished && queue.length > 0) {
        await saveSessionState(currentUser?.uid, sessionKey, {
          queue,
          initialVocabs,
          sessionTotal,
          masteredCount,
          notRememberedIds,
          remidiCards
        });
      } else if (isFinished || (sessionTotal === 0 && initialVocabs.length > 0)) {
        await removeSessionState(currentUser?.uid, sessionKey);
      }
    };
    saveState();
  }, [queue, initialVocabs, sessionTotal, masteredCount, notRememberedIds, remidiCards, loading, isFinished, category, flashcardDirection]);

  const handleRating = async (isRemembered: boolean) => {
    if (queue.length === 0 || isProcessing) return;
    setIsProcessing(true);
    
    const currentCard = queue[0];
    
    if (currentUser) {
      const now = Date.now();
      let nextInterval = isRemembered ? 24 * 60 : 1; 
      let srsLevel: 'again' | 'hard' | 'good' | 'easy' | 'new' = isRemembered ? 'good' : 'again';
      
      let progressSuffix = '';
      if (isKanjiCategory(category || currentCard.category)) {
        progressSuffix = `_${currentCard._dir || effectiveDir}`;
      }
      const vocabId = currentCard.originalId || currentCard.id;
      const progressId = `${currentUser.uid}_${vocabId}${progressSuffix}`;
      
      const currentProg = progressData[progressId] || progressData[`${currentUser.uid}_${vocabId}`];
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
      
      const newProg: UserProgress = {
        id: progressId,
        userId: currentUser.uid,
        vocabId: vocabId,
        category: category || currentCard.category,
        interval: nextInterval,
        nextReviewTime,
        reps,
        srsLevel,
        failCount: (currentProg?.failCount || 0) + (isRemembered ? 0 : 1),
        ...(isRemembered ? {} : { isWeak: true, weakFlashcard: true, weakQuiz: true }),
        easyCount: currentProg?.easyCount || 0
      };
      
      setProgressData(prev => ({ ...prev, [progressId]: newProg }));
      
      try {
        await setDoc(doc(db, 'user_progress', progressId), newProg, { merge: true });
        
        // Update global vocab stats for Admin Kotoba Lemah
        const safeVocabId = currentCard.originalId || currentCard.id;
        if (safeVocabId && safeVocabId !== 'undefined') {
          const vocabStatsRef = doc(db, 'vocabStats', safeVocabId);
          if (!isRemembered) {
             setDoc(vocabStatsRef, {
               failCount: increment(1),
               jp: currentCard.jp,
               romaji: currentCard.romaji,
               id_translation: currentCard.id_translation,
               category: category || currentCard.category
             }, { merge: true }).catch(() => {});
          } else if (srsLevel === 'hard') {
             setDoc(vocabStatsRef, {
               hardCount: increment(1),
               jp: currentCard.jp,
               romaji: currentCard.romaji,
               id_translation: currentCard.id_translation,
               category: category || currentCard.category
             }, { merge: true }).catch(() => {});
          }
        }

        
        if (isRemembered && currentUser) {
           const userRef = doc(db, 'users', currentUser.uid);
           await updateDoc(userRef, {
             points: increment(5)
           }).catch(() => {});
        }
      } catch (err) {
        console.error('Failed to update progress', err);
      }
    }

    setIsFlipped(false);
    
    setTimeout(() => {
      const card = queue[0];
      
      let updatedFailed = notRememberedIds;
      let updatedMastered = masteredCount;

      if (!isRemembered && card) {
        if (!notRememberedIds.includes(card.uniqueQueueId || card.id)) {
          updatedFailed = [...notRememberedIds, card.uniqueQueueId || card.id];
          setNotRememberedIds(updatedFailed);
          setRemidiCards(prev => [...prev, card]);
        }
      } else {
        updatedMastered = masteredCount + 1;
        setMasteredCount(updatedMastered);
      }
      
      const newQueue = queue.slice(1);
      if (newQueue.length === 0) {
        setIsFinished(true);
        if (currentUser) {
          const sessionEndTime = Date.now();
          const durationSec = Math.max(1, Math.floor((sessionEndTime - sessionStartTime) / 1000));
          const sessionId = doc(collection(db, 'study_sessions')).id;
          const failedVocabs = initialVocabs
            .filter(v => updatedFailed.includes(v.id))
            .map(v => ({ jp: v.jp, id_translation: v.id_translation }));

          setDoc(doc(db, 'study_sessions', sessionId), {
            id: sessionId,
            userId: currentUser.uid,
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            totalDuration: durationSec,
            cardsReviewed: initialVocabs.length,
            correctCount: updatedMastered,
            incorrectCount: updatedFailed.length,
            type: 'Flashcard',
            category: category || 'Flashcard',
            failedVocabs
          }).catch(console.error);

          const userRef = doc(db, 'users', currentUser.uid);
          updateDoc(userRef, {
            totalStudyTime: increment(durationSec),
            lastActiveDate: new Date().toISOString()
          }).catch(console.error);
        }
      }
      
      setQueue(newQueue);
      setIsProcessing(false);
    }, 200);
  };

  const handleRemidi = () => {
    setQueue([...remidiCards]);
    setSessionTotal(remidiCards.length);
    setMasteredCount(0);
    setNotRememberedIds([]);
    setRemidiCards([]);
    setSessionStartTime(Date.now());
    setIsFinished(false);
  };

  const handleReset = () => {
    const sessionKey = 'flashcard_state_' + category + (isKanjiCategory(category || '') ? '_' + flashcardDirection : '');
    removeSessionState(currentUser?.uid, sessionKey);
    setSessionStartTime(Date.now());
    setIsFinished(false);
    setRefreshTrigger(prev => prev + 1);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleRating(false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleRating(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [queue, isProcessing]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] text-slate-500">Memuat flashcard...</div>;
  }

  if (initialVocabs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] p-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Tidak ada kartu</h2>
        <button onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Kembali</button>
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
              onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)} 
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
            onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)}
            className="py-3 px-6 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors w-full"
          >
            Kembali ke Menu
          </button>
        </div>
      </motion.div>
    );
  }

  const currentCard = queue[0];
  const isKana = category === 'Hiragana' || category === 'Katakana' || category === 'Hiragana Lanjutan' || category === 'Katakana Lanjutan';
  const isKanji = isKanjiCategory(category || '');
  const remainingCount = queue.length;

  const getEffectiveDirection = (cardId: string): 'kanji-to-hiragana' | 'hiragana-to-id' | 'kanji-to-id' => {
    if (flashcardDirection !== 'random-3-ways') return flashcardDirection;
    let hash = 0;
    for (let i = 0; i < cardId.length; i++) hash = (hash * 31 + cardId.charCodeAt(i)) % 3;
    if (hash === 0) return 'kanji-to-hiragana';
    if (hash === 1) return 'hiragana-to-id';
    return 'kanji-to-id';
  };

  const effectiveDir = isKanji ? getEffectiveDirection(currentCard?.id || '') : 'kanji-to-id';

  let frontMain = currentCard?.jp;
  let frontBadge = 'Jepang';
  let backMain = currentCard?.id_translation;
  let backSub = currentCard?.romaji || '';
  let backBadge = 'Arti & Cara Baca';

  if (isKanji) {
    if (effectiveDir === 'kanji-to-hiragana') {
      frontMain = currentCard?.jp;
      frontBadge = 'Kanji → Hiragana (Cara Baca)';
      backMain = currentCard?.romaji || currentCard?.jp;
      backSub = currentCard?.id_translation;
      backBadge = 'Hiragana & Arti';
    } else if (effectiveDir === 'hiragana-to-id') {
      frontMain = currentCard?.romaji || currentCard?.jp;
      frontBadge = 'Hiragana → Bahasa Indonesia (Arti)';
      backMain = currentCard?.id_translation;
      backSub = currentCard?.jp;
      backBadge = 'Arti & Kanji';
    } else {
      frontMain = currentCard?.jp;
      frontBadge = 'Kanji → Bahasa Indonesia (Arti)';
      backMain = currentCard?.id_translation;
      backSub = currentCard?.romaji || '';
      backBadge = 'Arti & Cara Baca';
    }
  } else if (isKana) {
    frontBadge = 'Karakter Kana';
    backMain = currentCard?.romaji;
    backSub = currentCard?.id_translation;
    backBadge = 'Romaji';
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans overflow-hidden">
      <header className="flex justify-between items-center p-6 relative max-w-5xl mx-auto w-full">
        <button 
          onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)}
          className="flex items-center gap-2 font-bold text-lg text-indigo-600 hover:text-indigo-800 transition-colors z-10"
        >
          <ArrowLeft size={20} /> Kembali
        </button>
        <h1 className="absolute inset-0 flex items-center justify-center text-xl font-bold pointer-events-none text-slate-800">
          {formatCategoryName(category || '')}
        </h1>
        <div className="w-24"></div>
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col items-center">
        
        {/* Kanji 3-Way Direction Selector */}
        {isKanji && (
          <div className="w-full max-w-xl mb-4 bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-1 text-xs sm:text-sm font-bold">
            <button
              onClick={() => { setFlashcardDirection('kanji-to-hiragana'); setIsFlipped(false); }}
              className={`flex-1 py-2 px-1 text-center rounded-xl transition-all ${
                flashcardDirection === 'kanji-to-hiragana'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Kanji → Hiragana
            </button>
            <button
              onClick={() => { setFlashcardDirection('hiragana-to-id'); setIsFlipped(false); }}
              className={`flex-1 py-2 px-1 text-center rounded-xl transition-all ${
                flashcardDirection === 'hiragana-to-id'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Hiragana → Arti
            </button>
            <button
              onClick={() => { setFlashcardDirection('kanji-to-id'); setIsFlipped(false); }}
              className={`flex-1 py-2 px-1 text-center rounded-xl transition-all ${
                flashcardDirection === 'kanji-to-id'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Kanji → Arti
            </button>
            <button
              onClick={() => { setFlashcardDirection('random-3-ways'); setIsFlipped(false); }}
              className={`flex-1 py-2 px-1 text-center rounded-xl transition-all ${
                flashcardDirection === 'random-3-ways'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Acak 3 Arah
            </button>
          </div>
        )}

        <div className="w-full max-w-xl mb-4">
          <div className="flex justify-between items-center">
            <div className="w-auto px-4 h-11 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
              Belum Hafal: {notRememberedIds.length}
            </div>
            <div className="font-bold text-lg text-slate-700">
              {sessionTotal - remainingCount + 1 > sessionTotal ? sessionTotal : sessionTotal - remainingCount + 1} / {sessionTotal}
            </div>
            <div className="w-auto px-4 h-11 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
              Ingat: {masteredCount}
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl relative perspective-[1000px] my-auto flex items-center justify-center min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentCard?.id || 'empty'}_${effectiveDir}`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full h-full flex items-center justify-center absolute"
            >
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full max-w-md h-[380px] cursor-pointer transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''} mx-auto hover:scale-[1.02] shadow-xl hover:shadow-2xl rounded-3xl`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-100 flex flex-col items-center justify-between p-6 sm:p-8 [backface-visibility:hidden] shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                    {frontBadge}
                  </span>
                  <h2 className="text-5xl md:text-7xl font-black text-[#1a1f36] text-center my-auto px-2">
                    {frontMain}
                  </h2>
                  <p className="text-slate-400 font-medium text-xs sm:text-sm">
                    ketuk kartu atau tekan spasi untuk membalik
                  </p>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-indigo-100 flex flex-col items-center justify-between p-6 sm:p-8 [backface-visibility:hidden] shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                    {backBadge}
                  </span>
                  <div className="my-auto text-center px-2">
                    <h2 className="text-3xl md:text-5xl font-black text-[#1a1f36] mb-3">
                      {backMain}
                    </h2>
                    {backSub && (
                      <p className="text-slate-500 text-lg sm:text-xl font-medium">
                        {backSub}
                      </p>
                    )}
                  </div>
                  <p className="text-slate-400 font-medium text-xs">
                    pilih status ingatan di bawah
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full max-w-xl grid grid-cols-2 gap-4 mt-auto pt-4">
          <button 
            onClick={() => handleRating(false)}
            className="py-3.5 sm:py-4 bg-[#fff6f0] border-2 border-orange-200 text-orange-600 font-bold text-base sm:text-lg rounded-2xl hover:bg-orange-100 transition-colors shadow-sm active:scale-[0.98]"
          >
            ✕ Belum Ingat
          </button>
          <button 
            onClick={() => handleRating(true)}
            className="py-3.5 sm:py-4 bg-[#f0fdf4] border-2 border-green-200 text-green-700 font-bold text-base sm:text-lg rounded-2xl hover:bg-green-100 transition-colors shadow-sm active:scale-[0.98]"
          >
            Ingat ✓
          </button>
        </div>
      </div>
    </div>
  );
}
