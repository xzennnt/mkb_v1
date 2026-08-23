import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

old_logic = """    if (window.confirm('Yakin ingin mereset progress belajar pengguna ini? (Data riwayat akan terhapus)')) {
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
      } catch (err: any) {
        console.error('Gagal reset progress', err);
        alert('Gagal reset progress: ' + (err.message || err));
      } finally {
        setLoading(false);
      }
    }"""

new_logic = """    if (window.confirm('Yakin ingin mereset progress belajar pengguna ini? (Data riwayat akan terhapus)')) {
      setLoading(true);
      try {
        try {
          const progQ = query(collection(db, 'user_progress'), where('userId', '==', uid));
          const progSnap = await getDocs(progQ);
          for (const docSnap of progSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        } catch (e: any) {
          throw new Error("Gagal hapus user_progress: " + e.message);
        }
        
        try {
          const sessQ = query(collection(db, 'study_sessions'), where('userId', '==', uid));
          const sessSnap = await getDocs(sessQ);
          for (const docSnap of sessSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        } catch (e: any) {
          throw new Error("Gagal hapus study_sessions: " + e.message);
        }
        
        try {
          const activeQ = query(collection(db, 'active_sessions'), where('userId', '==', uid));
          const activeSnap = await getDocs(activeQ);
          for (const docSnap of activeSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        } catch(e: any) {
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
        try {
          await updateDoc(doc(db, 'users', uid), resetData);
        } catch (e: any) {
          throw new Error("Gagal update users: " + e.message);
        }
        setUsers(users.map(u => u.uid === uid ? { ...u, ...resetData } : u));
        
        alert('Progress berhasil direset!');
      } catch (err: any) {
        console.error('Gagal reset progress', err);
        alert('Gagal reset progress: ' + (err.message || err));
      } finally {
        setLoading(false);
      }
    }"""

content = content.replace(old_logic, new_logic)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)
