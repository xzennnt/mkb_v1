import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

old_delete = """        const sessQ = query(collection(db, 'study_sessions'), where('userId', '==', uid));
        const sessSnap = await getDocs(sessQ);
        for (const docSnap of sessSnap.docs) {
          await deleteDoc(docSnap.ref);
        }"""
new_delete = """        const sessQ = query(collection(db, 'study_sessions'), where('userId', '==', uid));
        const sessSnap = await getDocs(sessQ);
        for (const docSnap of sessSnap.docs) {
          await deleteDoc(docSnap.ref);
        }
        
        const activeQ = query(collection(db, 'active_sessions'));
        const activeSnap = await getDocs(activeQ);
        for (const docSnap of activeSnap.docs) {
          if (docSnap.id.startsWith(uid + '_')) {
            await deleteDoc(docSnap.ref);
          }
        }"""
content = content.replace(old_delete, new_delete)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)
