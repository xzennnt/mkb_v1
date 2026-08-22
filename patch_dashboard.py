import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace(
    "import { collection, query, getDocs, where, limit } from 'firebase/firestore';",
    "import { collection, query, getDocs, where, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore';"
)

# Add handleResetMyProgress
reset_func = """
  const handleResetMyProgress = async () => {
    if (!userData) return;
    if (window.confirm('Yakin ingin mereset progress belajar Anda untuk penelitian? (Semua riwayat belajar akan terhapus)')) {
      try {
        const uid = userData.uid;
        
        // Delete user_progress
        const progQ = query(collection(db, 'user_progress'), where('userId', '==', uid));
        const progSnap = await getDocs(progQ);
        for (const docSnap of progSnap.docs) {
          await deleteDoc(docSnap.ref);
        }
        
        // Delete study_sessions
        const sessQ = query(collection(db, 'study_sessions'), where('userId', '==', uid));
        const sessSnap = await getDocs(sessQ);
        for (const docSnap of sessSnap.docs) {
          await deleteDoc(docSnap.ref);
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
        alert('Progress berhasil direset!');
        window.location.reload();
      } catch (err) {
        console.error('Gagal reset progress', err);
        alert('Gagal reset progress');
      }
    }
  };
"""

content = content.replace("const navigate = useNavigate();", "const navigate = useNavigate();\n" + reset_func)

# Add button
old_buttons = """          <button onClick={() => navigate('/admin')} className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">
            Ke Admin Panel
          </button>"""
new_buttons = """          <div className="flex items-center gap-2">
            {userData.role === 'admin' && (
              <button onClick={handleResetMyProgress} className="bg-rose-500 hover:bg-rose-600 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">
                Reset Progress Saya
              </button>
            )}
            <button onClick={() => navigate('/admin')} className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">
              Ke Admin Panel
            </button>
          </div>"""

content = content.replace(old_buttons, new_buttons)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
