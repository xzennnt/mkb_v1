import re

def replace_in_file(filename, old_str, new_str):
    with open(filename, 'r') as f:
        content = f.read()
    content = content.replace(old_str, new_str)
    with open(filename, 'w') as f:
        f.write(content)

# Study.tsx
old_study = "      ...(correct ? {} : { isWeak: true })"
new_study = "      ...(correct ? {} : { isWeak: true, weakFlashcard: true, weakQuiz: true })"
replace_in_file('src/pages/Study.tsx', old_study, new_study)

# Quiz.tsx
old_quiz = "      ...(isCorrect ? {} : { isWeak: true })"
new_quiz = "      ...(isCorrect ? {} : { isWeak: true, weakFlashcard: true, weakQuiz: true })"
replace_in_file('src/pages/Quiz.tsx', old_quiz, new_quiz)

