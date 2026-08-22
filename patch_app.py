import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
if "import LevelUpModal" not in content:
    content = content.replace("import ReviewFlashcard from './pages/ReviewFlashcard';", "import ReviewFlashcard from './pages/ReviewFlashcard';\nimport LevelUpModal from './components/LevelUpModal';")

# Add component inside AuthProvider
target = "<Router>"
replace = "<LevelUpModal />\n      <Router>"

content = content.replace(target, replace)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("App patched")
