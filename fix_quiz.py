import re

with open('src/pages/Quiz.tsx', 'r') as f:
    content = f.read()

target = """          {options.map((opt, idx) => {
            let btnClass = "bg-white border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 group";
            
            if (selectedAnswer !== null) {
              let correctAns = currentVocab.jp;
    if (dir === 'jp-to-id' || dir === 'romaji-to-id') correctAns = currentVocab.id_translation;
    else if (dir === 'jp-to-romaji' || dir === 'id-to-romaji') correctAns = currentVocab.romaji || currentVocab.jp;
              if (opt === correctAns) {"""

replacement = """          {options.map((opt, idx) => {
            let correctAns = currentVocab.jp;
            if (dir === 'jp-to-id' || dir === 'romaji-to-id') correctAns = currentVocab.id_translation;
            else if (dir === 'jp-to-romaji' || dir === 'id-to-romaji') correctAns = currentVocab.romaji || currentVocab.jp;
            
            let btnClass = "bg-white border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 group";
            
            if (selectedAnswer !== null) {
              if (opt === correctAns) {"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/Quiz.tsx', 'w') as f:
        f.write(content)
    print("Fixed Quiz.tsx!")
else:
    print("Target not found.")
