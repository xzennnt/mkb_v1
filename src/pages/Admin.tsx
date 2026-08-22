import React, { useState, useEffect } from 'react';
import { collection, setDoc, doc, getDocs, query, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, Users, Clock, UploadCloud, LogOut, AlertTriangle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserData, StudySession, Vocabulary } from '../types';
import mnnBab1_5 from '../data/mnn1_bab1_5.json';
import mnnBab6_8 from '../data/mnn1_bab6_8.json';
import mnnBab9_10 from '../data/mnn1_bab9_10.json';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'upload' | 'users' | 'sessions' | 'difficult'>('upload');
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
        const fetchedUsers = usersSnap.docs.map(d => ({ ...d.data(), uid: d.id } as UserData));
        setUsers(fetchedUsers);
        
        const map: Record<string, UserData> = {};
        fetchedUsers.forEach(u => { map[u.uid] = u; });
        setUserMap(map);
      }

      if (activeTab === 'sessions') {
        // Fetch Sessions
        const sessionsQ = query(collection(db, 'study_sessions'), orderBy('startTime', 'desc'), limit(100));
        const sessionsSnap = await getDocs(sessionsQ);
        setSessions(sessionsSnap.docs.map(d => ({ ...d.data(), id: d.id } as StudySession)));
      }

      if (activeTab === 'difficult') {
        const vocabsSnap = await getDocs(collection(db, 'vocabularies'));
        const allVocabs = vocabsSnap.docs.map(d => ({ ...d.data(), id: d.id } as Vocabulary));
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

  const handleSeedKana = async () => {
    try {
      setLoading(true);
      setStatus('Seeding Hiragana & Katakana...');
      const hiragana = [
        { jp: "あ", romaji: "a" }, { jp: "い", romaji: "i" }, { jp: "う", romaji: "u" }, { jp: "え", romaji: "e" }, { jp: "お", romaji: "o" },
        { jp: "か", romaji: "ka" }, { jp: "き", romaji: "ki" }, { jp: "く", romaji: "ku" }, { jp: "け", romaji: "ke" }, { jp: "こ", romaji: "ko" },
        { jp: "さ", romaji: "sa" }, { jp: "し", romaji: "shi" }, { jp: "す", romaji: "su" }, { jp: "せ", romaji: "se" }, { jp: "そ", romaji: "so" },
        { jp: "た", romaji: "ta" }, { jp: "ち", romaji: "chi" }, { jp: "つ", romaji: "tsu" }, { jp: "て", romaji: "te" }, { jp: "と", romaji: "to" },
        { jp: "な", romaji: "na" }, { jp: "に", romaji: "ni" }, { jp: "ぬ", romaji: "nu" }, { jp: "ね", romaji: "ne" }, { jp: "の", romaji: "no" },
        { jp: "は", romaji: "ha" }, { jp: "ひ", romaji: "hi" }, { jp: "ふ", romaji: "fu" }, { jp: "へ", romaji: "he" }, { jp: "ほ", romaji: "ho" },
        { jp: "ま", romaji: "ma" }, { jp: "み", romaji: "mi" }, { jp: "む", romaji: "mu" }, { jp: "め", romaji: "me" }, { jp: "も", romaji: "mo" },
        { jp: "や", romaji: "ya" }, { jp: "ゆ", romaji: "yu" }, { jp: "よ", romaji: "yo" },
        { jp: "ら", romaji: "ra" }, { jp: "り", romaji: "ri" }, { jp: "る", romaji: "ru" }, { jp: "れ", romaji: "re" }, { jp: "ろ", romaji: "ro" },
        { jp: "わ", romaji: "wa" }, { jp: "を", romaji: "wo" }, { jp: "ん", romaji: "n" }
      ];

      const katakana = [
        { jp: "ア", romaji: "a" }, { jp: "イ", romaji: "i" }, { jp: "ウ", romaji: "u" }, { jp: "エ", romaji: "e" }, { jp: "オ", romaji: "o" },
        { jp: "カ", romaji: "ka" }, { jp: "キ", romaji: "ki" }, { jp: "ク", romaji: "ku" }, { jp: "ケ", romaji: "ke" }, { jp: "コ", romaji: "ko" },
        { jp: "サ", romaji: "sa" }, { jp: "シ", romaji: "shi" }, { jp: "ス", romaji: "su" }, { jp: "セ", romaji: "se" }, { jp: "ソ", romaji: "so" },
        { jp: "タ", romaji: "ta" }, { jp: "チ", romaji: "chi" }, { jp: "ツ", romaji: "tsu" }, { jp: "テ", romaji: "te" }, { jp: "ト", romaji: "to" },
        { jp: "ナ", romaji: "na" }, { jp: "ニ", romaji: "ni" }, { jp: "ヌ", romaji: "nu" }, { jp: "ネ", romaji: "ne" }, { jp: "ノ", romaji: "no" },
        { jp: "ハ", romaji: "ha" }, { jp: "ヒ", romaji: "hi" }, { jp: "フ", romaji: "fu" }, { jp: "ヘ", romaji: "he" }, { jp: "ホ", romaji: "ho" },
        { jp: "マ", romaji: "ma" }, { jp: "ミ", romaji: "mi" }, { jp: "ム", romaji: "mu" }, { jp: "メ", romaji: "me" }, { jp: "モ", romaji: "mo" },
        { jp: "ヤ", romaji: "ya" }, { jp: "ユ", romaji: "yu" }, { jp: "ヨ", romaji: "yo" },
        { jp: "ラ", romaji: "ra" }, { jp: "リ", romaji: "ri" }, { jp: "ル", romaji: "ru" }, { jp: "レ", romaji: "re" }, { jp: "ロ", romaji: "ro" },
        { jp: "ワ", romaji: "wa" }, { jp: "ヲ", romaji: "wo" }, { jp: "ン", romaji: "n" }
      ];

      for (const item of hiragana) {
        const d = doc(collection(db, 'vocabularies'));
        await setDoc(d, {
          id: d.id,
          jp: item.jp,
          id_translation: item.romaji,
          category: 'Hiragana',
          romaji: item.romaji
        });
      }
      for (const item of katakana) {
        const d = doc(collection(db, 'vocabularies'));
        await setDoc(d, {
          id: d.id,
          jp: item.jp,
          id_translation: item.romaji,
          category: 'Katakana',
          romaji: item.romaji
        });
      }
      setStatus('Berhasil menambahkan data Hiragana & Katakana!');
    } catch (err: any) {
      setStatus(`Error seeding: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedBab1to10 = async () => {
    try {
      setLoading(true);
      setStatus('Menambahkan data Bab 1-10...');
      
      const allBab = [...mnnBab1_5, ...mnnBab6_8, ...mnnBab9_10] as any[];
      let count = 0;
      
      for (const item of allBab) {
        // Create unique ID based on category and jp word to avoid duplicates
        const safeId = `${item.category}_${item.jp}`.replace(/[^a-zA-Z0-9_]/g, '_');
        const docRef = doc(db, 'vocabularies', safeId);
        await setDoc(docRef, {
          jp: item.jp,
          romaji: item.romaji || "",
          id_translation: item.id_translation || "",
          category: item.category,
          createdAt: Date.now()
        });
        count++;
      }
      
      setStatus(`Berhasil menambahkan ${count} kosakata Bab 1-10!`);
    } catch (err: any) {
      setStatus(`Error seeding: ${err.message}`);
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
            <UploadCloud size={16} /> Data Base
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
          <h2 className="text-xl font-bold mb-4 text-slate-800">Manajemen Data Kosakata</h2>
          <div className="text-sm text-slate-500 mb-6">
            Pilih opsi di bawah ini untuk menambahkan data otomatis ke dalam database. (Upload kustom via JSON telah dinonaktifkan).
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSeedKana}
              disabled={loading}
              className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-sm hover:bg-emerald-700 disabled:bg-slate-300 transition-colors"
            >
              {loading ? 'Menyimpan...' : 'Tambah Hiragana & Katakana'}
            </button>
            <button
              onClick={handleSeedBab1to10}
              disabled={loading}
              className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-sm hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
            >
              {loading ? 'Menyimpan...' : 'Migrasi / Tambah Bab 1-10'}
            </button>
          </div>

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
                {users.map((u, index) => (
                  <tr key={u.uid || index} className="hover:bg-slate-50 transition-colors">
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
                {sessions.map((s, index) => {
                  const u = userMap[s.userId];
                  return (
                    <tr key={s.id || index} className="hover:bg-slate-50 transition-colors">
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
                  <tr key={v.id || index} className="hover:bg-slate-50 transition-colors">
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
