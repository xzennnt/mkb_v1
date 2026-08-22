import re

with open('src/lib/srs.ts', 'r') as f:
    content = f.read()

target = "direction: 'jp-to-id' | 'id-to-jp'"
replace = "direction: 'jp-to-id' | 'id-to-jp' | 'jp-to-romaji' | 'romaji-to-id' | 'id-to-romaji'"
content = content.replace(target, replace)

target_option_correct = "const correctOption = direction === 'jp-to-id' ? correctVocab.id_translation : correctVocab.jp;"
replace_option_correct = """let correctOption = correctVocab.jp;
  if (direction === 'jp-to-id' || direction === 'romaji-to-id') {
    correctOption = correctVocab.id_translation;
  } else if (direction === 'id-to-jp') {
    correctOption = correctVocab.jp;
  } else if (direction === 'jp-to-romaji' || direction === 'id-to-romaji') {
    correctOption = correctVocab.romaji || correctVocab.jp;
  }"""
content = content.replace(target_option_correct, replace_option_correct)

target_loop = "options.add(direction === 'jp-to-id' ? v.id_translation : v.jp);"
replace_loop = """let opt = v.jp;
    if (direction === 'jp-to-id' || direction === 'romaji-to-id') opt = v.id_translation;
    else if (direction === 'jp-to-romaji' || direction === 'id-to-romaji') opt = v.romaji || v.jp;
    options.add(opt);"""
content = content.replace(target_loop, replace_loop)

with open('src/lib/srs.ts', 'w') as f:
    f.write(content)

