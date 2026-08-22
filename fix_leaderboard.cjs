const fs = require('fs');
let content = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf-8');

content = content.replace(
  "const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(100));\n        const snap = await getDocs(q);",
  "const snap = await getDocs(collection(db, 'users'));"
);

content = content.replace(
  "const fetchedLeaders = snap.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserData));\n        setLeaders(fetchedLeaders);",
  "let fetchedLeaders = snap.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserData));\n        fetchedLeaders.sort((a, b) => (b.points || 0) - (a.points || 0));\n        setLeaders(fetchedLeaders.slice(0, 100));"
);

fs.writeFileSync('src/pages/Leaderboard.tsx', content);
console.log('Success');
