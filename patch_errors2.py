import re

def replace_in_file(filename, old_str, new_str):
    with open(filename, 'r') as f:
        content = f.read()
    content = content.replace(old_str, new_str)
    with open(filename, 'w') as f:
        f.write(content)

# src/data/index.ts
replace_in_file('src/data/index.ts', 
"""const additionalVocabs = [
  {
    category: 'MNN1_Bab1',
    jp: 'わたし',
    id_translation: 'saya'
  },""", 
"""const additionalVocabs: any[] = [
  {
    category: 'MNN1_Bab1',
    jp: 'わたし',
    id_translation: 'saya'
  },""")

# src/pages/Quiz.tsx
replace_in_file('src/pages/Quiz.tsx', "reps: (prevProgress?.reps || 0) + srsResult.reps", "reps: (prevProgress?.reps || 0) + (srsResult as any).reps")

# src/pages/Review.tsx
replace_in_file('src/pages/Review.tsx', "reps: (prevProgress?.reps || 0) + srsResult.reps", "reps: (prevProgress?.reps || 0) + (srsResult as any).reps")

