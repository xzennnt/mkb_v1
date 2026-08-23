import re

with open('src/pages/Flashcard.tsx', 'r') as f:
    content = f.read()

import_line = "import { getSessionState, saveSessionState, removeSessionState } from '../utils/sessionState';"
content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\n" + import_line)

# Replace localStorage.getItem
content = content.replace("const savedState = localStorage.getItem('flashcard_state_' + category);", "const savedState = await getSessionState(currentUser?.uid, 'flashcard_state_' + category);")

# Replace localStorage.setItem in useEffect
old_set_effect = """    if (!loading && initialVocabs.length > 0 && !isFinished && queue.length > 0) {
      localStorage.setItem('flashcard_state_' + category, JSON.stringify({
        queue,
        initialVocabs,
        sessionTotal,
        masteredCount,
        notRememberedIds
      }));
    } else if (isFinished || (sessionTotal === 0 && initialVocabs.length > 0)) {
      localStorage.removeItem('flashcard_state_' + category);
    }"""
new_set_effect = """    const saveState = async () => {
      if (!loading && initialVocabs.length > 0 && !isFinished && queue.length > 0) {
        await saveSessionState(currentUser?.uid, 'flashcard_state_' + category, {
          queue,
          initialVocabs,
          sessionTotal,
          masteredCount,
          notRememberedIds
        });
      } else if (isFinished || (sessionTotal === 0 && initialVocabs.length > 0)) {
        await removeSessionState(currentUser?.uid, 'flashcard_state_' + category);
      }
    };
    saveState();"""
content = content.replace(old_set_effect, new_set_effect)

# Replace localStorage.removeItem in handleReset
content = content.replace("localStorage.removeItem('flashcard_state_' + category);", "removeSessionState(currentUser?.uid, 'flashcard_state_' + category);")

with open('src/pages/Flashcard.tsx', 'w') as f:
    f.write(content)
