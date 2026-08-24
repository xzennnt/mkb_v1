import re

with open('src/pages/Review.tsx', 'r') as f:
    content = f.read()

# Fix 1: Remove `setAllVocabs(parsed.allVocabs);` and initialize it properly
old_parse_block = """        const parsed = JSON.parse(savedState);
        setSessionCards(parsed.sessionCards);
        setCurrentIndex(parsed.currentIndex);
        setReports(parsed.reports);
        setDirections(parsed.directions);
        setAllVocabs(parsed.allVocabs);
        setOptions(parsed.options || []);
        setSelectedAnswer(parsed.selectedAnswer || null);"""

new_parse_block = """        const parsed = JSON.parse(savedState);
        setSessionCards(parsed.sessionCards);
        setCurrentIndex(parsed.currentIndex);
        setReports(parsed.reports);
        setDirections(parsed.directions);
        
        let allV: Vocabulary[] = allVocabularies;
        setAllVocabs(allV);
        
        setOptions(parsed.options || []);
        setSelectedAnswer(parsed.selectedAnswer || null);"""
        
content = content.replace(old_parse_block, new_parse_block)

# Fix 2: Remove allVocabs from saveSessionState
old_save = """      localStorage.setItem('review_state', JSON.stringify({
        sessionCards,
        currentIndex,
        reports,
        directions,
        allVocabs,
        options,
        selectedAnswer
      }));"""

new_save = """      localStorage.setItem('review_state', JSON.stringify({
        sessionCards,
        currentIndex,
        reports,
        directions,
        options,
        selectedAnswer
      }));"""

content = content.replace(old_save, new_save)

with open('src/pages/Review.tsx', 'w') as f:
    f.write(content)

