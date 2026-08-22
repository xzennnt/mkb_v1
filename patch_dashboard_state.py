with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

target = "const [dueReviewCount, setDueReviewCount] = useState<number>(0);"
replace = "const [dueReviewCount, setDueReviewCount] = useState<number>(0);\n  const [recentUsers, setRecentUsers] = useState<any[]>([]);"

content = content.replace(target, replace)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

print("State patched")
