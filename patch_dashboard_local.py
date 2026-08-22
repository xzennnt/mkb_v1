import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add localStorage clearance
old_reset = """        const resetData = { """
new_reset = """        // Clear all local states so it doesn't resume from old sessions
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('flashcard_state_') || key.startsWith('quiz_state_') || key.startsWith('review_flashcard_state')) {
            localStorage.removeItem(key);
          }
        });
        
        const resetData = { """

content = content.replace(old_reset, new_reset)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
