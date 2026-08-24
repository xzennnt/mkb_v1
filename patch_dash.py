import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { getCategoriesCount } from '../data';", "import { getCategoriesCount, allVocabularies } from '../data';")
with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

