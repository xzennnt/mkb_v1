import re

with open('src/types.ts', 'r') as f:
    content = f.read()

target = """  srsLevel: 'again' | 'hard' | 'good' | 'easy' | 'new';
  failCount?: number;
  easyCount?: number;
}"""

replacement = """  srsLevel: 'again' | 'hard' | 'good' | 'easy' | 'new';
  failCount?: number;
  easyCount?: number;
  
  // SRS Anki fields
  easeFactor?: number;
  step?: number;
  status?: 'learning' | 'review' | 'relearning';
}"""

if "easeFactor?:" not in content:
    content = content.replace(target, replacement)
    with open('src/types.ts', 'w') as f:
        f.write(content)
