import re

with open('src/lib/srs.ts', 'r') as f:
    content = f.read()

content = "import { Vocabulary } from '../types';\n" + content.replace("import { Vocabulary } from '../types';\n", "")

with open('src/lib/srs.ts', 'w') as f:
    f.write(content)
