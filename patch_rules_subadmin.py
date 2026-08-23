with open('firestore.rules', 'r') as f:
    content = f.read()

old_admin = """    function isAdmin() {
      return isAuthenticated() && exists(/databases/$(database)/documents/users/$(request.auth.uid)) && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }"""

new_admin = """    function isAdmin() {
      return isAuthenticated() && exists(/databases/$(database)/documents/users/$(request.auth.uid)) && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isStaff() {
      return isAuthenticated() && exists(/databases/$(database)/documents/users/$(request.auth.uid)) && (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'sub_admin');
    }"""

content = content.replace(old_admin, new_admin)

# Now replace `isAdmin()` with `isStaff()` for things that sub_admin should be able to do.
content = content.replace("allow update: if isOwner(userId) || isAdmin();", "allow update: if isOwner(userId) || isStaff();")
content = content.replace("allow write: if isAdmin();", "allow write: if isStaff();")
content = content.replace("allow read: if isAdmin();", "allow read: if isStaff();")
content = content.replace("allow create: if isAdmin();", "allow create: if isStaff();")
content = content.replace("allow update, delete: if isAdmin();", "allow update, delete: if isStaff();")

with open('firestore.rules', 'w') as f:
    f.write(content)
