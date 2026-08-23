import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

# Make sure writeBatch is imported
if 'writeBatch' not in content:
    content = content.replace("deleteDoc,", "deleteDoc, writeBatch,")

batch_reset_all = """
      setLoading(true);
      try {
        const deleteInBatches = async (collName: string) => {
          let hasMore = true;
          while (hasMore) {
            const q = query(collection(db, collName), limit(500));
            const snap = await getDocs(q);
            if (snap.docs.length === 0) {
              hasMore = false;
              break;
            }
            const batch = writeBatch(db);
            snap.docs.forEach(d => batch.delete(d.ref));
            await batch.commit();
          }
        };

        await deleteInBatches('user_progress');
        await deleteInBatches('study_sessions');
        await deleteInBatches('active_sessions');
"""

old_reset_all_try_block = """
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
"""

content = content.replace(old_reset_all_try_block, batch_reset_all)

batch_reset_single = """
      setLoading(true);
      try {
        const deleteUserDocs = async (collName: string) => {
          let hasMore = true;
          while (hasMore) {
            const q = query(collection(db, collName), where('userId', '==', uid), limit(500));
            const snap = await getDocs(q);
            if (snap.docs.length === 0) {
              hasMore = false;
              break;
            }
            const batch = writeBatch(db);
            snap.docs.forEach(d => batch.delete(d.ref));
            await batch.commit();
          }
        };

        await deleteUserDocs('user_progress');
        await deleteUserDocs('study_sessions');
        await deleteUserDocs('active_sessions');
"""

old_reset_single_try_block = """
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
        } catch(e) {}
"""

content = content.replace(old_reset_single_try_block, batch_reset_single)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)

