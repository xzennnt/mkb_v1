import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

old_logic = """    if (window.confirm('Yakin ingin mereset progress belajar Anda untuk penelitian? (Semua riwayat belajar akan terhapus)')) {
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
        
        // Delete active_sessions
        try {
          const activeQ = query(collection(db, 'active_sessions'), where('userId', '==', uid));
          const activeSnap = await getDocs(activeQ);
          for (const docSnap of activeSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        } catch (e) {
          console.warn("Could not fetch active_sessions to delete", e);
        }
        
        // Clear all local states so it doesn't resume from old sessions
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('flashcard_state_') || key.startsWith('quiz_state_') || key.startsWith('review_flashcard_state')) {
            localStorage.removeItem(key);
          }
        });
        
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
    }"""

new_logic = """    if (window.confirm('Yakin ingin mereset progress belajar Anda untuk penelitian? (Semua riwayat belajar akan terhapus)')) {
      try {
        const uid = userData.uid;
        
        try {
          const progQ = query(collection(db, 'user_progress'), where('userId', '==', uid));
          const progSnap = await getDocs(progQ);
          for (const docSnap of progSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        } catch(e: any) {
          throw new Error("Gagal hapus user_progress: " + e.message);
        }
        
        try {
          const sessQ = query(collection(db, 'study_sessions'), where('userId', '==', uid));
          const sessSnap = await getDocs(sessQ);
          for (const docSnap of sessSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        } catch(e: any) {
          throw new Error("Gagal hapus study_sessions: " + e.message);
        }
        
        try {
          const activeQ = query(collection(db, 'active_sessions'), where('userId', '==', uid));
          const activeSnap = await getDocs(activeQ);
          for (const docSnap of activeSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        } catch (e) {
          console.warn("Could not fetch active_sessions to delete", e);
        }
        
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('flashcard_state_') || key.startsWith('quiz_state_') || key.startsWith('review_flashcard_state')) {
            localStorage.removeItem(key);
          }
        });
        
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
        } catch(e: any) {
          throw new Error("Gagal update users: " + e.message);
        }
        alert('Progress berhasil direset!');
        window.location.reload();
      } catch (err: any) {
        console.error('Gagal reset progress', err);
        alert('Gagal reset progress: ' + (err.message || err));
      }
    }"""

content = content.replace(old_logic, new_logic)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
