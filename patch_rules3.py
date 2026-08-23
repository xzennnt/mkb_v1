with open('firestore.rules', 'r') as f:
    content = f.read()

old_rule = """
    match /active_sessions/{sessionId} {
      allow read, write: if isAuthenticated() && sessionId.matches(request.auth.uid + '_.*');
      allow read, delete: if isAdmin();
    }
"""

new_rule = """
    match /active_sessions/{sessionId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow read: if isAdmin();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }
"""

# Try to find the old rule block or just replace from match /active_sessions
import re
content = re.sub(r'match /active_sessions/\{sessionId\} \{.*?\n    \}', new_rule.strip(), content, flags=re.DOTALL)

with open('firestore.rules', 'w') as f:
    f.write(content)
