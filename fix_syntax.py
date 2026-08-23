import re

with open('src/pages/Quiz.tsx', 'r') as f:
    content = f.read()
content = content.replace("}, { merge: true })).catch(console.error);", "}, { merge: true }).catch(console.error);")
with open('src/pages/Quiz.tsx', 'w') as f:
    f.write(content)

with open('src/pages/Study.tsx', 'r') as f:
    content = f.read()
content = content.replace("}, { merge: true })", "}, { merge: true })")
# Wait, let's just make sure there are no other syntax errors.
