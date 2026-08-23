import re

# Dashboard.tsx dedupe
with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

old_dash_count = """        let dueCount = 0;
        const hardMap: Record<string, number> = {};
        progSnap.forEach(d => {
           const data = d.data();
           if (data.nextReviewTime && data.nextReviewTime <= now) {
             dueCount++;
           }
           if (data.category && ((data.failCount && data.failCount > 0) || data.srsLevel === 'again' || data.srsLevel === 'hard')) {
              hardMap[data.category] = (hardMap[data.category] || 0) + 1;
           }
        });"""

new_dash_count = """        let dueCount = 0;
        const hardMap: Record<string, number> = {};
        const seenVocabs = new Set<string>();
        
        // Sort docs so we prioritize canonical IDs or newest nextReviewTime
        const docs = progSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));
        docs.sort((a, b) => (b.nextReviewTime || 0) - (a.nextReviewTime || 0));
        
        docs.forEach(data => {
           if (seenVocabs.has(data.vocabId)) return;
           seenVocabs.add(data.vocabId);
           
           if (data.nextReviewTime && data.nextReviewTime <= now) {
             dueCount++;
           }
           if (data.category && ((data.failCount && data.failCount > 0) || data.srsLevel === 'again' || data.srsLevel === 'hard')) {
              hardMap[data.category] = (hardMap[data.category] || 0) + 1;
           }
        });"""

content = content.replace(old_dash_count, new_dash_count)
with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

# ReviewFlashcard.tsx dedupe
with open('src/pages/ReviewFlashcard.tsx', 'r') as f:
    content = f.read()

old_rev_fc_fetch = """      progSnap.docs.forEach(d => {
        const p = { ...d.data(), id: d.id } as UserProgress;
        pData[p.vocabId] = p;
        const v = allV.find(voc => voc.id === p.vocabId);
        if (v) {
          fetchedVocabs.push(v);
        }
      });"""

new_rev_fc_fetch = """      const docs = progSnap.docs.map(d => ({ ...d.data(), id: d.id } as UserProgress));
      docs.sort((a, b) => b.nextReviewTime - a.nextReviewTime);
      
      const seenVocabs = new Set<string>();
      
      docs.forEach(p => {
        if (seenVocabs.has(p.vocabId)) return;
        seenVocabs.add(p.vocabId);
        pData[p.vocabId] = p;
        const v = allV.find(voc => voc.id === p.vocabId);
        if (v) {
          fetchedVocabs.push(v);
        }
      });"""
      
content = content.replace(old_rev_fc_fetch, new_rev_fc_fetch)
with open('src/pages/ReviewFlashcard.tsx', 'w') as f:
    f.write(content)

# Review.tsx dedupe
with open('src/pages/Review.tsx', 'r') as f:
    content = f.read()

old_rev_fetch = """      const pData: Record<string, UserProgress> = {};
      const baseCards: Vocabulary[] = [];
      
      progSnap.docs.forEach(d => {
        const p = { ...d.data(), id: d.id } as UserProgress;
        pData[p.vocabId] = p;
        const v = allV.find(voc => voc.id === p.vocabId);
        if (v) {
          baseCards.push(v);
        }
      });"""
      
new_rev_fetch = """      const pData: Record<string, UserProgress> = {};
      const baseCards: Vocabulary[] = [];
      
      const docs = progSnap.docs.map(d => ({ ...d.data(), id: d.id } as UserProgress));
      docs.sort((a, b) => b.nextReviewTime - a.nextReviewTime);
      
      const seenVocabs = new Set<string>();
      
      docs.forEach(p => {
        if (seenVocabs.has(p.vocabId)) return;
        seenVocabs.add(p.vocabId);
        pData[p.vocabId] = p;
        const v = allV.find(voc => voc.id === p.vocabId);
        if (v) {
          baseCards.push(v);
        }
      });"""

content = content.replace(old_rev_fetch, new_rev_fetch)
with open('src/pages/Review.tsx', 'w') as f:
    f.write(content)

