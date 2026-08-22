import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("userData?.role === 'admin' ? children", "(userData?.role === 'admin' || userData?.role === 'sub_admin') ? children")

with open('src/App.tsx', 'w') as f:
    f.write(content)
