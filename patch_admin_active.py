import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

old_code = """        try {
          const activeQ = query(collection(db, 'active_sessions'));
          const activeSnap = await getDocs(activeQ);
          for (const docSnap of activeSnap.docs) {
            if (docSnap.id.startsWith(uid + '_')) {
              await deleteDoc(docSnap.ref);
            }
          }
        } catch(e) {
          console.warn("Could not fetch active_sessions to delete, likely due to rules. This is non-critical.", e);
        }"""
new_code = """        try {
          const activeQ = query(collection(db, 'active_sessions'), where('userId', '==', uid));
          const activeSnap = await getDocs(activeQ);
          for (const docSnap of activeSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        } catch(e) {
          console.warn("Could not fetch active_sessions to delete", e);
        }"""
content = content.replace(old_code, new_code)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)
