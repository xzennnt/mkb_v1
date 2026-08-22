const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf-8');

const injection = `
    match /vocabStats/{statId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
`;

if (!content.includes('vocabStats')) {
  content = content.replace("match /vocabularies/{vocabId} {", injection + "    match /vocabularies/{vocabId} {");
  fs.writeFileSync('firestore.rules', content);
}
console.log('Success');
