import re

with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

# Replace getFirestore with initializeFirestore
content = content.replace("import { getFirestore } from 'firebase/firestore';", "import { initializeFirestore } from 'firebase/firestore';")

# Replace export const db = getFirestore(app);
content = content.replace("export const db = getFirestore(app);", """export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});""")

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)

