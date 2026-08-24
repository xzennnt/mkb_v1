import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

dynamic_fix = """           let pCat = data.category;
           if (!pCat) {
             const v = allVocabularies.find(voc => voc.id === data.vocabId);
             if (v) pCat = v.category;
             
             // Dynamic Backfill: Fire and forget to fix the DB when we encounter a broken one
             if (pCat && data.id) {
               updateDoc(doc(db, 'user_progress', data.id), { category: pCat }).catch(() => {});
             }
           }"""

content = content.replace("""           let pCat = data.category;
           if (!pCat) {
             const v = allVocabularies.find(voc => voc.id === data.vocabId);
             if (v) pCat = v.category;
           }""", dynamic_fix)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
