import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Remove the one inside useEffect
content = content.replace("    const [weakCount, setWeakCount] = useState<number>(0);\n\n    // Fetch Due Reviews & Hard Vocabs", "    // Fetch Due Reviews & Hard Vocabs")

# Add it where it should be
if "const [weakCount, setWeakCount]" not in content:
    content = content.replace("const [dueReviewCount, setDueReviewCount] = useState<number>(0);", "const [dueReviewCount, setDueReviewCount] = useState<number>(0);\n  const [weakCount, setWeakCount] = useState<number>(0);")

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

