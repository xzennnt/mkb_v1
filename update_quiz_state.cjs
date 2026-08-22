const fs = require('fs');
let code = fs.readFileSync('src/pages/Quiz.tsx', 'utf-8');

const resumeCode = `
    const savedState = localStorage.getItem('quiz_state_' + category + '_' + sessionIndex);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setSessionCards(parsed.sessionCards);
        setCurrentIndex(parsed.currentIndex);
        setReports(parsed.reports);
        setDirections(parsed.directions);
        setAllVocabs(parsed.allVocabs);
        setOptions(parsed.options || []);
        setSelectedAnswer(parsed.selectedAnswer || null);
        
        setStartTime(Date.now());
        setSessionStartTime(Date.now());
        setLoading(false);
        return;
      } catch (e) {
        console.error(e);
      }
    }
`;

code = code.replace(
  'const fetchData = async () => {\n      setLoading(true);',
  'const fetchData = async () => {\n      setLoading(true);' + resumeCode
);

const saveCode = `
  useEffect(() => {
    if (!loading && sessionCards.length > 0 && !isFinished) {
      localStorage.setItem('quiz_state_' + category + '_' + sessionIndex, JSON.stringify({
        sessionCards,
        currentIndex,
        reports,
        directions,
        allVocabs,
        options,
        selectedAnswer
      }));
      localStorage.setItem('last_activity', JSON.stringify({ 
        category, 
        type: 'Kuis', 
        title: \`Kuis: \${formatCategoryName(category!)}\`, 
        link: \`/quiz/\${encodeURIComponent(category!)}/\${sessionIndex}\` 
      }));
    } else if (isFinished) {
      localStorage.removeItem('quiz_state_' + category + '_' + sessionIndex);
    }
  }, [currentIndex, reports, loading, isFinished, category, sessionIndex, options, selectedAnswer]);

  const setupCard = (vocab: Vocabulary, allV: Vocabulary[], dir: 'jp-to-id' | 'id-to-jp') => {`;

code = code.replace(
  "  const setupCard = (vocab: Vocabulary, allV: Vocabulary[], dir: 'jp-to-id' | 'id-to-jp') => {",
  saveCode
);

fs.writeFileSync('src/pages/Quiz.tsx', code);
console.log('Quiz updated');
