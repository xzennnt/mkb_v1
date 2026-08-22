with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

target = "import { collection, query, getDocs, where } from 'firebase/firestore';"
replace = "import { collection, query, getDocs, where, limit } from 'firebase/firestore';"

content = content.replace(target, replace)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Import patched")
