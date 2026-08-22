import re

with open('src/pages/ReviewFlashcard.tsx', 'r') as f:
    content = f.read()

# Find the spot to insert useEffect for saving state
hook_insert = """  useEffect(() => {
    if (!loading && initialVocabs.length > 0 && !isFinished && queue.length > 0) {
      localStorage.setItem('review_flashcard_state', JSON.stringify({
        queue,
        initialVocabs,
        sessionTotal,
        masteredCount,
        notRememberedIds
      }));
    } else if (isFinished || (sessionTotal === 0 && initialVocabs.length > 0)) {
      localStorage.removeItem('review_flashcard_state');
    }
  }, [queue, initialVocabs, sessionTotal, masteredCount, notRememberedIds, loading, isFinished]);
"""

# Insert before handleRating
content = content.replace("  const handleRating = async (isRemembered: boolean) => {", hook_insert + "\n  const handleRating = async (isRemembered: boolean) => {")

# Also fix the removeItem inside handleReset because it had a typo
content = content.replace("localStorage.removeItem('flashcard_state_Review');", "localStorage.removeItem('review_flashcard_state');")

with open('src/pages/ReviewFlashcard.tsx', 'w') as f:
    f.write(content)
