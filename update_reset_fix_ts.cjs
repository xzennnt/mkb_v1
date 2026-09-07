const fs = require('fs');
let code = fs.readFileSync('src/pages/DeckView.tsx', 'utf8');

code = code.replace(
  /const sessionDocsToDelete = \[\];/,
  "const sessionDocsToDelete: string[] = [];"
);
code = code.replace(
  /const keysToRemove = \[\];/,
  "const keysToRemove: string[] = [];"
);

fs.writeFileSync('src/pages/DeckView.tsx', code);
