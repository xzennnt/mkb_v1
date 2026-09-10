const fs = require('fs');

let code = fs.readFileSync('src/pages/Flashcard.tsx', 'utf8');

const oldRating = `            try {
        await setDoc(doc(db, 'user_progress', progressId), newProg, { merge: true });
      } catch (err) {
        console.error('Failed to update progress', err);
      }`;

const newRating = `            try {
        await setDoc(doc(db, 'user_progress', progressId), newProg, { merge: true });
        
        // Add points if remembered correctly
        if (isRemembered) {
           const userRef = doc(db, 'users', currentUser.uid);
           const pointsGained = 5; // Flashcards give 5 points per successful rating
           await updateDoc(userRef, {
             points: increment(pointsGained)
           });
        }
      } catch (err) {
        console.error('Failed to update progress', err);
      }`;

code = code.replace(oldRating, newRating);
// Ensure we add import for increment if it's missing in Flashcard.tsx
if (!code.includes('increment')) {
   code = code.replace("import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';", 
                       "import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs, updateDoc, increment } from 'firebase/firestore';");
}
fs.writeFileSync('src/pages/Flashcard.tsx', code);

// Now ReviewFlashcardSRS
let codeSRS = fs.readFileSync('src/pages/ReviewFlashcardSRS.tsx', 'utf8');
const oldRatingSRS = `            try {
        await setDoc(doc(db, 'user_progress', progressId), newProg, { merge: true });
      } catch (err) {
        console.error('Failed to update progress', err);
      }`;
      
const newRatingSRS = `            try {
        await setDoc(doc(db, 'user_progress', progressId), newProg, { merge: true });
        
        if (isRemembered) {
           const userRef = doc(db, 'users', currentUser.uid);
           const pointsGained = 10; 
           await updateDoc(userRef, {
             points: increment(pointsGained)
           });
        }
      } catch (err) {
        console.error('Failed to update progress', err);
      }`;

codeSRS = codeSRS.replace(oldRatingSRS, newRatingSRS);
if (!codeSRS.includes('increment')) {
   codeSRS = codeSRS.replace("import { doc, getDocs, setDoc, collection, query, where, updateDoc } from 'firebase/firestore';", 
                             "import { doc, getDocs, setDoc, collection, query, where, updateDoc, increment } from 'firebase/firestore';");
}
fs.writeFileSync('src/pages/ReviewFlashcardSRS.tsx', codeSRS);

