import re

# Update DeckView.tsx
with open('src/pages/DeckView.tsx', 'r') as f:
    content = f.read()

old_wcount = """        let wCount = 0;
        Object.values(pMap).forEach(p => {
          if (p.isWeak && (p.category === category || category === 'Review')) {
            wCount++;
          }
        });"""

new_wcount = """        let wCount = 0;
        Object.values(pMap).forEach(p => {
          let pCat = p.category;
          if (!pCat) {
            const v = allVocabularies.find(voc => voc.id === p.vocabId);
            if (v) pCat = v.category;
          }
          if (p.isWeak && (pCat === category || category === 'Review')) {
            wCount++;
          }
        });"""

content = content.replace(old_wcount, new_wcount)
with open('src/pages/DeckView.tsx', 'w') as f:
    f.write(content)

# Update WeakFlashcard.tsx
with open('src/pages/WeakFlashcard.tsx', 'r') as f:
    content = f.read()

old_wfc = """      docs.forEach(data => {
        if (category && data.category !== category && category !== 'Review') return;
        const v = allVocabularies.find(voc => voc.id === data.vocabId);
        if (v) baseCards.push(v);
      });"""

new_wfc = """      docs.forEach(data => {
        let pCat = data.category;
        const v = allVocabularies.find(voc => voc.id === data.vocabId);
        if (!pCat && v) pCat = v.category;
        
        if (category && pCat !== category && category !== 'Review') return;
        if (v) baseCards.push(v);
      });"""

content = content.replace(old_wfc, new_wfc)
with open('src/pages/WeakFlashcard.tsx', 'w') as f:
    f.write(content)

# Update WeakQuiz.tsx
with open('src/pages/WeakQuiz.tsx', 'r') as f:
    content = f.read()

old_wq = """      docs.forEach(data => {
        if (category && data.category !== category && category !== 'Review') return;
        const v = allV.find(voc => voc.id === data.vocabId);
        if (v) baseCards.push(v);
      });"""

new_wq = """      docs.forEach(data => {
        let pCat = data.category;
        const v = allV.find(voc => voc.id === data.vocabId);
        if (!pCat && v) pCat = v.category;
        
        if (category && pCat !== category && category !== 'Review') return;
        if (v) baseCards.push(v);
      });"""

content = content.replace(old_wq, new_wq)
with open('src/pages/WeakQuiz.tsx', 'w') as f:
    f.write(content)
