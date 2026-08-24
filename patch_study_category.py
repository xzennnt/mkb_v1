import re

with open('src/pages/Study.tsx', 'r') as f:
    content = f.read()

content = content.replace("category: category || 'Materi Baru',", "category: 'Campuran / Semua Materi',")

with open('src/pages/Study.tsx', 'w') as f:
    f.write(content)
