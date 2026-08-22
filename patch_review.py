import re

with open('src/pages/Review.tsx', 'r') as f:
    content = f.read()

# Add import
if "import { calculatePoints }" not in content:
    content = content.replace("import { Vocabulary, UserProgress, StudySession, StudyReport } from '../types';", "import { Vocabulary, UserProgress, StudySession, StudyReport } from '../types';\nimport { calculatePoints } from '../utils/levelUtils';")

# Find points calculation
target = "const pointsGained = isCorrect ? 10 : 0;"
replace = "const pointsGained = isCorrect ? calculatePoints(10, userData?.loginStreak || 1) : 0;"

content = content.replace(target, replace)

with open('src/pages/Review.tsx', 'w') as f:
    f.write(content)

print("Review patched")
