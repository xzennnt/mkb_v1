import re

with open('src/lib/srs.ts', 'r') as f:
    content = f.read()

new_gen_opts = """export function generateOptions(
  correctVocab: Vocabulary,
  allVocabs: Vocabulary[],
  direction: 'jp-to-id' | 'id-to-jp' | 'jp-to-romaji' | 'romaji-to-id' | 'id-to-romaji'
): string[] {
  const options = new Set<string>();
  
  const getAns = (v: Vocabulary) => {
    if (direction === 'jp-to-id' || direction === 'romaji-to-id') return v.id_translation;
    if (direction === 'id-to-jp') return v.jp;
    if (direction === 'jp-to-romaji' || direction === 'id-to-romaji') return v.romaji || v.jp;
    return v.jp;
  };

  const correctAns = getAns(correctVocab);
  if (!correctAns) return [];
  
  options.add(correctAns);
  
  // Try to find distractors in the same category first if possible, otherwise anywhere
  let distractors = allVocabs.filter(v => v.id !== correctVocab.id);
  
  // Shuffle distractors
  distractors = distractors.sort(() => 0.5 - Math.random());
  
  for (const v of distractors) {
    if (options.size >= 4) break;
    const opt = getAns(v);
    if (opt && opt.trim() !== '') {
      options.add(opt);
    }
  }
  
  return Array.from(options).sort(() => 0.5 - Math.random());
}"""

# Replace the old generateOptions
old_gen_opts = r"export function generateOptions\([\s\S]*?return Array\.from\(options\)\.sort\(\(\) => 0\.5 - Math\.random\(\)\);\n\}"
content = re.sub(old_gen_opts, new_gen_opts, content)

with open('src/lib/srs.ts', 'w') as f:
    f.write(content)
