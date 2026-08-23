import re
with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

old_code = """        const now = Date.now();
        let dueCount = 0;
        const hardMap: Record<string, number> = {};
        
        progSnap.forEach(docSnap => {
           const data = docSnap.data();
           if (data.nextReviewTime <= now) {
              dueCount++;
           }
           if (data.category && ((data.failCount && data.failCount > 0) || data.srsLevel === 'again' || data.srsLevel === 'hard')) {
              hardMap[data.category] = (hardMap[data.category] || 0) + 1;
           }
        });"""

new_code = """        const now = Date.now();
        let dueCount = 0;
        const hardMap: Record<string, number> = {};
        
        const seenVocabs = new Set<string>();
        const docs = progSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));
        docs.sort((a, b) => (b.nextReviewTime || 0) - (a.nextReviewTime || 0));

        docs.forEach(data => {
           if (seenVocabs.has(data.vocabId)) return;
           seenVocabs.add(data.vocabId);

           if (data.nextReviewTime <= now) {
              dueCount++;
           }
           if (data.category && ((data.failCount && data.failCount > 0) || data.srsLevel === 'again' || data.srsLevel === 'hard')) {
              hardMap[data.category] = (hardMap[data.category] || 0) + 1;
           }
        });"""

content = content.replace(old_code, new_code)
with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

