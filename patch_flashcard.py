import re
with open('src/pages/Flashcard.tsx', 'r') as f:
    content = f.read()

old_code = """        const progSnap = await getDocs(progQ);
        const pData: Record<string, UserProgress> = {};
        
        let mCount = 0;
        progSnap.docs.forEach(d => {
          const p = { ...d.data(), id: d.id } as UserProgress;
          pData[p.vocabId] = p;
        });"""

new_code = """        const progSnap = await getDocs(progQ);
        const pData: Record<string, UserProgress> = {};
        
        let mCount = 0;
        
        const docs = progSnap.docs.map(d => ({ ...d.data(), id: d.id } as UserProgress));
        docs.sort((a, b) => (b.nextReviewTime || 0) - (a.nextReviewTime || 0));

        docs.forEach(p => {
          if (!pData[p.vocabId]) {
            pData[p.vocabId] = p;
          }
        });"""

content = content.replace(old_code, new_code)
with open('src/pages/Flashcard.tsx', 'w') as f:
    f.write(content)

