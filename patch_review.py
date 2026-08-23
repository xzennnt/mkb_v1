import re
with open('src/pages/Review.tsx', 'r') as f:
    content = f.read()

old_code = """      progSnap.docs.forEach(d => {
        const data = d.data();
        pMap[data.vocabId] = data;
        const v = allV.find(voc => voc.id === data.vocabId);
        if (v) {
          baseCards.push(v);
        }
      });"""

new_code = """      const docs = progSnap.docs.map(d => ({ ...d.data(), id: d.id } as any));
      docs.sort((a, b) => (b.nextReviewTime || 0) - (a.nextReviewTime || 0));
      
      docs.forEach(data => {
        if (!pMap[data.vocabId]) {
          pMap[data.vocabId] = data;
          const v = allV.find(voc => voc.id === data.vocabId);
          if (v) {
            baseCards.push(v);
          }
        }
      });"""

content = content.replace(old_code, new_code)
with open('src/pages/Review.tsx', 'w') as f:
    f.write(content)

