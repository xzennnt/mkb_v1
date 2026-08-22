import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, getDocs, where, limit } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Trophy, Clock, BrainCircuit, Settings, LogOut, BookOpen, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import StreakCalendar from '../components/StreakCalendar';
import { getXpForLevel } from '../utils/levelUtils';

import { getCategoriesCount } from '../data';

export default function Dashboard() {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMnn1, setShowMnn1] = useState(() => {
    if (currentUser?.uid) {
      const stored = localStorage.getItem(`ui_showMnn1_${currentUser.uid}`);
      if (stored !== null) return stored === 'true';
    }
    return true;
  });
  const [showMnn2, setShowMnn2] = useState(() => {
    if (currentUser?.uid) {
      const stored = localStorage.getItem(`ui_showMnn2_${currentUser.uid}`);
      if (stored !== null) return stored === 'true';
    }
    return false;
  });

  const toggleMnn1 = () => {
    const newVal = !showMnn1;
    setShowMnn1(newVal);
    if (currentUser?.uid) localStorage.setItem(`ui_showMnn1_${currentUser.uid}`, String(newVal));
  };

  const toggleMnn2 = () => {
    const newVal = !showMnn2;
    setShowMnn2(newVal);
    if (currentUser?.uid) localStorage.setItem(`ui_showMnn2_${currentUser.uid}`, String(newVal));
  };
  const [lastActivity, setLastActivity] = useState<{title: string, type: string, link: string} | null>(null);
  const [dueReviewCount, setDueReviewCount] = useState<number>(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    
    const activity = localStorage.getItem('last_activity');
    if (activity) {
      try {
        setLastActivity(JSON.parse(activity));
      } catch (e) {}
    }

    
    // Using local static vocabularies
    const catArray = getCategoriesCount();
    setCategories(catArray);
    
    // Fetch Due Reviews
    const fetchReviews = async () => {
      try {
        const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid), where('nextReviewTime', '<=', Date.now()));
        const progSnap = await getDocs(progQ);
        setDueReviewCount(progSnap.size);
        
        const usersSnap = await getDocs(query(collection(db, 'users'), limit(50)));
        let usersData = usersSnap.docs.map(d => d.data());
        usersData = usersData.filter(u => u.uid !== currentUser.uid && u.lastActiveDate && !u.isBanned && u.email !== 'edwinageng113@gmail.com' && u.role !== 'admin');
        usersData.sort((a, b) => new Date(b.lastActiveDate).getTime() - new Date(a.lastActiveDate).getTime());
        setRecentUsers(usersData.slice(0, 4));
      } catch (err) {
        console.error("Error fetching reviews", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}j ${m}m`;
  };

  if (!userData) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 py-8 w-full flex-1">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <span className="font-bold">MKB</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Halo, {userData.displayName || userData.email?.split('@')[0] || 'Pelajar'}!</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block min-w-[120px]">
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Points</p>
            <p className="font-bold text-indigo-600">{(userData.points || 0).toLocaleString()} XP</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, ((userData.points || 0) - getXpForLevel(userData.level || 1)) / (getXpForLevel((userData.level || 1) + 1) - getXpForLevel(userData.level || 1)) * 100))}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">{getXpForLevel((userData.level || 1) + 1) - (userData.points || 0)} XP ke Lv {(userData.level || 1) + 1}</p>
          </div>
          <div className="h-10 w-[1px] bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold">Level {userData.level}</p>
              <p className="text-xs text-slate-500">{userData.displayName || userData.email?.split('@')[0] || 'User'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
              <span className="font-bold text-slate-500">{(userData.displayName || userData.email || 'U').charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-2">
            {userData.role === 'admin' && (
              <Link to="/admin" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                <Settings size={20} />
              </Link>
            )}
            <button onClick={handleLogout} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex items-center gap-4">
          <div className="bg-rose-50 p-4 rounded-xl text-rose-500">
            <span className="text-3xl">🔥</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Login Streak</p>
            <p className="text-3xl font-black text-slate-800">{userData.loginStreak || 1} Hari</p>
            <p className="text-xs text-rose-600 font-bold mt-1">Exp x{Math.min(3.0, 1 + (((userData.loginStreak || 1) - 1) * 0.1)).toFixed(1)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex items-center gap-4">
          <div className="bg-indigo-50 p-4 rounded-xl text-indigo-500">
            <Trophy size={32} />
          </div>
          <div className="flex-1 w-full min-w-0">
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Level Saat Ini</p>
            <div className="flex items-end gap-2 mb-1.5">
              <p className="text-3xl font-black text-slate-800 leading-none">{userData.level}</p>
              <p className="text-xs font-bold text-slate-400 mb-0.5 truncate">{userData.points || 0} / {getXpForLevel((userData.level || 1) + 1)} XP</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, ((userData.points || 0) - getXpForLevel(userData.level || 1)) / (getXpForLevel((userData.level || 1) + 1) - getXpForLevel(userData.level || 1)) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex items-center gap-4">
          <div className="bg-emerald-50 p-4 rounded-xl text-emerald-500">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Waktu Belajar</p>
            <p className="text-3xl font-black text-slate-800">{formatTime(userData.totalStudyTime)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex items-center gap-4">
          <div className="bg-amber-50 p-4 rounded-xl text-amber-500">
            <BrainCircuit size={32} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Kosakata Dikuasai</p>
            <p className="text-3xl font-black text-slate-800">{userData.masteredVocabCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
        
          {/* LONG-TERM MEMORY (SRS) REVIEW BANNER */}
          {dueReviewCount > 0 && (
            <div className="mb-6 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl shadow-md p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <BrainCircuit size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Review Kotoba Lemah</h2>
                  <p className="text-sm text-rose-100 mt-1">Ada {dueReviewCount} kosakata yang perlu Anda ulang agar masuk ke ingatan jangka panjang.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                <button onClick={() => navigate('/review-flashcard')} className="bg-white/20 text-white hover:bg-white/30 border border-white/30 px-5 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto text-center shadow-sm flex items-center justify-center gap-2">
                  <BookOpen size={18} /> via Flashcard
                </button>
                <button onClick={() => navigate('/review')} className="bg-white text-rose-600 hover:bg-rose-50 px-5 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto text-center shadow-sm flex items-center justify-center gap-2">
                  <Play size={18} /> via Kuis
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 text-center animate-pulse">
              <p className="text-slate-500 font-medium">Memuat deck...</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-slate-800 mb-4">Belajar Huruf Kana</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-xl text-emerald-500">
                      <span className="text-2xl font-bold">あ</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">Hiragana</h3>
                      <p className="text-sm text-slate-500">46 huruf dasar</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <button 
                      onClick={() => navigate(`/deck/Hiragana`)}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Tabel
                    </button>
                    <button 
                      onClick={() => navigate(`/flashcard/Hiragana`)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Flashcard
                    </button>
                    <button 
                      onClick={() => navigate(`/quiz/Hiragana/0`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Latihan
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-xl text-emerald-500">
                      <span className="text-2xl font-bold">ア</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">Katakana</h3>
                      <p className="text-sm text-slate-500">46 huruf dasar</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <button 
                      onClick={() => navigate(`/deck/Katakana`)}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Tabel
                    </button>
                    <button 
                      onClick={() => navigate(`/flashcard/Katakana`)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Flashcard
                    </button>
                    <button 
                      onClick={() => navigate(`/quiz/Katakana/0`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Latihan
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-xl text-emerald-500">
                      <span className="text-2xl font-bold">が</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">Hiragana Lanjutan</h3>
                      <p className="text-sm text-slate-500">Dakuten, Yoon, dll</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <button 
                      onClick={() => navigate(`/deck/Hiragana Lanjutan`)}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Tabel
                    </button>
                    <button 
                      onClick={() => navigate(`/flashcard/Hiragana Lanjutan`)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Flashcard
                    </button>
                    <button 
                      onClick={() => navigate(`/quiz/Hiragana Lanjutan/0`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Latihan
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-xl text-emerald-500">
                      <span className="text-2xl font-bold">ガ</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">Katakana Lanjutan</h3>
                      <p className="text-sm text-slate-500">Dakuten, Yoon, dll</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <button 
                      onClick={() => navigate(`/deck/Katakana Lanjutan`)}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Tabel
                    </button>
                    <button 
                      onClick={() => navigate(`/flashcard/Katakana Lanjutan`)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Flashcard
                    </button>
                    <button 
                      onClick={() => navigate(`/quiz/Katakana Lanjutan/0`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Latihan
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-slate-800">Menu Belajar (Bab)</h2>
              </div>
              
              {/* Minna no Nihongo 1 */}
              <div className="mb-6">
                <button 
                  onClick={toggleMnn1} 
                  className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                      <BookOpen size={20} />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Minna no Nihongo 1 (Bab 1 - 25)</span>
                  </div>
                  {showMnn1 ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                </button>
                
                {showMnn1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.filter(c => c.name.startsWith('MNN1')).map((cat, idx) => (
                      <div 
                        key={idx}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-500">
                            <BookOpen size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{cat.formattedName || cat.name}</h3>
                            <p className="text-sm text-slate-500">{cat.count} kosakata</p>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <button 
                            onClick={() => navigate(`/deck/${encodeURIComponent(cat.name)}`)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm text-center transition-colors flex items-center justify-center gap-2"
                          >
                            <Play size={18} /> Mulai Belajar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Minna no Nihongo 2 */}
              <div className="mb-6">
                <button 
                  onClick={toggleMnn2} 
                  className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                      <BookOpen size={20} />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Minna no Nihongo 2 (Bab 26 - 50)</span>
                  </div>
                  {showMnn2 ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                </button>
                
                {showMnn2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.filter(c => c.name.startsWith('MNN2')).map((cat, idx) => (
                      <div 
                        key={idx}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-500">
                            <BookOpen size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{cat.formattedName || cat.name}</h3>
                            <p className="text-sm text-slate-500">{cat.count} kosakata</p>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <button 
                            onClick={() => navigate(`/deck/${encodeURIComponent(cat.name)}`)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm text-center transition-colors flex items-center justify-center gap-2"
                          >
                            <Play size={18} /> Mulai Belajar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Other Categories if any */}
              {categories.filter(c => !c.name.startsWith('MNN')).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Lainnya</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.filter(c => !c.name.startsWith('MNN')).map((cat, idx) => (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-50 p-3 rounded-xl text-indigo-500">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{cat.formattedName || cat.name}</h3>
                        <p className="text-sm text-slate-500">{cat.count} kosakata</p>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <button 
                        onClick={() => navigate(`/deck/${encodeURIComponent(cat.name)}`)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm text-center transition-colors flex items-center justify-center gap-2"
                      >
                        <Play size={18} /> Mulai Belajar
                      </button>
                    </div>
                  </div>
                ))}
                  </div>
                </div>
              )}
                {categories.length === 0 && (
                  <div className="col-span-1 sm:col-span-2 bg-white rounded-2xl shadow-md border border-slate-200 p-8 text-center">
                    <p className="text-slate-500 font-medium">Belum ada deck kosakata. Minta admin untuk menambahkan.</p>
                  </div>
                )}
            </>
          )}
        </div>
        
        <div className="lg:col-span-1 h-fit self-start flex flex-col gap-6">
          <StreakCalendar history={userData.loginHistory || []} />
          
          {recentUsers.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Pelajar Aktif
              </h3>
              <div className="space-y-3">
                {recentUsers.map((u, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {(u.displayName || u.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{u.displayName || u.email?.split('@')[0] || 'User'}</p>
                        <p className="text-[10px] text-slate-500">{u.masteredVocabCount || 0} Vocab Hafal</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      {new Date(u.lastActiveDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-indigo-900 text-white rounded-2xl shadow-md p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-800 p-3 rounded-lg text-amber-400">
            <Trophy size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-tight">Papan Peringkat (Leaderboard)</h3>
            <p className="text-sm text-indigo-200">Lihat peringkat Anda dibandingkan pelajar lain.</p>
          </div>
        </div>
        <Link to="/leaderboard" className="px-5 py-2 bg-indigo-800 border border-indigo-700 rounded-lg font-bold text-white hover:bg-indigo-700 transition-colors uppercase text-xs tracking-widest">
          Lihat
        </Link>
      </div>
    </div>
  );
}
