import re

with open('src/data/index.ts', 'r') as f:
    content = f.read()

content = content.replace("...newMats.map((item, idx) => ({", "...newMats.map((item: any, idx) => ({")
content = content.replace("...kana.map((item, idx) => ({", "...kana.map((item: any, idx) => ({")

with open('src/data/index.ts', 'w') as f:
    f.write(content)
