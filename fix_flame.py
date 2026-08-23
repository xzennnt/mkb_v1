import re

def add_flame(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find lucide-react import
    if 'lucide-react' in content:
        if 'Flame' not in content[:content.find('lucide-react')]:
            content = content.replace("from 'lucide-react'", ", Flame } from 'lucide-react'")
            content = content.replace("}, Flame }", ", Flame }")
            content = content.replace("} , Flame }", ", Flame }")
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Added Flame to {filepath}")

add_flame('src/pages/Dashboard.tsx')
add_flame('src/pages/DeckView.tsx')
