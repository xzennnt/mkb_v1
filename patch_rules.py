with open('firestore.rules', 'r') as f:
    content = f.read()

new_rule = """
    match /active_sessions/{sessionId} {
      allow read, write: if isAuthenticated() && sessionId.split('_')[0] == request.auth.uid;
      allow read, delete: if isAdmin();
    }
  }
}
"""

content = content.replace("  }\n}", new_rule)

with open('firestore.rules', 'w') as f:
    f.write(content)
