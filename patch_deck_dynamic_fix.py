import re

with open('src/pages/DeckView.tsx', 'r') as f:
    content = f.read()

dynamic_fix = """        Object.values(pMap).forEach(p => {
          let pCat = p.category;
          if (!pCat) {
            const v = allVocabularies.find(voc => voc.id === p.vocabId);
            if (v) pCat = v.category;
            
            // Dynamic Backfill: Fire and forget to fix the DB
            if (pCat && p.id) {
               updateDoc(doc(db, 'user_progress', p.id), { category: pCat }).catch(() => {});
            }
          }"""

content = content.replace("""        Object.values(pMap).forEach(p => {
          let pCat = p.category;
          if (!pCat) {
            const v = allVocabularies.find(voc => voc.id === p.vocabId);
            if (v) pCat = v.category;
          }""", dynamic_fix)

content = content.replace("import { collection, query, where, getDocs } from 'firebase/firestore';", "import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';")

with open('src/pages/DeckView.tsx', 'w') as f:
    f.write(content)
