import re

with open('src/pages/Quiz.tsx', 'r') as f:
    content = f.read()

# Add import
if "import { calculatePoints }" not in content:
    content = content.replace("import { Vocabulary, StudySession, StudyReport } from '../types';", "import { Vocabulary, StudySession, StudyReport } from '../types';\nimport { calculatePoints } from '../utils/levelUtils';")

# Find points calculation
target = "const pointsGained = isCorrect ? 10 : 0;"
replace = "const pointsGained = isCorrect ? calculatePoints(10, userData?.loginStreak || 1) : 0;"

content = content.replace(target, replace)

with open('src/pages/Quiz.tsx', 'w') as f:
    f.write(content)

print("Quiz patched")
