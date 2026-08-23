import re
with open('src/pages/Quiz.tsx', 'r') as f:
    content = f.read()

old_code = """        const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
        const progSnap = await getDocs(progQ);
        const pMap: Record<string, any> = {};
        progSnap.docs.forEach(d => {
          pMap[d.data().vocabId] = d.data();
        });"""

new_code = """        const progQ = query(collection(db, 'user_progress'), where('userId', '==', currentUser.uid));
        const progSnap = await getDocs(progQ);
        const pMap: Record<string, any> = {};
        
        const docs = progSnap.docs.map(d => ({ ...d.data(), id: d.id } as any));
        docs.sort((a, b) => (b.nextReviewTime || 0) - (a.nextReviewTime || 0));
        
        docs.forEach(p => {
          if (!pMap[p.vocabId]) pMap[p.vocabId] = p;
        });"""

content = content.replace(old_code, new_code)
with open('src/pages/Quiz.tsx', 'w') as f:
    f.write(content)

