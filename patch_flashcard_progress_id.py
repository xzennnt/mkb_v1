import re

for file in ['src/pages/Flashcard.tsx', 'src/pages/ReviewFlashcard.tsx']:
    with open(file, 'r') as f:
        content = f.read()
    
    old_id_line = "const progressId = currentProg?.id || doc(collection(db, 'user_progress')).id;"
    new_id_line = "const progressId = currentProg?.id && currentProg.id.includes('_') ? currentProg.id : `${currentUser.uid}_${currentCard.id}`;"
    
    content = content.replace(old_id_line, new_id_line)
    
    old_set_doc = "await setDoc(doc(db, 'user_progress', progressId), newProg);"
    new_set_doc = "await setDoc(doc(db, 'user_progress', progressId), newProg, { merge: true });"
    
    content = content.replace(old_set_doc, new_set_doc)
    
    with open(file, 'w') as f:
        f.write(content)
