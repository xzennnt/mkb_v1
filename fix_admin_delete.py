import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

old_delete = """  const handleDeleteUser = async (uid: string) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini dari leaderboard dan database? (Akun auth mereka akan tetap ada)')) {
      setLoading(true);
      try {
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
        
        try {
          const activeQ = query(collection(db, 'active_sessions'), where('userId', '==', uid));
          const activeSnap = await getDocs(activeQ);
          for (const docSnap of activeSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        } catch(e) {
          console.warn("Could not fetch active_sessions to delete", e);
        }

        // Delete user doc
        await deleteDoc(doc(db, 'users', uid));
        setUsers(users.filter(u => u.uid !== uid));
      } catch (err) {
        console.error('Gagal menghapus user', err);
        alert('Gagal menghapus user');
      } finally {
        setLoading(false);
      }
    }
  };"""

new_delete = """  const handleDeleteUser = async (uid: string) => {
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
        alert('Gagal menghapus user');
      } finally {
        setLoading(false);
      }
    }
  };"""

content = content.replace(old_delete, new_delete)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)

print("Done updating handleDeleteUser.")
