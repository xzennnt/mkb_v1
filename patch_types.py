import re

with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace("role: 'admin' | 'user';", "role: 'admin' | 'sub_admin' | 'user';")

with open('src/types.ts', 'w') as f:
    f.write(content)
