import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

old_reset = """  const handleResetProgress = async (uid: string) => {
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

        const resetData = {"""

new_reset = """  const handleResetProgress = async (uid: string) => {
    if (window.confirm('Yakin ingin mereset progress belajar pengguna ini? (Data riwayat akan terhapus)')) {
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

        await deleteUserDocs('user_progress');
        await deleteUserDocs('study_sessions');
        await deleteUserDocs('active_sessions');

        const resetData = {"""

content = content.replace(old_reset, new_reset)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)
