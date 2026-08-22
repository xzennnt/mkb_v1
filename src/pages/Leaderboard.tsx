import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserData } from '../types';
import { Trophy, ArrowLeft, Clock, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        let fetchedLeaders = snap.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserData));
        fetchedLeaders.sort((a, b) => (b.points || 0) - (a.points || 0));
        setLeaders(fetchedLeaders.slice(0, 100));
      } catch (err: any) {
        console.error(err);
        setError('Gagal memuat leaderboard. ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}j ${m}m`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <header className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <Link to="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
            <Trophy size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Leaderboard
          </h1>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Top Pelajar</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-slate-500">Memuat peringkat...</div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 font-medium">{error}</div>
        ) : (
          <div className="flex-1 overflow-hidden space-y-0 p-4">
            {leaders.map((user, idx) => {
              const isTop = idx === 0;
              return (
                <div key={user.uid} className={`flex items-center gap-4 p-4 rounded-xl border mb-3 ${isTop ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-100 hover:border-slate-300'} transition-all`}>
                  <span className={`font-black w-6 text-center ${isTop ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {idx + 1}
                  </span>
                  
                  <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                    <span className="font-bold text-slate-500">{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user.displayName || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Lv. {user.level} &bull; {user.masteredVocabCount} Vocab
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-black ${isTop ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {(user.points || 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Points</p>
                  </div>
                  
                  <div className="hidden sm:block text-right ml-4">
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded shadow-sm border border-slate-200">
                      {formatTime(user.totalStudyTime)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {leaders.length === 0 && !loading && (
          <div className="p-8 text-center text-slate-500">Belum ada data pelajar.</div>
        )}
      </div>
    </div>
  );
}
