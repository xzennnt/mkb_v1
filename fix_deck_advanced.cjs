const fs = require('fs');
let content = fs.readFileSync('src/pages/DeckView.tsx', 'utf-8');

content = content.replace(
  "import { hiraganaData, katakanaData, hiraganaGrid, katakanaGrid } from '../data/kana';",
  "import { hiraganaData, katakanaData, hiraganaGrid, katakanaGrid, hiraganaAdvancedData, katakanaAdvancedData, hiraganaAdvancedGrid, katakanaAdvancedGrid } from '../data/kana';"
);

content = content.replace(
  "      if (category === 'Hiragana') {",
  "      if (category === 'Hiragana') {\n        fetchedVocabs = hiraganaData as any;\n      } else if (category === 'Hiragana Lanjutan') {\n        fetchedVocabs = hiraganaAdvancedData as any;\n      } else if (category === 'Katakana Lanjutan') {\n        fetchedVocabs = katakanaAdvancedData as any;"
);

content = content.replace(
  "{category === 'Hiragana' || category === 'Katakana' ? (",
  "{category === 'Hiragana' || category === 'Katakana' || category === 'Hiragana Lanjutan' || category === 'Katakana Lanjutan' ? ("
);

content = content.replace(
  "{(category === 'Hiragana' ? hiraganaGrid : katakanaGrid).map((item, idx) => (",
  "{(category === 'Hiragana' ? hiraganaGrid : category === 'Katakana' ? katakanaGrid : category === 'Hiragana Lanjutan' ? hiraganaAdvancedGrid : katakanaAdvancedGrid).map((item, idx) => ("
);

fs.writeFileSync('src/pages/DeckView.tsx', content);
console.log('Success Deck');
