import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Vocabulary } from '../types';
import { ArrowLeft, Play, BookOpen, ArrowUp, Zap } from 'lucide-react';
import { hiraganaData, katakanaData, hiraganaGrid, katakanaGrid, hiraganaAdvancedData, katakanaAdvancedData, hiraganaAdvancedGrid, katakanaAdvancedGrid } from '../data/kana';
import { getVocabulariesByCategory, formatCategoryName } from '../data';
import { useAuth } from '../contexts/AuthContext';

export default function DeckView() {
  const { category } = useParams<{ category: string }>();
  const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
  const [userProgressMap, setUserProgressMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
        
        // Remove duplicates
        const seen = new Set();
        fetchedVocabs = rawVocabs.filter(v => {
          if (seen.has(v.jp)) return false;
          seen.add(v.jp);
          return true;
        });
      }

      if (currentUser && fetchedVocabs.length > 0) {
        const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
        const progSnap = await getDocs(progQ);
        const pMap: Record<string, any> = {};
        progSnap.docs.forEach(d => {
          pMap[d.data().vocabId] = d.data();
        });

        setUserProgressMap(pMap);
        fetchedVocabs.sort((a, b) => {
          const pa = pMap[a.id];
          const pb = pMap[b.id];
          const getScore = (p: any) => {
            if (!p) return 1;
            if (p.srsLevel === 'again') return 3;
            if (p.srsLevel === 'hard') return 2;
            if (p.srsLevel === 'good') return 0;
            if (p.srsLevel === 'easy') return -1;
            return 1;
          };
          return getScore(pb) - getScore(pa);
        });
      } else {
        // Fallback sort
        setUserProgressMap({});
        fetchedVocabs.sort((a, b) => {
          return a.jp.localeCompare(b.jp);
        });
      }
      
      setVocabs(fetchedVocabs);
      setLoading(false);
    };

    fetchVocabs();
  }, [category, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="text-slate-500 font-bold tracking-widest uppercase animate-pulse">Memuat...</div>
      </div>
    );
  }

  // Calculate number of sessions (10 vocabs per session)
  const totalSessions = Math.ceil(vocabs.length / 10);

  return (
    <div className="max-w-5xl mx-auto p-4 py-8 w-full flex-1">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-indigo-600 font-bold mb-6 hover:text-indigo-800 transition-colors">
        <ArrowLeft size={20} /> Kembali ke Menu Belajar
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 mb-8">
        <h1 className="text-3xl font-black text-slate-800 mb-2">{formatCategoryName(category || '')}</h1>
        <p className="text-slate-500 font-medium mb-8">Ada {vocabs.length} kosakata di deck ini.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <button 
            onClick={() => navigate(`/flashcard/${category}`)}
            className="flex items-center justify-center gap-3 bg-[#003399] border border-[#002277] hover:bg-[#002277] text-white font-black text-3xl py-6 px-8 rounded-2xl transition-all shadow-md hover:shadow-lg group w-full h-full min-h-[140px]"
          >
            <div className="flex flex-col items-center justify-center gap-1 group-hover:scale-105 transition-transform">
              <div className="flex items-center gap-1">
                FLASH<Zap size={32} className="fill-white text-white" />
              </div>
              <div className="tracking-widest uppercase">CARD</div>
            </div>
          </button>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Sesi Latihan Soal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: totalSessions }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => navigate(`/quiz/${category}/${i}`)}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Play size={18} /> Sesi {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {category === 'Hiragana' || category === 'Katakana' || category === 'Hiragana Lanjutan' || category === 'Katakana Lanjutan' ? (
        <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-8 mt-12">
          {(category === 'Hiragana' ? hiraganaGrid : category === 'Katakana' ? katakanaGrid : category === 'Hiragana Lanjutan' ? hiraganaAdvancedGrid : katakanaAdvancedGrid).map((item, idx) => (
            item.empty ? <div key={idx} /> : (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-center shadow-sm flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">{item.jp}</span>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">{item.romaji}</span>
              </div>
            )
          ))}
        </div>
      ) : (
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Daftar Kotoba</h2>
          <span className="text-sm text-slate-500 font-medium">Diurutkan berdasarkan yang paling sering salah</span>
        </div>
        <div className="divide-y divide-slate-100">
          {vocabs.map((v, index) => {
            const p = userProgressMap[v.id];
            const status = p ? p.srsLevel : 'new';
            return (
            <div key={v.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between transition-colors hover:bg-slate-50">
              <div className="mb-2 sm:mb-0">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-slate-800">{v.jp}</p>
                </div>
                <p className="text-xs text-slate-500">{v.romaji}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-slate-600 font-medium">{v.id_translation}</p>
                <div className="flex items-center sm:justify-end gap-2 mt-2">
                  {status === 'again' || status === 'hard' ? (
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded-full border border-rose-100 flex items-center gap-1">❌ Susah</span>
                  ) : status === 'easy' || status === 'good' ? (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full border border-emerald-100 flex items-center gap-1">✅ Gampang (Hafal)</span>
                  ) : (
                    <span className="text-[10px] font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-full border border-slate-100 flex items-center gap-1">⬜ Belum Dipelajari</span>
                  )}
                </div>
              </div>
            </div>
            );
          })}
          {vocabs.length === 0 && (
            <div className="p-8 text-center text-slate-500">Belum ada kosakata.</div>
          )}
        </div>
      </div>
      )}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 hover:-translate-y-1 transition-all z-50 flex items-center justify-center"
          title="Ke Atas"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
}
