import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

reset_all_func = """
  const handleResetAllProgress = async () => {
    if (window.confirm('PERINGATAN KERAS: Yakin ingin mereset progress belajar SEMUA AKUN secara total? Data tidak dapat dikembalikan!')) {
      const pin = window.prompt('Masukkan kata sandi "RESETALL" untuk melanjutkan penghapusan total:');
      if (pin !== 'RESETALL') {
        alert('Kata sandi salah. Batal.');
        return;
      }
      setLoading(true);
      try {
        const progSnap = await getDocs(collection(db, 'user_progress'));
        for (const docSnap of progSnap.docs) {
          await deleteDoc(docSnap.ref);
        }
        
        const sessSnap = await getDocs(collection(db, 'study_sessions'));
        for (const docSnap of sessSnap.docs) {
          await deleteDoc(docSnap.ref);
        }
        
        try {
          const activeSnap = await getDocs(collection(db, 'active_sessions'));
          for (const docSnap of activeSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        } catch(e) {}
        
        // Wipe local storage keys starting with quiz_state
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('quiz_state_')) {
            localStorage.removeItem(key);
          }
        }
        
        alert('Progress semua akun berhasil direset total!');
      } catch (error) {
        console.error(error);
        alert('Gagal mereset progress semua akun.');
      }
      setLoading(false);
    }
  };
"""

if "handleResetAllProgress" not in content:
    content = content.replace("  const handleResetProgress = async", reset_all_func + "\n  const handleResetProgress = async")

button_ui = """
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-800">Manajemen Pengguna</h2>
"""

new_button_ui = """
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800">Manajemen Pengguna</h2>
              {userData?.role === 'admin' && (
                <button 
                  onClick={handleResetAllProgress} 
                  className="bg-rose-100 text-rose-700 hover:bg-rose-200 hover:text-rose-800 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-rose-200"
                >
                  <Trash2 size={16} /> Reset Semua Progress Global
                </button>
              )}
            </div>
"""

content = content.replace(button_ui, new_button_ui)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)

print("Added handleResetAllProgress")
