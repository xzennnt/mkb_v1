const fs = require('fs');
let content = fs.readFileSync('src/pages/DeckView.tsx', 'utf-8');

content = content.replace(
  "      if (category === 'Hiragana') {\n        fetchedVocabs = hiraganaData as any;\n      } else if (category === 'Hiragana Lanjutan') {\n        fetchedVocabs = hiraganaAdvancedData as any;\n      } else if (category === 'Katakana Lanjutan') {\n        fetchedVocabs = katakanaAdvancedData as any;\n        fetchedVocabs = hiraganaData as any;\n      } else if (category === 'Katakana') {",
  "      if (category === 'Hiragana') {\n        fetchedVocabs = hiraganaData as any;\n      } else if (category === 'Hiragana Lanjutan') {\n        fetchedVocabs = hiraganaAdvancedData as any;\n      } else if (category === 'Katakana Lanjutan') {\n        fetchedVocabs = katakanaAdvancedData as any;\n      } else if (category === 'Katakana') {"
);

fs.writeFileSync('src/pages/DeckView.tsx', content);
console.log('Success Deck 2');
