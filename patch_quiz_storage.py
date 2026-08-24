import re

with open('src/pages/Quiz.tsx', 'r') as f:
    content = f.read()

# Fix 1: Remove `setAllVocabs(parsed.allVocabs);` and initialize it properly
old_parse_block = """        const parsed = JSON.parse(savedState);
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
        return;"""

new_parse_block = """        const parsed = JSON.parse(savedState);
        setSessionCards(parsed.sessionCards);
        setCurrentIndex(parsed.currentIndex);
        setReports(parsed.reports);
        setDirections(parsed.directions);
        
        // Reconstruct allVocabs instead of pulling from storage
        let allV: Vocabulary[] = [];
        if (category === 'Hiragana' || category === 'Katakana' || category === 'Hiragana Lanjutan' || category === 'Katakana Lanjutan') {
          allV = (category === 'Hiragana' ? hiraganaData : category === 'Katakana' ? katakanaData : category === 'Hiragana Lanjutan' ? hiraganaAdvancedData : katakanaAdvancedData) as any;
        } else {
          allV = allVocabularies;
        }
        setAllVocabs(allV);
        
        setOptions(parsed.options || []);
        setSelectedAnswer(parsed.selectedAnswer || null);
        
        setStartTime(Date.now());
        setSessionStartTime(Date.now());
        setLoading(false);
        return;"""
        
content = content.replace(old_parse_block, new_parse_block)

# Fix 2: Remove allVocabs from saveSessionState
old_save = """        await saveSessionState(currentUser?.uid, 'quiz_state_' + category + '_' + sessionIndex, {
          sessionCards,
          currentIndex,
          reports,
          directions,
          allVocabs,
          options,
          selectedAnswer
        });"""

new_save = """        await saveSessionState(currentUser?.uid, 'quiz_state_' + category + '_' + sessionIndex, {
          sessionCards,
          currentIndex,
          reports,
          directions,
          options,
          selectedAnswer
        });"""

content = content.replace(old_save, new_save)

with open('src/pages/Quiz.tsx', 'w') as f:
    f.write(content)

