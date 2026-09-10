const fs = require('fs');

function injectPoints(file) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Find the try block for setDoc
    const regex = /try\s*\{\s*await setDoc\(doc\(db, 'user_progress', progressId\), newProg, \{ merge: true \}\);\s*\}\s*catch\s*\(err\)\s*\{\s*console\.error\('Failed to update progress', err\);\s*\}/g;
    
    const replacement = `try {
        await setDoc(doc(db, 'user_progress', progressId), newProg, { merge: true });
        
        if (isRemembered && currentUser) {
           const userRef = doc(db, 'users', currentUser.uid);
           await updateDoc(userRef, {
             points: increment(5)
           }).catch(() => {});
        }
      } catch (err) {
        console.error('Failed to update progress', err);
      }`;
      
    code = code.replace(regex, replacement);
    
    if (!code.includes('increment')) {
        code = code.replace("updateDoc } from 'firebase/firestore';", "updateDoc, increment } from 'firebase/firestore';");
    }
    fs.writeFileSync(file, code);
}

injectPoints('src/pages/Flashcard.tsx');
injectPoints('src/pages/ReviewFlashcardSRS.tsx');
