const fs = require('fs');

const wf = fs.readFileSync('src/pages/WeakFlashcard.tsx', 'utf-8');
const wfNew = wf.replace(
/const progressRef = doc\(db, 'user_progress', `\$\{currentUser\?\.uid\}_\$\{vId\}`\);\s*try \{\s*const progSnap = await getDoc\(progressRef\);\s*if \(progSnap\.exists\(\)\) \{\s*const pData = progSnap\.data\(\);\s*if \(pData\.weakQuiz === false\) \{\s*await updateDoc\(progressRef, \{ isWeak: false, weakFlashcard: false \}\);\s*\} else \{\s*await updateDoc\(progressRef, \{ weakFlashcard: false \}\);\s*\}\s*\}\s*\} catch\(e\) \{ console\.error\(e\); \}/g,
`try {
        const progQ = query(
          collection(db, 'user_progress'),
          where('userId', '==', currentUser?.uid),
          where('vocabId', '==', vId)
        );
        const progSnap = await getDocs(progQ);
        progSnap.forEach(async (d) => {
          const pData = d.data();
          if (pData.weakQuiz === false) { 
             await updateDoc(d.ref, { isWeak: false, weakFlashcard: false });
          } else { 
             await updateDoc(d.ref, { weakFlashcard: false });
          }
        });
      } catch(e) { console.error(e); }`);
fs.writeFileSync('src/pages/WeakFlashcard.tsx', wfNew);

const wq = fs.readFileSync('src/pages/WeakQuiz.tsx', 'utf-8');
const wqNew = wq.replace(
/const progressRef = doc\(db, 'user_progress', `\$\{currentUser\.uid\}_\$\{vId\}`\);\s*try \{\s*const progSnap = await getDoc\(progressRef\);\s*if \(progSnap\.exists\(\)\) \{\s*const pData = progSnap\.data\(\);\s*if \(pData\.weakFlashcard === false\) \{\s*await updateDoc\(progressRef, \{ isWeak: false, weakQuiz: false \}\);\s*\} else \{\s*await updateDoc\(progressRef, \{ weakQuiz: false \}\);\s*\}\s*\}\s*\} catch\(e\) \{ console\.error\(e\); \}/g,
`try {
            const progQ = query(
              collection(db, 'user_progress'),
              where('userId', '==', currentUser.uid),
              where('vocabId', '==', vId)
            );
            const progSnap = await getDocs(progQ);
            progSnap.forEach(async (d) => {
              const pData = d.data();
              if (pData.weakFlashcard === false) { 
                 await updateDoc(d.ref, { isWeak: false, weakQuiz: false });
              } else { 
                 await updateDoc(d.ref, { weakQuiz: false });
              }
            });
          } catch(e) { console.error(e); }`);
fs.writeFileSync('src/pages/WeakQuiz.tsx', wqNew);
console.log('Fixed loop logic');
