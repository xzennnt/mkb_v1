import re

with open('firestore.rules', 'r') as f:
    content = f.read()

# Replace vocabStats rules
old_rules = """    match /vocabStats/{statId} {
      allow read: if isAuthenticated();
      allow write: if isStaff();
    }"""

new_rules = """    match /vocabStats/{statId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }"""

content = content.replace(old_rules, new_rules)

# Replace vocabularies rules just in case they are also being written to
old_vocab = """    match /vocabularies/{vocabId} {
      allow read: if isAuthenticated();
      allow write: if isStaff();
    }"""

new_vocab = """    match /vocabularies/{vocabId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }"""

# Not changing vocabularies unless I find a write. I'll just change vocabStats first.
with open('firestore.rules', 'w') as f:
    f.write(content)

