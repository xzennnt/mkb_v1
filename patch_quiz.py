import re

with open('src/pages/Quiz.tsx', 'r') as f:
    content = f.read()

# Replace directions type
content = content.replace("const [directions, setDirections] = useState<('jp-to-id' | 'id-to-jp')[]>([]);", "const [directions, setDirections] = useState<('jp-to-id' | 'id-to-jp' | 'jp-to-romaji' | 'romaji-to-id' | 'id-to-romaji')[]>([]);")
content = content.replace("const setupCard = (vocab: Vocabulary, allV: Vocabulary[], dir: 'jp-to-id' | 'id-to-jp') => {", "const setupCard = (vocab: Vocabulary, allV: Vocabulary[], dir: 'jp-to-id' | 'id-to-jp' | 'jp-to-romaji' | 'romaji-to-id' | 'id-to-romaji') => {")

# Patch handleAnswer correctAns calculation
target_correct = "const correctAns = dir === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp;"
replace_correct = """let correctAns = currentVocab.jp;
    if (dir === 'jp-to-id' || dir === 'romaji-to-id') correctAns = currentVocab.id_translation;
    else if (dir === 'jp-to-romaji' || dir === 'id-to-romaji') correctAns = currentVocab.romaji || currentVocab.jp;"""
content = content.replace(target_correct, replace_correct)

# Patch the Quiz initialization where it creates phases
target_phases = """      // Phase 1: JP to ID
      const phase1Cards = [...baseCards];
      const phase1Dirs = phase1Cards.map(() => 'jp-to-id' as const);

      // Phase 2: ID to JP
      const phase2Cards = shuffle(baseCards);
      const phase2Dirs = phase2Cards.map(() => 'id-to-jp' as const);

      const combinedCards = [...phase1Cards, ...phase2Cards];
      const combinedDirs = [...phase1Dirs, ...phase2Dirs];"""
      
replace_phases = """      let combinedCards: Vocabulary[] = [];
      let combinedDirs: ('jp-to-id' | 'id-to-jp' | 'jp-to-romaji' | 'romaji-to-id' | 'id-to-romaji')[] = [];
      
      if (category === 'JFT_A2_1_50') {
        const p1 = [...baseCards];
        const d1 = p1.map(() => 'jp-to-romaji' as const);
        const p2 = shuffle(baseCards);
        const d2 = p2.map(() => 'romaji-to-id' as const);
        const p3 = shuffle(baseCards);
        const d3 = p3.map(() => 'id-to-romaji' as const);
        
        combinedCards = [...p1, ...p2, ...p3];
        combinedDirs = [...d1, ...d2, ...d3];
      } else {
        const phase1Cards = [...baseCards];
        const phase1Dirs = phase1Cards.map(() => 'jp-to-id' as const);

        const phase2Cards = shuffle(baseCards);
        const phase2Dirs = phase2Cards.map(() => 'id-to-jp' as const);

        combinedCards = [...phase1Cards, ...phase2Cards];
        combinedDirs = [...phase1Dirs, ...phase2Dirs];
      }"""
content = content.replace(target_phases, replace_phases)

# Patch render questionText
target_qtext = "const questionText = dir === 'jp-to-id' ? currentVocab.jp : currentVocab.id_translation;"
replace_qtext = """let questionText = currentVocab.id_translation;
  if (dir === 'jp-to-id' || dir === 'jp-to-romaji') questionText = currentVocab.jp;
  else if (dir === 'romaji-to-id') questionText = currentVocab.romaji || currentVocab.jp;"""
content = content.replace(target_qtext, replace_qtext)

# Patch render promptText
target_prompt = """const promptText = dir === 'jp-to-id' 
    ? (isKana ? 'Huruf Jepang → Romaji' : 'Japanese → Indonesian') 
    : (isKana ? 'Romaji → Huruf Jepang' : 'Indonesian → Japanese');"""
replace_prompt = """let promptText = '';
  if (dir === 'jp-to-romaji') promptText = 'Kanji → Hiragana';
  else if (dir === 'romaji-to-id') promptText = 'Hiragana → Indonesian';
  else if (dir === 'id-to-romaji') promptText = 'Indonesian → Hiragana';
  else if (dir === 'jp-to-id') promptText = isKana ? 'Huruf Jepang → Romaji' : 'Japanese → Indonesian';
  else promptText = isKana ? 'Romaji → Huruf Jepang' : 'Indonesian → Japanese';"""
content = content.replace(target_prompt, replace_prompt)

# Patch UI options 
target_opt1 = "const correctAns = dir === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp;"
replace_opt1 = """let correctAns = currentVocab.jp;
              if (dir === 'jp-to-id' || dir === 'romaji-to-id') correctAns = currentVocab.id_translation;
              else if (dir === 'jp-to-romaji' || dir === 'id-to-romaji') correctAns = currentVocab.romaji || currentVocab.jp;"""
content = content.replace(target_opt1, replace_opt1)

target_opt2 = "opt === (dir === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp)"
replace_opt2 = "opt === correctAns"
content = content.replace(target_opt2, replace_opt2)

target_opt3 = "opt !== (dir === 'jp-to-id' ? currentVocab.id_translation : currentVocab.jp)"
replace_opt3 = "opt !== correctAns"
content = content.replace(target_opt3, replace_opt3)

with open('src/pages/Quiz.tsx', 'w') as f:
    f.write(content)

