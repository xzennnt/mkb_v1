const fs = require('fs');
let code = fs.readFileSync('src/pages/DeckView.tsx', 'utf8');

const oldResetFunc = `      setUserProgressMap({});
      setHardCount(0);
      setWeakCount(0);
      setWeakFlashcardCount(0);
      setWeakQuizCount(0);
      
    } catch (err) {`;

const newResetFunc = `      // Delete associated session states to completely reset the experience
      try {
        const sessionQ = query(collection(db, 'active_sessions'), where('userId', '==', currentUser.uid));
        const sessionSnap = await getDocs(sessionQ);
        const sessionDocsToDelete = [];
        sessionSnap.docs.forEach(d => {
          if (d.id.includes(category || '')) {
            sessionDocsToDelete.push(d.id);
          }
        });
        for (let i = 0; i < sessionDocsToDelete.length; i += batchSize) {
          const chunk = sessionDocsToDelete.slice(i, i + batchSize);
          const promises = chunk.map(id => deleteDoc(doc(db, 'active_sessions', id)));
          await Promise.all(promises);
        }
      } catch (e) {
        console.error("Failed to delete sessions", e);
      }

      // Clear local storage for this category
      if (category) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.includes(category)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      }

      setUserProgressMap({});
      setHardCount(0);
      setWeakCount(0);
      setWeakFlashcardCount(0);
      setWeakQuizCount(0);
      
    } catch (err) {`;

code = code.replace(oldResetFunc, newResetFunc);
fs.writeFileSync('src/pages/DeckView.tsx', code);
console.log("Updated handleResetProgress to clear session state in DeckView.tsx");

