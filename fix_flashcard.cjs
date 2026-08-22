const fs = require('fs');
let content = fs.readFileSync('src/pages/Flashcard.tsx', 'utf-8');

content = content.replace(
  "import { hiraganaData, katakanaData } from '../data/kana';",
  "import { hiraganaData, katakanaData, hiraganaAdvancedData, katakanaAdvancedData } from '../data/kana';"
);

content = content.replace(
  "      if (category === 'Hiragana') {\n        fetchedVocabs = hiraganaData as any;\n      } else if (category === 'Katakana') {\n        fetchedVocabs = katakanaData as any;",
  "      if (category === 'Hiragana') {\n        fetchedVocabs = hiraganaData as any;\n      } else if (category === 'Hiragana Lanjutan') {\n        fetchedVocabs = hiraganaAdvancedData as any;\n      } else if (category === 'Katakana Lanjutan') {\n        fetchedVocabs = katakanaAdvancedData as any;\n      } else if (category === 'Katakana') {\n        fetchedVocabs = katakanaData as any;"
);

content = content.replace(
  "const isKana = category === 'Hiragana' || category === 'Katakana';",
  "const isKana = category === 'Hiragana' || category === 'Katakana' || category === 'Hiragana Lanjutan' || category === 'Katakana Lanjutan';"
);

fs.writeFileSync('src/pages/Flashcard.tsx', content);
console.log('Success Flashcard');
