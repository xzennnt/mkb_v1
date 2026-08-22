import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

target = "<p className=\"text-xs text-rose-600 font-bold mt-1\">Exp x{(1 + ((userData.loginStreak || 1) - 1) * 0.05).toFixed(2)}</p>"
replace = "<p className=\"text-xs text-rose-600 font-bold mt-1\">Exp x{Math.min(3.0, 1 + (((userData.loginStreak || 1) - 1) * 0.1)).toFixed(1)}</p>"

content = content.replace(target, replace)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Dashboard patched streak UI")
