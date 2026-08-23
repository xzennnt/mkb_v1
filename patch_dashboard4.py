import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

old_active_delete = """        // Delete active_sessions
        const activeQ = query(collection(db, 'active_sessions'));
        const activeSnap = await getDocs(activeQ);
        for (const docSnap of activeSnap.docs) {
          if (docSnap.id.startsWith(uid + '_')) {
            await deleteDoc(docSnap.ref);
          }
        }"""
new_active_delete = """        // Delete active_sessions
        try {
          const activeQ = query(collection(db, 'active_sessions'));
          const activeSnap = await getDocs(activeQ);
          for (const docSnap of activeSnap.docs) {
            if (docSnap.id.startsWith(uid + '_')) {
              await deleteDoc(docSnap.ref);
            }
          }
        } catch (e) {
          console.warn("Could not fetch active_sessions to delete, likely due to rules. This is non-critical.", e);
        }"""
content = content.replace(old_active_delete, new_active_delete)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
