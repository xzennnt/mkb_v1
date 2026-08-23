import re

with open('firestore.rules', 'r') as f:
    content = f.read()

# Make user_progress update more resilient
old_prog = """    match /user_progress/{progressId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow read: if isStaff();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow create: if isStaff();
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow update, delete: if isStaff();
    }"""

new_prog = """    match /user_progress/{progressId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow read: if isStaff();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow create: if isStaff();
      allow update: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow update, delete: if isStaff();
    }"""

content = content.replace(old_prog, new_prog)

# Let's also do the same for active_sessions just in case
old_active = """    match /active_sessions/{sessionId} {
      allow get: if isAuthenticated() && (resource == null || resource.data.userId == request.auth.uid) && sessionId.matches('^' + request.auth.uid + '_.*');
      allow list: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow read: if isStaff();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid && sessionId.matches('^' + request.auth.uid + '_.*');
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && (resource == null || resource.data.userId == request.auth.uid) && sessionId.matches('^' + request.auth.uid + '_.*');
      allow update, delete: if isStaff();
    }"""

new_active = """    match /active_sessions/{sessionId} {
      allow get: if isAuthenticated() && (resource == null || resource.data.userId == request.auth.uid) && sessionId.matches('^' + request.auth.uid + '_.*');
      allow list: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow read: if isStaff();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid && sessionId.matches('^' + request.auth.uid + '_.*');
      allow update: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && (resource == null || resource.data.userId == request.auth.uid) && sessionId.matches('^' + request.auth.uid + '_.*');
      allow update, delete: if isStaff();
    }"""

content = content.replace(old_active, new_active)

with open('firestore.rules', 'w') as f:
    f.write(content)

