import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

target = "usersData = usersData.filter(u => u.uid !== currentUser.uid && u.lastActiveDate);"
replace = "usersData = usersData.filter(u => u.uid !== currentUser.uid && u.lastActiveDate && !u.isBanned && u.email !== 'edwinageng113@gmail.com' && u.role !== 'admin');"

content = content.replace(target, replace)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Dashboard recent patched")
