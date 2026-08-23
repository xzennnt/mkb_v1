import re

with open('firestore.rules', 'r') as f:
    content = f.read()

old_users_rule = """    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isStaff();
    }"""

new_users_rule = """    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isStaff();
      allow delete: if isStaff();
    }"""

content = content.replace(old_users_rule, new_users_rule)

with open('firestore.rules', 'w') as f:
    f.write(content)
