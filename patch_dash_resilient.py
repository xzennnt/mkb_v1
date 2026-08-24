import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

old_dash = """           if (data.category && ((data.failCount && data.failCount > 0) || data.srsLevel === 'again' || data.srsLevel === 'hard')) {
              hardMap[data.category] = (hardMap[data.category] || 0) + 1;
           }"""

new_dash = """           let pCat = data.category;
           if (!pCat) {
             const v = allVocabularies.find(voc => voc.id === data.vocabId);
             if (v) pCat = v.category;
           }
           if (pCat && ((data.failCount && data.failCount > 0) || data.srsLevel === 'again' || data.srsLevel === 'hard')) {
              hardMap[pCat] = (hardMap[pCat] || 0) + 1;
           }"""

content = content.replace(old_dash, new_dash)
with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
