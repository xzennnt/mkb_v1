with open('firestore.rules', 'r') as f:
    content = f.read()

old_rule = """
    match /active_sessions/{sessionId} {
      allow get: if isAuthenticated() && (resource == null || resource.data.userId == request.auth.uid) && sessionId.matches('^' + request.auth.uid + '_.*');
      allow list: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow read: if isAdmin();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid && sessionId.matches('^' + request.auth.uid + '_.*');
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }
"""

new_rule = """
    match /active_sessions/{sessionId} {
      allow get: if isAuthenticated() && (resource == null || resource.data.userId == request.auth.uid) && sessionId.matches('^' + request.auth.uid + '_.*');
      allow list: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow read: if isAdmin();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid && sessionId.matches('^' + request.auth.uid + '_.*');
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && (resource == null || resource.data.userId == request.auth.uid) && sessionId.matches('^' + request.auth.uid + '_.*');
      allow update, delete: if isAdmin();
    }
"""

content = content.replace(old_rule.strip(), new_rule.strip())

with open('firestore.rules', 'w') as f:
    f.write(content)
