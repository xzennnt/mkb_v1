with open('firestore.rules', 'r') as f:
    content = f.read()

content = content.replace("sessionId.split('_')[0] == request.auth.uid;", "sessionId.matches(request.auth.uid + '_.*');")

with open('firestore.rules', 'w') as f:
    f.write(content)
