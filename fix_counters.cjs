const fs = require('fs');
let code = fs.readFileSync('src/pages/Flashcard.tsx', 'utf-8');

// 1. Add sessionTotal state
code = code.replace(
  `  const [masteredCount, setMasteredCount] = useState(0);`,
  `  const [masteredCount, setMasteredCount] = useState(0);\n  const [sessionTotal, setSessionTotal] = useState(0);`
);

// 2. Change the logic inside fetchVocabs to only care about session count
code = code.replace(
  `        const dueQueue: Vocabulary[] = [];
        const now = Date.now();
        fetchedVocabs.forEach(v => {
          const prog = pData[v.id];
          
          if (!prog || prog.nextReviewTime <= now) {
            dueQueue.push(v);
          }
          
          if (prog && (prog.srsLevel === 'good' || prog.srsLevel === 'easy') && prog.nextReviewTime > now) {
            mCount++;
          }
        });
        
        setQueue(dueQueue);
        setMasteredCount(mCount);`,
  `        const dueQueue: Vocabulary[] = [];
        const now = Date.now();
        fetchedVocabs.forEach(v => {
          const prog = pData[v.id];
          if (!prog || prog.nextReviewTime <= now) {
            dueQueue.push(v);
          }
        });
        
        setQueue(dueQueue);
        setSessionTotal(dueQueue.length);
        setMasteredCount(0);` // Session starts at 0 mastered
);

// For the else block (if no user)
code = code.replace(
  `      } else {
        setQueue(fetchedVocabs);
      }`,
  `      } else {
        setQueue(fetchedVocabs);
        setSessionTotal(fetchedVocabs.length);
        setMasteredCount(0);
      }`
);

// 3. Update the UI
// The empty queue message logic:
code = code.replace(
  `  if (queue.length === 0 && masteredCount > 0 && !isFinished) {`,
  `  if (sessionTotal === 0 && initialVocabs.length > 0 && !isFinished) {`
);

// 4. Update the center text
code = code.replace(
  `            <div className="font-bold text-xl text-slate-700">
              {initialVocabs.length - remainingCount} / {initialVocabs.length}
            </div>`,
  `            <div className="font-bold text-xl text-slate-700">
              {sessionTotal - remainingCount + 1 > sessionTotal ? sessionTotal : sessionTotal - remainingCount + 1} / {sessionTotal}
            </div>`
);

fs.writeFileSync('src/pages/Flashcard.tsx', code);
console.log("Updated counters");
