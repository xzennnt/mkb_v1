import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, getDocs } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Trophy, Clock, BrainCircuit, Settings, LogOut, BookOpen, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import StreakCalendar from '../components/StreakCalendar';

import { getCategoriesCount } from '../data';

export default function Dashboard() {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMnn1, setShowMnn1] = useState(true);
  const [showMnn2, setShowMnn2] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    
    // Using local static vocabularies
    const catArray = getCategoriesCount();
    setCategories(catArray);
    setLoading(false);
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
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Points</p>
            <p className="font-bold text-indigo-600">{(userData.points || 0).toLocaleString()} XP</p>
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
            <p className="text-xs text-rose-600 font-bold mt-1">Exp x{(1 + ((userData.loginStreak || 1) - 1) * 0.05).toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex items-center gap-4">
          <div className="bg-indigo-50 p-4 rounded-xl text-indigo-500">
            <Trophy size={32} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Level Saat Ini</p>
            <p className="text-3xl font-black text-slate-800">{userData.level}</p>
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
                  onClick={() => setShowMnn1(!showMnn1)} 
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
                  onClick={() => setShowMnn2(!showMnn2)} 
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
        
        <div className="lg:col-span-1 h-fit self-start">
          <StreakCalendar history={userData.loginHistory || []} />
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
