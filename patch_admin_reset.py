import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

target = """        await updateDoc(doc(db, 'users', uid), { points: 0, level: 1, masteredVocabCount: 0, totalStudyTime: 0 });
        setUsers(users.map(u => u.uid === uid ? { ...u, points: 0, level: 1, masteredVocabCount: 0, totalStudyTime: 0 } : u));"""

replace = """        const resetData = { 
          points: 0, 
          level: 1, 
          masteredVocabCount: 0, 
          totalStudyTime: 0,
          loginStreak: 1,
          loginHistory: []
        };
        await updateDoc(doc(db, 'users', uid), resetData);
        setUsers(users.map(u => u.uid === uid ? { ...u, ...resetData } : u));"""

content = content.replace(target, replace)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)

print("Patched admin reset")
