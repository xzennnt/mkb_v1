const fs = require('fs');
let content = fs.readFileSync('src/pages/Quiz.tsx', 'utf-8');

content = content.replace(
  "import { hiraganaData, katakanaData } from '../data/kana';",
  "import { hiraganaData, katakanaData, hiraganaAdvancedData, katakanaAdvancedData } from '../data/kana';"
);

content = content.replace(
  "      if (category === 'Hiragana' || category === 'Katakana') {\n        catV = (category === 'Hiragana' ? hiraganaData : katakanaData) as any;\n        allV = catV;\n        setAllVocabs(allV);\n      } else {",
  "      if (category === 'Hiragana' || category === 'Katakana' || category === 'Hiragana Lanjutan' || category === 'Katakana Lanjutan') {\n        catV = (category === 'Hiragana' ? hiraganaData : category === 'Katakana' ? katakanaData : category === 'Hiragana Lanjutan' ? hiraganaAdvancedData : katakanaAdvancedData) as any;\n        allV = catV;\n        setAllVocabs(allV);\n      } else {"
);

fs.writeFileSync('src/pages/Quiz.tsx', content);
console.log('Success Quiz Advanced');
