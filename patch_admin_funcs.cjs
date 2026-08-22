const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

const importTarget = `import { collection, setDoc, doc, getDocs, query, orderBy, limit, deleteDoc } from 'firebase/firestore';`;
const importReplacement = `import { collection, setDoc, doc, getDocs, query, orderBy, limit, deleteDoc, where, updateDoc } from 'firebase/firestore';`;
content = content.replace(importTarget, importReplacement);

const stateTarget = `const [activeTab, setActiveTab] = useState<'upload' | 'users' | 'sessions' | 'difficult'>('upload');`;
const stateReplacement = `const [activeTab, setActiveTab] = useState<'upload' | 'users' | 'sessions' | 'difficult'>('upload');
  const [activeUserTab, setActiveUserTab] = useState<'active' | 'banned'>('active');`;
content = content.replace(stateTarget, stateReplacement);

const funcsTarget = `  const handleDeleteUser = async (uid: string) => {`;
const funcsReplacement = `  const handleBanUser = async (uid: string, banStatus: boolean) => {
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
        
        await updateDoc(doc(db, 'users', uid), { points: 0, level: 1, masteredVocabCount: 0, totalStudyTime: 0 });
        setUsers(users.map(u => u.uid === uid ? { ...u, points: 0, level: 1, masteredVocabCount: 0, totalStudyTime: 0 } : u));
        
        alert('Progress berhasil direset!');
      } catch (err) {
        console.error('Gagal reset progress', err);
        alert('Gagal reset progress');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteUser = async (uid: string) => {`;
content = content.replace(funcsTarget, funcsReplacement);

fs.writeFileSync('src/pages/Admin.tsx', content);
console.log('Functions patched');
