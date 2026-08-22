import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove the line redirecting admin to /admin in PrivateRoute
target = "  if (userData?.role === 'admin') return <Navigate to=\"/admin\" />;\n"
if target in content:
    content = content.replace(target, "")
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Fixed App.tsx!")
else:
    print("Target not found.")

