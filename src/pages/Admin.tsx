import React, { useState, useEffect } from 'react';
import { collection, setDoc, doc, getDocs, query, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, Users, Clock, UploadCloud, LogOut, AlertTriangle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserData, StudySession, Vocabulary } from '../types';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'upload' | 'users' | 'sessions' | 'difficult'>('upload');
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [difficultVocabs, setDifficultVocabs] = useState<Vocabulary[]>([]);
  const [userMap, setUserMap] = useState<Record<string, UserData>>({});
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'sessions' || activeTab === 'difficult') {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users' || activeTab === 'sessions') {
        // Fetch Users
        const usersSnap = await getDocs(collection(db, 'users'));
        const fetchedUsers = usersSnap.docs.map(d => d.data() as UserData);
        setUsers(fetchedUsers);
        
        const map: Record<string, UserData> = {};
        fetchedUsers.forEach(u => { map[u.uid] = u; });
        setUserMap(map);
      }

      if (activeTab === 'sessions') {
        // Fetch Sessions
        const sessionsQ = query(collection(db, 'study_sessions'), orderBy('startTime', 'desc'), limit(100));
        const sessionsSnap = await getDocs(sessionsQ);
        setSessions(sessionsSnap.docs.map(d => d.data() as StudySession));
      }

      if (activeTab === 'difficult') {
        const vocabsSnap = await getDocs(collection(db, 'vocabularies'));
        const allVocabs = vocabsSnap.docs.map(d => d.data() as Vocabulary);
        const filteredAndSorted = allVocabs
          .filter(v => (v.failCount && v.failCount > 0) || (v.hardCount && v.hardCount > 0))
          .sort((a, b) => ((b.failCount || 0) * 2 + (b.hardCount || 0)) - ((a.failCount || 0) * 2 + (a.hardCount || 0)));
        setDifficultVocabs(filteredAndSorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini dari leaderboard dan database? (Akun auth mereka akan tetap ada)')) {
      try {
        await deleteDoc(doc(db, 'users', uid));
        setUsers(users.filter(u => u.uid !== uid));
      } catch (err) {
        console.error('Gagal menghapus user', err);
        alert('Gagal menghapus user');
      }
    }
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      setStatus('Parsing JSON...');
      const parsed = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsed)) {
        throw new Error('Format harus berupa array JSON');
      }

      setStatus(`Menyimpan ${parsed.length} kosakata...`);
      
      let count = 0;
      for (const item of parsed) {
        if (!item.jp || !item.id_translation || !item.category) {
          throw new Error('Tiap item butuh jp, id_translation, dan category');
        }
        
        // Generate a random ID if not provided
        const vocabId = item.id || doc(collection(db, 'vocabularies')).id;
        
        await setDoc(doc(db, 'vocabularies', vocabId), {
          id: vocabId,
          jp: item.jp,
          id_translation: item.id_translation,
          category: item.category,
          romaji: item.romaji || ''
        });
        count++;
        if (count % 10 === 0) setStatus(`Tersimpan ${count}/${parsed.length}...`);
      }
      
      setStatus(`Berhasil menyimpan ${count} kosakata!`);
      setJsonInput('');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}j ${m}m`;
  };

  const formatDateTime = (ms: number) => {
    return new Date(ms).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Admin Panel</h1>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'upload' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <UploadCloud size={16} /> Upload
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Users size={16} /> Users
          </button>
          <button 
            onClick={() => setActiveTab('sessions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'sessions' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Clock size={16} /> Log Belajar
          </button>
          <button 
            onClick={() => setActiveTab('difficult')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'difficult' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <AlertTriangle size={16} /> Kotoba Sulit
          </button>
          <div className="w-px h-8 bg-slate-200 mx-2 self-center"></div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all text-rose-500 hover:text-rose-600 hover:bg-rose-50"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </header>

      {activeTab === 'upload' && (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Upload Kosakata Batch (JSON)</h2>
          <p className="text-sm text-slate-500 mb-4">
            Format JSON harus berupa array objek. Contoh:<br/>
            <pre className="bg-slate-50 p-4 rounded-xl text-xs mt-2 border border-slate-100 text-slate-600 font-mono">
              {`[
    { "jp": "わたし", "id_translation": "Saya", "category": "MNN1_Bab1" },
    { "jp": "あなた", "id_translation": "Anda", "category": "MNN1_Bab1" }
  ]`}
            </pre>
          </p>

          <textarea
            className="w-full h-64 p-4 border border-slate-200 rounded-xl mb-4 font-mono text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste array JSON di sini..."
          ></textarea>

          <button
            onClick={handleUpload}
            disabled={loading || !jsonInput.trim()}
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-sm hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
          >
            {loading ? 'Menyimpan...' : 'Upload JSON'}
          </button>

          {status && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-xl text-sm font-bold text-indigo-800 border border-indigo-100">
              {status}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Daftar Pengguna</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold">Nama / Email</th>
                  <th className="p-4 font-bold text-center">Level</th>
                  <th className="p-4 font-bold text-center">Streak</th>
                  <th className="p-4 font-bold text-right">Points</th>
                  <th className="p-4 font-bold text-right">Mastered</th>
                  <th className="p-4 font-bold text-center">Waktu Belajar</th>
                  <th className="p-4 font-bold">Last Login / Aktif</th>
                  <th className="p-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.uid} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{u.displayName || u.email?.split('@')[0] || 'User'}</div>
                      <div className="text-slate-500 text-xs">{u.email}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-1 rounded text-xs">Lv. {u.level}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-rose-500">🔥 {u.loginStreak || 1}</span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-700">{(u.points || 0).toLocaleString()}</td>
                    <td className="p-4 text-right font-medium text-slate-600">{u.masteredVocabCount}</td>
                    <td className="p-4 text-center font-mono text-xs text-slate-500">{formatTime(u.totalStudyTime)}</td>
                    <td className="p-4 text-xs">
                      <div className="text-slate-700 font-bold">{u.lastLoginDate || '-'}</div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wide mt-1">Aktif: {u.lastActiveDate ? formatDateTime(new Date(u.lastActiveDate).getTime()) : '-'}</div>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u.uid)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Log Aktivitas Belajar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold">Waktu Mulai</th>
                  <th className="p-4 font-bold">Pengguna</th>
                  <th className="p-4 font-bold text-center">Durasi</th>
                  <th className="p-4 font-bold text-center">Jumlah Soal</th>
                  <th className="p-4 font-bold text-center">Benar / Salah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map(s => {
                  const u = userMap[s.userId];
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700 whitespace-nowrap">
                        {formatDateTime(s.startTime)}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{u?.displayName || u?.email?.split('@')[0] || 'Unknown'}</div>
                        <div className="text-slate-500 text-xs">{u?.email || s.userId}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-bold px-2 py-1 rounded">
                          {Math.floor(s.totalDuration / 60)}m {s.totalDuration % 60}s
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-indigo-600">
                        {s.cardsReviewed}
                      </td>
                      <td className="p-4 text-center">
                        {s.correctCount !== undefined ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">✓ {s.correctCount}</span>
                            <span className="text-rose-600 font-bold text-xs bg-rose-50 px-2 py-1 rounded">✗ {s.incorrectCount}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {sessions.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">Belum ada log belajar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'difficult' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Ranking Kotoba Tersulit (Berdasarkan Data Siswa)</h2>
            <p className="text-slate-500 text-sm mt-1">Sistem otomatis melacak jika pengguna salah menjawab atau butuh waktu lama untuk menjawab.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold text-center w-16">Peringkat</th>
                  <th className="p-4 font-bold">Kotoba (Jepang)</th>
                  <th className="p-4 font-bold">Arti (ID)</th>
                  <th className="p-4 font-bold text-center">Kategori</th>
                  <th className="p-4 font-bold text-center" title="Jumlah salah menjawab">Gagal ❌</th>
                  <th className="p-4 font-bold text-center" title="Jumlah menjawab butuh waktu lebih dari 10 detik">Sulit/Lama 🐢</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {difficultVocabs.map((v, index) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-center font-black text-slate-400">
                      #{index + 1}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-lg">{v.jp}</div>
                      <div className="text-slate-400 text-xs">{v.romaji}</div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{v.id_translation}</td>
                    <td className="p-4 text-center">
                      <span className="bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded text-xs">{v.category}</span>
                    </td>
                    <td className="p-4 text-center">
                      {v.failCount ? (
                        <span className="font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">{v.failCount}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {v.hardCount ? (
                        <span className="font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">{v.hardCount}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {difficultVocabs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">Data belum terkumpul. Belum ada siswa yang membuat kesalahan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
