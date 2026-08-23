import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

import_weak = "import WeakQuiz from './pages/WeakQuiz';\nimport WeakFlashcard from './pages/WeakFlashcard';\n"
if 'WeakQuiz' not in content:
    content = content.replace("import ReviewFlashcard from './pages/ReviewFlashcard';", "import ReviewFlashcard from './pages/ReviewFlashcard';\n" + import_weak)

route_weak = """            <Route path="/weak-quiz" element={<PrivateRoute><WeakQuiz /></PrivateRoute>} />
            <Route path="/weak-quiz/:category" element={<PrivateRoute><WeakQuiz /></PrivateRoute>} />
            <Route path="/weak-flashcard" element={<PrivateRoute><WeakFlashcard /></PrivateRoute>} />
            <Route path="/weak-flashcard/:category" element={<PrivateRoute><WeakFlashcard /></PrivateRoute>} />
"""

if '/weak-quiz' not in content:
    content = content.replace('<Route path="/srs/:category"', route_weak + '            <Route path="/srs/:category"')

with open('src/App.tsx', 'w') as f:
    f.write(content)
