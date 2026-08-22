import re

def patch(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    content = content.replace("const { currentUser } = useAuth();", "const { currentUser, userData } = useAuth();")
    
    with open(filename, 'w') as f:
        f.write(content)

patch('src/pages/Quiz.tsx')
patch('src/pages/Review.tsx')
patch('src/pages/Study.tsx')
