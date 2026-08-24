import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("categories.filter(c => !c.name.startsWith('MNN'))", "categories.filter(c => !c.name.startsWith('MNN') && !c.name.startsWith('JFT'))")

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
