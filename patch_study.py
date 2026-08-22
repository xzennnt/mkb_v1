import re

with open('src/pages/Study.tsx', 'r') as f:
    content = f.read()

# Add import
if "import { calculatePoints }" not in content:
    content = content.replace("import { Vocabulary, StudySession, StudyReport } from '../types';", "import { Vocabulary, StudySession, StudyReport } from '../types';\nimport { calculatePoints } from '../utils/levelUtils';")

# Replace existing multiplier logic in Study.tsx
# "const multiplier = timeSpentSec <= 5 ? 1.5 : (timeSpentSec <= 10 ? 1 : 0.5);"
# "const pointsGained = Math.round(basePoints * multiplier);"

target = """    const basePoints = 5;
    const timeSpentSec = timeSpentMs / 1000;
    const multiplier = timeSpentSec <= 5 ? 1.5 : (timeSpentSec <= 10 ? 1 : 0.5);
    const pointsGained = Math.round(basePoints * multiplier);"""

replace = """    const basePoints = 5;
    const timeSpentSec = timeSpentMs / 1000;
    const speedMultiplier = timeSpentSec <= 5 ? 1.5 : (timeSpentSec <= 10 ? 1 : 0.5);
    const pointsGained = calculatePoints(Math.round(basePoints * speedMultiplier), userData?.loginStreak || 1);"""

content = content.replace(target, replace)

with open('src/pages/Study.tsx', 'w') as f:
    f.write(content)

print("Study patched")
