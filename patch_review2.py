import re

with open('src/pages/ReviewFlashcard.tsx', 'r') as f:
    content = f.read()

import_line = "import { getSessionState, saveSessionState, removeSessionState } from '../utils/sessionState';"
content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\n" + import_line)

content = content.replace("const savedState = localStorage.getItem('review_flashcard_state');", "const savedState = await getSessionState(currentUser?.uid, 'review_flashcard_state');")

old_set_effect = """    if (!loading && initialVocabs.length > 0 && !isFinished && queue.length > 0) {
      localStorage.setItem('review_flashcard_state', JSON.stringify({
        queue,
        initialVocabs,
        sessionTotal,
        masteredCount,
        notRememberedIds
      }));
    } else if (isFinished || (sessionTotal === 0 && initialVocabs.length > 0)) {
      localStorage.removeItem('review_flashcard_state');
    }"""
new_set_effect = """    const saveState = async () => {
      if (!loading && initialVocabs.length > 0 && !isFinished && queue.length > 0) {
        await saveSessionState(currentUser?.uid, 'review_flashcard_state', {
          queue,
          initialVocabs,
          sessionTotal,
          masteredCount,
          notRememberedIds
        });
      } else if (isFinished || (sessionTotal === 0 && initialVocabs.length > 0)) {
        await removeSessionState(currentUser?.uid, 'review_flashcard_state');
      }
    };
    saveState();"""
content = content.replace(old_set_effect, new_set_effect)

content = content.replace("localStorage.removeItem('review_flashcard_state');", "removeSessionState(currentUser?.uid, 'review_flashcard_state');")

with open('src/pages/ReviewFlashcard.tsx', 'w') as f:
    f.write(content)
