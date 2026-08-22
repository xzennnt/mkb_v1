const fs = require('fs');
let code = fs.readFileSync('src/pages/Flashcard.tsx', 'utf-8');

// Add notRememberedIds state
if (!code.includes('const [notRememberedIds, setNotRememberedIds]')) {
  code = code.replace(
    '  const [isFinished, setIsFinished] = useState(false);',
    '  const [isFinished, setIsFinished] = useState(false);\n  const [notRememberedIds, setNotRememberedIds] = useState<string[]>([]);'
  );
}

// Update fetchVocabs to check localStorage
code = code.replace(
  '  useEffect(() => {\n    const fetchVocabs = async () => {\n      if (!category) return;',
  `  useEffect(() => {
    const fetchVocabs = async () => {
      if (!category) return;
      
      const savedState = localStorage.getItem('flashcard_state_' + category);
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setQueue(parsed.queue);
          setInitialVocabs(parsed.initialVocabs);
          setSessionTotal(parsed.sessionTotal);
          setMasteredCount(parsed.masteredCount);
          setNotRememberedIds(parsed.notRememberedIds || []);
          setLoading(false);
          
          localStorage.setItem('last_activity', JSON.stringify({ 
            category, 
            type: 'Flashcard', 
            title: \`Flashcard: \${formatCategoryName(category)}\`, 
            link: \`/flashcard/\${encodeURIComponent(category)}\` 
          }));
          return;
        } catch(e) {
          console.error(e);
        }
      }`
);

// Save state to localStorage whenever it changes
if (!code.includes('flashcard_state_')) {
  code = code.replace(
    '  const handleRating = async (isRemembered: boolean) => {',
    `  useEffect(() => {
    if (!loading && initialVocabs.length > 0 && queue.length > 0 && !isFinished) {
      localStorage.setItem('flashcard_state_' + category, JSON.stringify({
        queue,
        initialVocabs,
        sessionTotal,
        masteredCount,
        notRememberedIds
      }));
      localStorage.setItem('last_activity', JSON.stringify({ 
        category, 
        type: 'Flashcard', 
        title: \`Flashcard: \${formatCategoryName(category!)}\`, 
        link: \`/flashcard/\${encodeURIComponent(category!)}\` 
      }));
    } else if (isFinished) {
      localStorage.removeItem('flashcard_state_' + category);
    }
  }, [queue, masteredCount, notRememberedIds, loading, isFinished, category, initialVocabs.length]);

  const handleRating = async (isRemembered: boolean) => {`
  );
}

// Update notRememberedIds inside handleRating
code = code.replace(
  `        if (!isRemembered && card) {
          // If not remembered, add back to end of queue
          newQueue.push(card);
        } else {
          setMasteredCount(m => m + 1);
        }`,
  `        if (!isRemembered && card) {
          newQueue.push(card);
          setNotRememberedIds(prev => {
            if (!prev.includes(card.id)) return [...prev, card.id];
            return prev;
          });
        } else {
          setMasteredCount(m => m + 1);
        }`
);

// Change UI text
code = code.replace(
  'Sisa: {remainingCount}',
  'Belum Hafal: {notRememberedIds.length}'
);

fs.writeFileSync('src/pages/Flashcard.tsx', code);
console.log('Flashcard updated');
