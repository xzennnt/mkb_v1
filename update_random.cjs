const fs = require('fs');

// Quiz.tsx
let quizCode = fs.readFileSync('src/pages/Quiz.tsx', 'utf8');
quizCode = quizCode.replace(
  /const shuffle = <T,>\(array: T\[\]\): T\[\] => array\.slice\(\)\.sort\(\(\) => 0\.5 - Math\.random\(\)\);/g,
  "const shuffle = <T,>(array: T[]): T[] => array.slice(); // Removed Math.random() for stable order"
);
fs.writeFileSync('src/pages/Quiz.tsx', quizCode);

// Flashcard.tsx
let flashcardCode = fs.readFileSync('src/pages/Flashcard.tsx', 'utf8');

// Remove initial shuffle
flashcardCode = flashcardCode.replace(
  /for \(let i = fetchedVocabs\.length - 1; i > 0; i--\) {\s*const j = Math\.floor\(Math\.random\(\) \* \(i \+ 1\)\);\s*\[fetchedVocabs\[i\], fetchedVocabs\[j\]\] = \[fetchedVocabs\[j\], fetchedVocabs\[i\]\];\s*}/g,
  "// Removed initial shuffle for stable order"
);

// Remove dueQueue shuffle
flashcardCode = flashcardCode.replace(
  /for \(let i = dueQueue\.length - 1; i > 0; i--\) {\s*const j = Math\.floor\(Math\.random\(\) \* \(i \+ 1\)\);\s*\[dueQueue\[i\], dueQueue\[j\]\] = \[dueQueue\[j\], dueQueue\[i\]\];\s*}/g,
  "// Removed dueQueue shuffle for stable order"
);

fs.writeFileSync('src/pages/Flashcard.tsx', flashcardCode);

console.log("Removed shuffles from Quiz and Flashcard");
