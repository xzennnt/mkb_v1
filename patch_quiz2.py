import re

with open('src/pages/Quiz.tsx', 'r') as f:
    content = f.read()

import_line = "import { getSessionState, saveSessionState, removeSessionState } from '../utils/sessionState';"
content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\n" + import_line)

content = content.replace("const savedState = localStorage.getItem('quiz_state_' + category + '_' + sessionIndex);", "const savedState = await getSessionState(currentUser?.uid, 'quiz_state_' + category + '_' + sessionIndex);")

old_set_effect = """    if (!loading && sessionCards.length > 0 && !isFinished) {
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
        title: `Kuis: ${formatCategoryName(category!)}`, 
        link: `/quiz/${encodeURIComponent(category!)}/${sessionIndex}` 
      }));
    } else if (isFinished) {
      localStorage.removeItem('quiz_state_' + category + '_' + sessionIndex);
    }"""
new_set_effect = """    const saveState = async () => {
      if (!loading && sessionCards.length > 0 && !isFinished) {
        await saveSessionState(currentUser?.uid, 'quiz_state_' + category + '_' + sessionIndex, {
          sessionCards,
          currentIndex,
          reports,
          directions,
          allVocabs,
          options,
          selectedAnswer
        });
        localStorage.setItem('last_activity', JSON.stringify({ 
          category, 
          type: 'Kuis', 
          title: `Kuis: ${formatCategoryName(category!)}`, 
          link: `/quiz/${encodeURIComponent(category!)}/${sessionIndex}` 
        }));
      } else if (isFinished) {
        await removeSessionState(currentUser?.uid, 'quiz_state_' + category + '_' + sessionIndex);
      }
    };
    saveState();"""
content = content.replace(old_set_effect, new_set_effect)

content = content.replace("localStorage.removeItem('quiz_state_' + category + '_' + sessionIndex);", "removeSessionState(currentUser?.uid, 'quiz_state_' + category + '_' + sessionIndex);")

with open('src/pages/Quiz.tsx', 'w') as f:
    f.write(content)
