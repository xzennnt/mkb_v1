import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

cleanup_script = """
  useEffect(() => {
    // Cleanup old large state from localStorage to prevent QuotaExceededError
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('quiz_state_') || key.startsWith('review_state'))) {
          const val = localStorage.getItem(key);
          if (val && val.includes('"allVocabs":')) {
            const parsed = JSON.parse(val);
            if (parsed.allVocabs) {
              delete parsed.allVocabs;
              localStorage.setItem(key, JSON.stringify(parsed));
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to cleanup localStorage', e);
    }
  }, []);
"""

if "Cleanup old large state" not in content:
    content = content.replace("function App() {", "function App() {\n" + cleanup_script)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
