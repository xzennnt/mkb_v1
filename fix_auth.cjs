const fs = require('fs');
let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf-8');
content = content.replace("setDoc(userRef, updates, { merge: true }).catch(console.error);", "await setDoc(userRef, updates, { merge: true });");
fs.writeFileSync('src/contexts/AuthContext.tsx', content);
console.log('Fixed AuthContext await');
