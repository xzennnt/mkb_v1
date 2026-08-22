const fs = require('fs');
let content = fs.readFileSync('src/pages/Quiz.tsx', 'utf-8');

content = content.replace(
  "const isKana = category === 'Hiragana' || category === 'Katakana';",
  "const isKana = category === 'Hiragana' || category === 'Katakana' || category === 'Hiragana Lanjutan' || category === 'Katakana Lanjutan';"
);

fs.writeFileSync('src/pages/Quiz.tsx', content);
console.log('Success Quiz isKana');
