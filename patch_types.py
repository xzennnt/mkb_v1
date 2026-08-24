import re

with open('src/types.ts', 'r') as f:
    content = f.read()

new_fields = """  isWeak?: boolean;
  weakFlashcard?: boolean;
  weakQuiz?: boolean;"""

if "isWeak?: boolean;" in content:
    content = content.replace("isWeak?: boolean;", new_fields)
else:
    content = content.replace("export interface UserProgress {", "export interface UserProgress {\n" + new_fields)

with open('src/types.ts', 'w') as f:
    f.write(content)

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { formatCategoryName } from '../data';", "import { formatCategoryName, allVocabularies } from '../data';")
with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

