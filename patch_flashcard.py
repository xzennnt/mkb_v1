import re

with open('src/pages/Flashcard.tsx', 'r') as f:
    content = f.read()

# Find the spot to insert useEffect for saving state
hook_insert = """  useEffect(() => {
    if (!loading && initialVocabs.length > 0 && !isFinished && queue.length > 0) {
      localStorage.setItem('flashcard_state_' + category, JSON.stringify({
        queue,
        initialVocabs,
        sessionTotal,
        masteredCount,
        notRememberedIds
      }));
    } else if (isFinished || (sessionTotal === 0 && initialVocabs.length > 0)) {
      localStorage.removeItem('flashcard_state_' + category);
    }
  }, [queue, initialVocabs, sessionTotal, masteredCount, notRememberedIds, loading, isFinished, category]);
"""

# Insert before handleRating
content = content.replace("  const handleRating = async (isRemembered: boolean) => {", hook_insert + "\n  const handleRating = async (isRemembered: boolean) => {")

with open('src/pages/Flashcard.tsx', 'w') as f:
    f.write(content)
