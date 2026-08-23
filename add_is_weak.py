import os
import re

def update_file(filepath, pattern, replacement):
    with open(filepath, 'r') as f:
        content = f.read()
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    with open(filepath, 'w') as f:
        f.write(content)

# In Quiz.tsx
update_file('src/pages/Quiz.tsx', 
    r"(srsLevel: srsResult.srsLevel\n    }, { merge: true })",
    r"srsLevel: srsResult.srsLevel,\n      ...(isCorrect ? {} : { isWeak: true })\n    }, { merge: true })")

# In Study.tsx
update_file('src/pages/Study.tsx',
    r"(srsLevel\n    };)",
    r"srsLevel,\n      ...(correct ? {} : { isWeak: true })\n    };")

# In Flashcard.tsx
update_file('src/pages/Flashcard.tsx',
    r"(const newProg: any = {\n.*?srsLevel: result.srsLevel\n        };)",
    r"\1\n        if (result.srsLevel === 'again' || result.srsLevel === 'hard') {\n          newProg.isWeak = true;\n        }")

# In ReviewFlashcard.tsx
update_file('src/pages/ReviewFlashcard.tsx',
    r"(const newProg: any = {\n.*?srsLevel: result.srsLevel\n        };)",
    r"\1\n        if (result.srsLevel === 'again' || result.srsLevel === 'hard') {\n          newProg.isWeak = true;\n        }")

# In ReviewFlashcardSRS.tsx
update_file('src/pages/ReviewFlashcardSRS.tsx',
    r"(const newProg: any = {\n.*?srsLevel: result.srsLevel\n        };)",
    r"\1\n        if (result.srsLevel === 'again' || result.srsLevel === 'hard') {\n          newProg.isWeak = true;\n        }")

print("Added isWeak tracking")
