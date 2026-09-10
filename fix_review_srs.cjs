const fs = require('fs');

let code = fs.readFileSync('src/pages/ReviewFlashcardSRS.tsx', 'utf8');

code = code.replace(/if \(!isRemembered\)/g, "if (rating === 'again')");
code = code.replace(/else if \(srsLevel === 'hard'\)/g, "else if (rating === 'hard')");
code = code.replace(/if \(isRemembered && currentUser\)/g, "if (rating !== 'again' && currentUser)");

fs.writeFileSync('src/pages/ReviewFlashcardSRS.tsx', code);
