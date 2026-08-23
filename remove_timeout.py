import re

def remove_timeout(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    timeout_block = r"\s*// Wait a bit before next card\s*setTimeout\(\(\) => \{[\s\S]*?\}, 1500\);"
    content = re.sub(timeout_block, "", content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Removed timeout from {filepath}")

remove_timeout('src/pages/Quiz.tsx')
remove_timeout('src/pages/WeakQuiz.tsx')
remove_timeout('src/pages/Review.tsx')
