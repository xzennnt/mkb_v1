import re

with open('src/contexts/AuthContext.tsx', 'r') as f:
    content = f.read()

target = "const userSnap = await getDoc(userRef);"

if target not in content:
    print("Target not found in AuthContext.tsx")
else:
    print("Found target")
