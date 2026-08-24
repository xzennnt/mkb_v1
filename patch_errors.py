import re

def replace_in_file(filename, old_str, new_str):
    with open(filename, 'r') as f:
        content = f.read()
    content = content.replace(old_str, new_str)
    with open(filename, 'w') as f:
        f.write(content)

# src/data/index.ts
replace_in_file('src/data/index.ts', "const additionalVocabs = [\n  {\n    category: 'MNN1_Bab1',", "const additionalVocabs: any[] = [\n  {\n    category: 'MNN1_Bab1',")

# src/lib/srs.ts
replace_in_file('src/lib/srs.ts', "export function generateOptions(vocab: Vocabulary, allVocabs: Vocabulary[], direction: 'jp-to-id' | 'id-to-jp'): string[] {", "import { Vocabulary } from '../types';\n\nexport function generateOptions(vocab: Vocabulary, allVocabs: Vocabulary[], direction: 'jp-to-id' | 'id-to-jp'): string[] {")

# src/pages/Quiz.tsx
replace_in_file('src/pages/Quiz.tsx', "reps: (prevProgress?.reps || 0) + srsResult.reps,", "reps: (prevProgress?.reps || 0) + (srsResult as any).reps,")

# src/pages/Review.tsx
replace_in_file('src/pages/Review.tsx', "reps: (prevProgress?.reps || 0) + srsResult.reps,", "reps: (prevProgress?.reps || 0) + (srsResult as any).reps,")

