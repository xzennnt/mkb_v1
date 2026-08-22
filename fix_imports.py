import re

def patch(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    if "import { calculatePoints }" not in content:
        content = content.replace("import { db } from '../lib/firebase';", "import { db } from '../lib/firebase';\nimport { calculatePoints } from '../utils/levelUtils';")
    
    with open(filename, 'w') as f:
        f.write(content)

patch('src/pages/Quiz.tsx')
patch('src/pages/Review.tsx')
patch('src/pages/Study.tsx')
