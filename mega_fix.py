import re

with open('src/pages/Quiz.tsx', 'r') as f:
    quiz_content = f.read()

# Fix timeSpentSec
target_quiz = """    // --- LONG-TERM MEMORY (SRS) UPDATE ---
    const prevProgress = userProgressMap[currentVocab.id];
    const srsResult = calculateNextReview(timeSpentSec, isCorrect, prevProgress?.interval || 0);"""
replacement_quiz = """    // --- LONG-TERM MEMORY (SRS) UPDATE ---
    const timeSpentSec = timeSpentMs / 1000;
    const prevProgress = userProgressMap[currentVocab.id];
    const srsResult = calculateNextReview(timeSpentSec, isCorrect, prevProgress?.interval || 0);"""

quiz_content = quiz_content.replace(target_quiz, replacement_quiz)

# Remove the duplicate timeSpentSec declaration
quiz_content = re.sub(r"const timeSpentSec = timeSpentMs / 1000;\s*const pointsGained", "const pointsGained", quiz_content)

with open('src/pages/Quiz.tsx', 'w') as f:
    f.write(quiz_content)


with open('src/pages/Review.tsx', 'r') as f:
    review_content = f.read()

# Fix timeSpentSec
review_content = review_content.replace(target_quiz, replacement_quiz)
review_content = re.sub(r"const timeSpentSec = timeSpentMs / 1000;\s*const pointsGained", "const pointsGained", review_content)

# Replace all quiz_state_category_sessionIndex
review_content = re.sub(r"quiz_state_'\s*\+\s*category\s*\+\s*'_'\s*\+\s*sessionIndex", "review_state'", review_content)

# Replace remaining bare 'category' variables with 'Review'
review_content = re.sub(r"(?<!:)category\s*===\s*undefined", "false", review_content)
review_content = re.sub(r"category!", "'Review'", review_content)
review_content = re.sub(r"encodeURIComponent\(category\)", "'review'", review_content)
review_content = re.sub(r"\+ category \+", "+ 'Review' +", review_content)

with open('src/pages/Review.tsx', 'w') as f:
    f.write(review_content)

print("Mega fix done")
