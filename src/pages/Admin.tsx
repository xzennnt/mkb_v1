import React, { useState, useEffect } from 'react';
import { collection, setDoc, doc, getDocs, query, orderBy, limit, deleteDoc, writeBatch, where, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, Users, Clock, LayoutDashboard, LogOut, AlertTriangle, Trash2, Edit2, Search, Filter, RefreshCw, CheckCircle2, XCircle, BookOpen, Layers, BarChart2, Activity, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { UserData, StudySession, Vocabulary } from '../types';
import mnnBab1_5 from '../data/mnn1_bab1_5.json';
import mnnBab6_8 from '../data/mnn1_bab6_8.json';
import mnnBab9_10 from '../data/mnn1_bab9_10.json';
import { kataKerja, kataSifatI, kataSifatNa, kataBenda } from '../data/newMaterials';

import { allVocabularies } from '../data';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'users' | 'sessions' | 'difficult'>('users');
  const [activeUserTab, setActiveUserTab] = useState<'active' | 'banned'>('active');
  const [selectedUserForLogs, setSelectedUserForLogs] = useState<string | null>(null);
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionTypeFilter, setSessionTypeFilter] = useState<string>('all');
  const [sessionCategoryFilter, setSessionCategoryFilter] = useState<string>('all');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [difficultVocabs, setDifficultVocabs] = useState<Vocabulary[]>([]);
  const [userMap, setUserMap] = useState<Record<string, UserData>>({});
  const navigate = useNavigate();
  const { userData } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'sessions' || activeTab === 'difficult') {
      fetchData();
    }
  }, [activeTab, selectedUserForLogs]);

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
        try {
          let sessionsQ;
          if (selectedUserForLogs && selectedUserForLogs !== 'all') {
            sessionsQ = query(collection(db, 'study_sessions'), where('userId', '==', selectedUserForLogs));
          } else {
            sessionsQ = query(collection(db, 'study_sessions'), limit(300));
          }
          const sessionsSnap = await getDocs(sessionsQ);
          let userSessions = sessionsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as StudySession));
          userSessions.sort((a, b) => (b.startTime || 0) - (a.startTime || 0));
          setSessions(userSessions);
        } catch (sessionErr) {
          console.error("Error fetching study_sessions:", sessionErr);
        }
      }

      if (activeTab === 'difficult') {
        const statsSnap = await getDocs(collection(db, 'vocabStats'));
        
        let mappedVocabs = statsSnap.docs.map(d => {
           const data = d.data();
           const original = allVocabularies.find(v => v.id === d.id) || {} as any;
           return {
             id: d.id,
             jp: data.jp || original.jp || 'Unknown',
             romaji: data.romaji || original.romaji || '',
             id_translation: data.id_translation || original.id_translation || 'Unknown',
             category: data.category || original.category || 'Unknown',
             failCount: data.failCount || 0,
             hardCount: data.hardCount || 0
           } as Vocabulary;
        });
        
        const filteredAndSorted = mappedVocabs
          .filter(v => ((v.failCount || 0) > 0) || ((v.hardCount || 0) > 0))
          .sort((a, b) => ((b.failCount || 0) * 2 + (b.hardCount || 0)) - ((a.failCount || 0) * 2 + (a.hardCount || 0)));
        setDifficultVocabs(filteredAndSorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (uid: string, banStatus: boolean) => {
    if (window.confirm(banStatus ? 'Yakin ingin mem-ban pengguna ini?' : 'Yakin ingin membuka ban pengguna ini?')) {
      try {
        await updateDoc(doc(db, 'users', uid), { isBanned: banStatus });
        setUsers(users.map(u => u.uid === uid ? { ...u, isBanned: banStatus } : u));
      } catch (err) {
        console.error('Gagal mem-ban/unban user', err);
        alert('Gagal mem-ban/unban user');
      }
    }
  };


  const handleResetAllProgress = async () => {
    if (window.confirm('PERINGATAN KERAS: Yakin ingin mereset progress belajar SEMUA AKUN secara total? Data tidak dapat dikembalikan!')) {
      const pin = window.prompt('Masukkan kata sandi "RESETALL" untuk melanjutkan penghapusan total:');
      if (pin !== 'RESETALL') {
        alert('Kata sandi salah. Batal.');
        return;
      }
      setLoading(true);
      try {
        const deleteInBatches = async (collName: string) => {
          let hasMore = true;
          while (hasMore) {
            const q = query(collection(db, collName), limit(250));
            const snap = await getDocs(q);
            if (snap.docs.length === 0) {
              hasMore = false;
              break;
            }
            const batch = writeBatch(db);
            snap.docs.forEach(d => batch.delete(d.ref));
            await batch.commit();
            await new Promise(r => setTimeout(r, 1000)); // 1s delay to prevent resource exhaustion
          }
        };

        await deleteInBatches('user_progress');
        await deleteInBatches('study_sessions');
        await deleteInBatches('active_sessions');
        
        // Wipe local storage keys starting with quiz_state
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('quiz_state_')) {
            keys.push(key);
          }
        }
        keys.forEach(k => localStorage.removeItem(k));
        
        alert('Progress semua akun berhasil direset total!');
      } catch (error) {
        console.error(error);
        alert('Gagal mereset progress semua akun.');
      }
      setLoading(false);
    }
  };

  const handleResetProgress = async (uid: string) => {
    if (window.confirm('Yakin ingin mereset progress belajar pengguna ini? (Data riwayat akan terhapus)')) {
      setLoading(true);
      try {
        const progQ = query(collection(db, 'user_progress'), where('userId', '==', uid));
        const progSnap = await getDocs(progQ);
        for (const docSnap of progSnap.docs) {
          await deleteDoc(docSnap.ref);
        }
        
        const sessQ = query(collection(db, 'study_sessions'), where('userId', '==', uid));
        const sessSnap = await getDocs(sessQ);
        for (const docSnap of sessSnap.docs) {
          await deleteDoc(docSnap.ref);
        }
        
        try {
          const activeQ = query(collection(db, 'active_sessions'), where('userId', '==', uid));
          const activeSnap = await getDocs(activeQ);
          for (const docSnap of activeSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        } catch(e) {
          console.warn("Could not fetch active_sessions to delete", e);
        }
        
        const resetData = { 
          points: 0, 
          level: 1, 
          masteredVocabCount: 0, 
          totalStudyTime: 0,
          loginStreak: 1,
          loginHistory: []
        };
        await updateDoc(doc(db, 'users', uid), resetData);
        setUsers(users.map(u => u.uid === uid ? { ...u, ...resetData } : u));
        
        alert('Progress berhasil direset!');
      } catch (err) {
        console.error('Gagal reset progress', err);
        alert('Gagal reset progress: ' + (err.message || err));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChangeRole = async (uid: string, role: string) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', uid), { role });
      setUsers(users.map(u => u.uid === uid ? { ...u, role } as UserData : u));
    } catch (err) {
      console.error('Gagal mengubah role', err);
      alert('Gagal mengubah role');
    } finally {
      setLoading(false);
    }
  };

  const handleRenameUser = async (uid: string, currentName: string) => {
    const newName = window.prompt('Masukkan nama baru untuk pengguna ini:', currentName || '');
    if (newName !== null && newName.trim() !== '') {
      try {
        await updateDoc(doc(db, 'users', uid), { displayName: newName.trim() });
        setUsers(users.map(u => u.uid === uid ? { ...u, displayName: newName.trim() } : u));
      } catch (err) {
        console.error('Gagal mengganti nama', err);
        alert('Gagal mengganti nama');
      }
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini dari leaderboard dan database? (Akun auth mereka akan tetap ada)')) {
      setLoading(true);
      try {
        const deleteUserDocs = async (collName: string) => {
          let hasMore = true;
          while (hasMore) {
            const q = query(collection(db, collName), where('userId', '==', uid), limit(250));
            const snap = await getDocs(q);
            if (snap.docs.length === 0) {
              hasMore = false;
              break;
            }
            const batch = writeBatch(db);
            snap.docs.forEach(d => batch.delete(d.ref));
            await batch.commit();
            await new Promise(r => setTimeout(r, 1000));
          }
        };

        // Delete user_progress, study_sessions, active_sessions in batches
        await deleteUserDocs('user_progress');
        await deleteUserDocs('study_sessions');
        await deleteUserDocs('active_sessions');

        // Delete user doc
        await deleteDoc(doc(db, 'users', uid));
        setUsers(prev => prev.filter(u => u.uid !== uid));
      } catch (err) {
        console.error('Gagal menghapus user', err);
        alert('Gagal menghapus user: ' + (err.message || err));
      } finally {
        setLoading(false);
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


  const handleSeedNewMaterials = async () => {
    try {
      setLoading(true);
      setStatus('Menambahkan materi baru (Kata Kerja, Sifat, Benda)...');
      
      let count = 0;
      const categories = [
        { items: kataKerja, cat: 'Kata Kerja' },
        { items: kataSifatI, cat: 'Kata Sifat I' },
        { items: kataSifatNa, cat: 'Kata Sifat Na' },
        { items: kataBenda, cat: 'Kata Benda' }
      ];

      for (const group of categories) {
        for (const item of group.items) {
          const safeId = `${group.cat}_${item.jp}`.replace(/[^a-zA-Z0-9_]/g, '_');
          const docRef = doc(db, 'vocabularies', safeId);
          await setDoc(docRef, {
            jp: item.jp,
            romaji: "", // None provided in new material
            id_translation: item.id_translation || "",
            category: group.cat,
            createdAt: Date.now()
          });
          count++;
        }
      }
      
      setStatus(`Berhasil menambahkan ${count} kosakata baru!`);
    } catch (err: any) {
      console.error(err);
      setStatus('Gagal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleDynamicBackfill = async () => {
    try {
      setLoading(true);
      setStatus('Menambal data kategori yang hilang (Backfill)...');
      
      const progSnap = await getDocs(collection(db, 'user_progress'));
      let count = 0;
      
      const batch = writeBatch(db);
      
      progSnap.docs.forEach((d) => {
        const data = d.data();
        if (!data.category) {
          let cat = null;
          const v = allVocabularies.find(voc => voc.id === data.vocabId);
          if (v) cat = v.category;
          else if (data.vocabId && data.vocabId.includes('_')) {
             const parts = data.vocabId.split('_');
             parts.pop();
             cat = parts.join('_');
          }
          
          if (cat) {
            batch.update(doc(db, 'user_progress', d.id), { category: cat });
            count++;
          }
        }
      });
      
      if (count > 0) {
        await batch.commit();
        setStatus(`Berhasil menambal ${count} riwayat belajar!`);
      } else {
        setStatus('Semua riwayat belajar sudah memiliki kategori (Tidak ada yang ditambal).');
      }
    } catch (err: any) {
      console.error(err);
      setStatus('Gagal: ' + err.message);
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

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  const formatDateTime = (ms: number) => {
    return new Date(ms).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Derived data for sessions tab
  const sessionCategories = Array.from(new Set(sessions.map(s => s.category).filter(Boolean))) as string[];
  
  const filteredSessions = sessions.filter(s => {
    if (selectedUserForLogs && selectedUserForLogs !== 'all' && s.userId !== selectedUserForLogs) {
      return false;
    }
    if (sessionTypeFilter !== 'all' && s.type !== sessionTypeFilter) {
      return false;
    }
    if (sessionCategoryFilter !== 'all' && s.category !== sessionCategoryFilter) {
      return false;
    }
    if (sessionSearch.trim()) {
      const q = sessionSearch.toLowerCase();
      const u = userMap[s.userId];
      const userName = (u?.displayName || '').toLowerCase();
      const userEmail = (u?.email || '').toLowerCase();
      const categoryName = (s.category || '').toLowerCase();
      const typeName = (s.type || '').toLowerCase();
      const matchFailed = (s.failedVocabs || []).some(fv => 
        (fv.jp || '').toLowerCase().includes(q) || (fv.id_translation || '').toLowerCase().includes(q)
      );
      if (!userName.includes(q) && !userEmail.includes(q) && !categoryName.includes(q) && !typeName.includes(q) && !matchFailed) {
        return false;
      }
    }
    return true;
  });

  const totalSessionDuration = filteredSessions.reduce((acc, s) => acc + (s.totalDuration || 0), 0);
  const totalCorrectReviews = filteredSessions.reduce((acc, s) => acc + (s.correctCount || 0), 0);
  const totalIncorrectReviews = filteredSessions.reduce((acc, s) => acc + (s.incorrectCount || 0), 0);
  const totalAnswers = totalCorrectReviews + totalIncorrectReviews;
  const averageAccuracy = totalAnswers > 0 ? Math.round((totalCorrectReviews / totalAnswers) * 100) : 0;
  const uniqueActiveUsersCount = new Set(filteredSessions.map(s => s.userId)).size;

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Admin Panel</h1>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all text-slate-500 hover:text-slate-800 hover:bg-slate-200"
          >
            <LayoutDashboard size={16} /> Dashboard
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


      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Manajemen Pengguna</h2>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveUserTab('active')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeUserTab === 'active' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Aktif
              </button>
              <button
                onClick={() => setActiveUserTab('banned')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeUserTab === 'banned' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Di-banned
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold">Nama / Email</th>
                  <th className="p-4 font-bold text-center">Level / Streak</th>
                  <th className="p-4 font-bold text-center">Statistik Belajar</th>
                  <th className="p-4 font-bold">Last Login / Aktif</th>
                  <th className="p-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.filter(u => activeUserTab === 'active' ? !u.isBanned : u.isBanned).map((u, index) => (
                  <tr key={u.uid || index} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{u.displayName || u.email?.split('@')[0] || 'User'}</div>
                      <div className="text-slate-500 text-xs">{u.email}</div>
                      {u.role === 'admin' && <span className="inline-block mt-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">ADMIN</span>}
                    </td>
                    <td className="p-4 text-center">
                      <div className="bg-indigo-100 text-indigo-800 font-bold px-2 py-1 rounded text-xs inline-block mb-1">Lv. {u.level}</div>
                      <div className="font-bold text-rose-500 text-xs">🔥 {u.loginStreak || 1}</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="text-xs font-bold text-slate-700">Pts: {(u.points || 0).toLocaleString()}</div>
                      <div className="text-xs font-medium text-slate-600">Vocab: {u.masteredVocabCount}</div>
                      <div className="font-mono text-xs text-slate-500 mt-1">{formatTime(u.totalStudyTime)}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="text-slate-700 font-bold">{u.lastLoginDate || '-'}</div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wide mt-1">Aktif: {u.lastActiveDate ? formatDateTime(new Date(u.lastActiveDate).getTime()) : '-'}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        {/* Status Label Admin/SubAdmin */}
                        {(u.role === 'admin' || u.role === 'sub_admin') && (
                           <div className="text-[10px] font-bold px-2 py-0.5 rounded-md mb-1 w-fit bg-slate-100 text-slate-600">
                             {u.role === 'admin' ? 'Admin Utama' : 'Sub Admin'}
                           </div>
                        )}
                        
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {((userData?.role === 'admin') || (userData?.role === 'sub_admin' && u.role !== 'admin')) && (
                             <>
                               {u.role !== 'admin' && (
                                  <>
                                    {activeUserTab === 'active' ? (
                                      <>
                                        <button onClick={() => handleBanUser(u.uid, true)} className="px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap">
                                          Ban
                                        </button>
                                        <button onClick={() => handleResetProgress(u.uid)} className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap">
                                          Reset
                                        </button>
                                      </>
                                    ) : (
                                      <button onClick={() => handleBanUser(u.uid, false)} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap">
                                        Unban
                                      </button>
                                    )}
                                    <button onClick={() => handleRenameUser(u.uid, u.displayName || u.email || '')} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap" title="Ganti Nama">
                                      Ganti Nama
                                    </button>
                                    <button onClick={() => handleDeleteUser(u.uid)} className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition-colors" title="Hapus Akun">
                                      <Trash2 size={16} />
                                    </button>
                                    {userData?.role === 'admin' && (
                                      <>
                                        {u.role === 'sub_admin' ? (
                                          <button onClick={() => handleChangeRole(u.uid, 'user')} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap">
                                            Hapus Sub
                                          </button>
                                        ) : (
                                          <button onClick={() => handleChangeRole(u.uid, 'sub_admin')} className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap">
                                            Jadikan Sub
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </>
                               )}
                             </>
                          )}
                          {/* Allow Admin/SubAdmin to rename themselves and reset themselves */}
                          {u.uid === userData?.uid && (
                             <>
                                <button onClick={() => handleRenameUser(u.uid, u.displayName || u.email || '')} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap" title="Ganti Nama Sendiri">
                                  Ganti Nama (Saya)
                                </button>
                                <button onClick={() => handleResetProgress(u.uid)} className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap">
                                  Reset (Saya)
                                </button>
                             </>
                          )}
                          <button
                            onClick={() => {
                              setSelectedUserForLogs(u.uid);
                              setActiveTab('sessions');
                            }}
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap"
                            title="Lihat Log Belajar"
                          >
                            Log Belajar
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.filter(u => activeUserTab === 'active' ? !u.isBanned : u.isBanned).length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">Tidak ada data pengguna di kategori ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

            {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Activity className="text-indigo-600" size={24} />
                  Log Aktivitas Belajar Siswa
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Pantau riwayat sesi kuis, flashcard, dan remidial semua pengguna secara langsung.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData()}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
                  title="Segarkan Data"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  Segarkan
                </button>
              </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Sesi Terdata</div>
                <div className="text-2xl font-black text-slate-800">{filteredSessions.length}</div>
                <div className="text-[11px] text-slate-500 mt-1">Sesi latihan tersimpan</div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Durasi Belajar</div>
                <div className="text-2xl font-black text-indigo-600">{formatTime(totalSessionDuration)}</div>
                <div className="text-[11px] text-slate-500 mt-1">Waktu terakumulasi</div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rata-Rata Akurasi</div>
                <div className="text-2xl font-black text-emerald-600">{averageAccuracy}%</div>
                <div className="text-[11px] text-slate-500 mt-1">{totalCorrectReviews} benar / {totalAnswers} soal</div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Siswa Aktif</div>
                <div className="text-2xl font-black text-amber-600">{uniqueActiveUsersCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Akun yang berlatih</div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* User Filter Dropdown */}
                <div className="w-full sm:w-auto min-w-[200px]">
                  <select
                    value={selectedUserForLogs || 'all'}
                    onChange={(e) => setSelectedUserForLogs(e.target.value === 'all' ? null : e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">👥 Semua Pengguna ({users.length})</option>
                    {users.map(u => (
                      <option key={u.uid} value={u.uid}>
                        {u.displayName || u.email?.split('@')[0]} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter Dropdown */}
                <div className="w-full sm:w-auto">
                  <select
                    value={sessionTypeFilter}
                    onChange={(e) => setSessionTypeFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">🎯 Semua Tipe Sesi</option>
                    <option value="Kuis">Kuis</option>
                    <option value="Flashcard">Flashcard</option>
                    <option value="Kuis Remidial">Kuis Remidial</option>
                    <option value="Flashcard Remidial">Flashcard Remidial</option>
                    <option value="Review">Review</option>
                  </select>
                </div>

                {/* Category Filter Dropdown */}
                {sessionCategories.length > 0 && (
                  <div className="w-full sm:w-auto">
                    <select
                      value={sessionCategoryFilter}
                      onChange={(e) => setSessionCategoryFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">📚 Semua Materi / Bab</option>
                      {sessionCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[220px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari user, materi, kotoba..."
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Filter Active Pill Indicator */}
            {(selectedUserForLogs || sessionTypeFilter !== 'all' || sessionCategoryFilter !== 'all' || sessionSearch) && (
              <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 font-medium">Filter aktif:</span>
                {selectedUserForLogs && (
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg border border-indigo-200">
                    User: {userMap[selectedUserForLogs]?.displayName || userMap[selectedUserForLogs]?.email}
                    <button onClick={() => setSelectedUserForLogs(null)} className="hover:text-indigo-900 font-black ml-1">×</button>
                  </span>
                )}
                {sessionTypeFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 font-bold px-2.5 py-1 rounded-lg border border-violet-200">
                    Tipe: {sessionTypeFilter}
                    <button onClick={() => setSessionTypeFilter('all')} className="hover:text-violet-900 font-black ml-1">×</button>
                  </span>
                )}
                {sessionCategoryFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                    Materi: {sessionCategoryFilter}
                    <button onClick={() => setSessionCategoryFilter('all')} className="hover:text-amber-900 font-black ml-1">×</button>
                  </span>
                )}
                {sessionSearch && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                    Pencarian: "{sessionSearch}"
                    <button onClick={() => setSessionSearch('')} className="hover:text-slate-900 font-black ml-1">×</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedUserForLogs(null);
                    setSessionTypeFilter('all');
                    setSessionCategoryFilter('all');
                    setSessionSearch('');
                  }}
                  className="text-xs text-rose-600 font-bold hover:underline ml-2"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-bold">Siswa</th>
                    <th className="p-4 font-bold">Waktu</th>
                    <th className="p-4 font-bold">Tipe & Materi</th>
                    <th className="p-4 font-bold text-center">Durasi</th>
                    <th className="p-4 font-bold text-center">Soal & Hasil</th>
                    <th className="p-4 font-bold">Kendala / Soal Salah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSessions.map((s, index) => {
                    const u = userMap[s.userId];
                    const userName = u?.displayName || u?.email?.split('@')[0] || 'Unknown User';
                    const userInitial = (userName[0] || 'U').toUpperCase();
                    const totalCard = s.cardsReviewed || ((s.correctCount || 0) + (s.incorrectCount || 0)) || 0;
                    const accuracy = totalCard > 0 ? Math.round(((s.correctCount || 0) / totalCard) * 100) : 0;
                    
                    let typeBadgeClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
                    if (s.type?.includes('Flashcard')) {
                      typeBadgeClass = "bg-sky-50 text-sky-700 border-sky-200";
                    } else if (s.type?.includes('Remidial')) {
                      typeBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                    } else if (s.type?.includes('Review')) {
                      typeBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                    }

                    return (
                      <tr key={s.id || index} className="hover:bg-slate-50/80 transition-colors">
                        {/* Siswa */}
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedUserForLogs(s.userId)}
                            className="flex items-center gap-3 text-left group"
                            title="Klik untuk memfilter log siswa ini"
                          >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white font-black text-xs flex items-center justify-center shadow-sm">
                              {userInitial}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                {userName}
                              </div>
                              <div className="text-[11px] text-slate-400">{u?.email || s.userId}</div>
                            </div>
                          </button>
                        </td>

                        {/* Waktu */}
                        <td className="p-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                          <div>{formatDateTime(s.startTime)}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {s.endTime ? `${formatDuration(s.totalDuration)} sesi` : '-'}
                          </div>
                        </td>

                        {/* Tipe & Materi */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${typeBadgeClass}`}>
                              {s.type || 'Latihan'}
                            </span>
                          </div>
                          <div className="font-bold text-slate-800 text-xs">
                            {s.category || 'Umum'}
                          </div>
                        </td>

                        {/* Durasi */}
                        <td className="p-4 text-center whitespace-nowrap">
                          <span className="bg-slate-100 text-slate-700 font-mono text-xs font-bold px-2.5 py-1 rounded-lg">
                            {formatDuration(s.totalDuration)}
                          </span>
                        </td>

                        {/* Soal & Hasil */}
                        <td className="p-4 text-center">
                          <div className="font-bold text-xs">
                            <span className="text-emerald-600 font-black">{s.correctCount || 0}</span>
                            <span className="text-slate-400 mx-1">/</span>
                            <span className="text-rose-500 font-black">{s.incorrectCount || 0}</span>
                          </div>
                          <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                            {totalCard} Soal ({accuracy}%)
                          </div>
                        </td>

                        {/* Kendala / Soal Salah */}
                        <td className="p-4 max-w-xs">
                          {s.failedVocabs && s.failedVocabs.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {s.failedVocabs.map((fv, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center bg-rose-50 border border-rose-200 text-rose-700 text-[11px] px-2 py-0.5 rounded-md"
                                  title={fv.id_translation ? `${fv.jp}: ${fv.id_translation}` : fv.jp}
                                >
                                  <span className="font-bold mr-1">{fv.jp}</span>
                                  {fv.id_translation && (
                                    <span className="text-[10px] text-rose-500 opacity-80 max-w-[100px] truncate">({fv.id_translation})</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                              <CheckCircle2 size={13} />
                              Sempurna (100% Benar)
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredSessions.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <div className="max-w-md mx-auto flex flex-col items-center">
                          <BookOpen size={48} className="text-slate-300 mb-3" />
                          <p className="font-bold text-slate-700 text-base mb-1">
                            Tidak Ada Log Aktivitas Belajar
                          </p>
                          <p className="text-slate-500 text-xs mb-4">
                            {sessions.length === 0 
                              ? 'Belum ada data sesi belajar yang tercatat di database.'
                              : 'Tidak ada aktivitas belajar yang cocok dengan filter atau pencarian saat ini.'}
                          </p>
                          {(selectedUserForLogs || sessionTypeFilter !== 'all' || sessionCategoryFilter !== 'all' || sessionSearch) && (
                            <button
                              onClick={() => {
                                setSelectedUserForLogs(null);
                                setSessionTypeFilter('all');
                                setSessionCategoryFilter('all');
                                setSessionSearch('');
                              }}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                            >
                              Reset Semua Filter
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
