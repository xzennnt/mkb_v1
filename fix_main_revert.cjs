const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf-8');
content = content.replace(/try \{.*console\.error\("Failed to patch window\.fetch", e\);\n\}\n/s, '');
fs.writeFileSync('src/main.tsx', content);
console.log('Reverted main.tsx');
