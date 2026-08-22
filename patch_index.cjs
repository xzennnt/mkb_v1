const fs = require('fs');
let content = fs.readFileSync('src/data/index.ts', 'utf-8');

const importReplacement = `import mnn1_bab9_10 from './mnn1_bab9_10.json';
import mnn1_bab11_15 from './mnn1_bab11_15.json';
import mnn1_bab16_20 from './mnn1_bab16_20.json';
import mnn1_bab21_25 from './mnn1_bab21_25.json';`;
content = content.replace(/import mnn1_bab9_10 from '\.\/mnn1_bab9_10\.json';/, importReplacement);

const arrayReplacement = `...mnn1_bab9_10,
  ...mnn1_bab11_15,
  ...mnn1_bab16_20,
  ...mnn1_bab21_25
];`;
content = content.replace(/\.\.\.mnn1_bab9_10\s*\];/, arrayReplacement);

fs.writeFileSync('src/data/index.ts', content);
console.log('Index updated.');
