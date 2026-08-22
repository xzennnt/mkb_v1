import re

with open('src/pages/Leaderboard.tsx', 'r') as f:
    content = f.read()

target = "let fetchedLeaders = snap.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserData));"
replace = "let fetchedLeaders = snap.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserData));\n        fetchedLeaders = fetchedLeaders.filter(u => !u.isBanned && u.email !== 'edwinageng113@gmail.com' && u.role !== 'admin');"

content = content.replace(target, replace)

with open('src/pages/Leaderboard.tsx', 'w') as f:
    f.write(content)

print("Leaderboard patched")
