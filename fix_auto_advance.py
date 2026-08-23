import re

def revert_auto_advance(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Remove the Auto-advance useEffect
    auto_advance_pattern = r"\s*// Auto-advance if stuck \(e\.g\. after reload\)\s*useEffect\(\(\) => \{[\s\S]*?\}, \[selectedAnswer, currentIndex, isFinished\]\);"
    content = re.sub(auto_advance_pattern, "", content)

    # 2. Add setTimeout back to handleAnswer
    handle_answer_end_pattern = r"(    // --- LONG-TERM MEMORY \(SRS\) UPDATE ---[\s\S]*?    setReports[\s\S]*?)(  \};\n\n  const finishSession)"
    
    # Wait, the exact content of handleAnswer end varies by file (Quiz, WeakQuiz, Review).
    # Let's just find the end of handleAnswer and inject the setTimeout.
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Removed auto-advance from {filepath}")

revert_auto_advance('src/pages/Quiz.tsx')
revert_auto_advance('src/pages/WeakQuiz.tsx')
revert_auto_advance('src/pages/Review.tsx')

