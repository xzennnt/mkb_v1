import re

with open('src/utils/sessionState.ts', 'r') as f:
    content = f.read()

old_code = """      await setDoc(doc(db, 'active_sessions', `${uid}_${key}`), {
        stateData: jsonStr,
        updatedAt: Date.now()
      });"""
new_code = """      await setDoc(doc(db, 'active_sessions', `${uid}_${key}`), {
        userId: uid,
        stateData: jsonStr,
        updatedAt: Date.now()
      });"""
content = content.replace(old_code, new_code)

with open('src/utils/sessionState.ts', 'w') as f:
    f.write(content)
