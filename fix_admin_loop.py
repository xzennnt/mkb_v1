with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

bad_loop = """        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('quiz_state_')) {
            localStorage.removeItem(key);
          }
        }"""
        
good_loop = """        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('quiz_state_')) {
            keys.push(key);
          }
        }
        keys.forEach(k => localStorage.removeItem(k));"""

content = content.replace(bad_loop, good_loop)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)
