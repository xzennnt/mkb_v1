import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Trophy, Clock, BrainCircuit, Settings, LogOut } from 'lucide-react';
import StreakCalendar from '../components/StreakCalendar';

export default function Dashboard() {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [dueCardsCount, setDueCardsCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const fetchDueCards = async () => {
      const q = query(
        collection(db, 'user_progress'),
        where('userId', '==', currentUser.uid),
        where('nextReviewTime', '<=', Date.now())
      );
      const snap = await getDocs(q);
      setDueCardsCount(snap.size);
    };
    fetchDueCards();
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
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-4">
            <Play size={40} className="text-indigo-600 ml-2" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Sesi Belajar</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Ada <span className="font-bold text-indigo-600">{dueCardsCount}</span> kartu yang perlu Anda review sekarang, 
            dan Anda bisa mempelajari kosakata baru.
          </p>
          <button 
            onClick={() => navigate('/study')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Mulai Belajar Sekarang
          </button>
        </div>
        
        <div className="lg:col-span-1">
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
