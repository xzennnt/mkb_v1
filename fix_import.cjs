const fs = require('fs');
let code = fs.readFileSync('src/pages/Flashcard.tsx', 'utf-8');
code = code.replace(
  "import { getVocabulariesByCategory } from '../data';",
  "import { getVocabulariesByCategory, formatCategoryName } from '../data';"
);
fs.writeFileSync('src/pages/Flashcard.tsx', code);
console.log('Fixed import');
