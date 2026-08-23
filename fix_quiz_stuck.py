import re

def fix_stuck(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            
        # Add a useEffect to auto-advance if stuck
        if "useEffect(() => {\n    if (selectedAnswer !== null" not in content:
            auto_advance = """
  // Auto-advance if stuck (e.g. after reload)
  useEffect(() => {
    if (selectedAnswer !== null && !isFinished) {
      const timer = setTimeout(() => {
        if (currentIndex + 1 < sessionCards.length) {
          setCurrentIndex(prev => prev + 1);
          setupCard(sessionCards[currentIndex + 1], allVocabs || [], directions[currentIndex + 1] || directions[currentIndex]);
        } else {
          finishSession();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedAnswer, currentIndex, isFinished]);
"""
            # find where to insert it (after useEffect that saves state)
            content = content.replace("  const setupCard = (vocab", auto_advance + "\n  const setupCard = (vocab")
            
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Fixed {filepath}")
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")

fix_stuck('src/pages/Quiz.tsx')
fix_stuck('src/pages/WeakQuiz.tsx')
fix_stuck('src/pages/Review.tsx')

