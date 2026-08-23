import re
with open('src/pages/Study.tsx', 'r') as f:
    content = f.read()

old_code = """      const q = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
      const progSnap = await getDocs(q);
      const progMap: Record<string, UserProgress> = {};
      progSnap.docs.forEach(d => {
        const data = { ...d.data(), id: d.id } as UserProgress;
        progMap[data.vocabId] = data;
      });"""

new_code = """      const q = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
      const progSnap = await getDocs(q);
      const progMap: Record<string, UserProgress> = {};
      
      const docs = progSnap.docs.map(d => ({ ...d.data(), id: d.id } as UserProgress));
      docs.sort((a, b) => (b.nextReviewTime || 0) - (a.nextReviewTime || 0));

      docs.forEach(data => {
        if (!progMap[data.vocabId]) {
          progMap[data.vocabId] = data;
        }
      });"""

content = content.replace(old_code, new_code)
with open('src/pages/Study.tsx', 'w') as f:
    f.write(content)

