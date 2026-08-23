import re

with open('src/pages/ReviewFlashcard.tsx', 'r') as f:
    content = f.read()

old_handle = """    setTimeout(() => {
      setQueue(prevQueue => {
        const newQueue = [...prevQueue];
        const card = newQueue.shift(); // remove from front
        
        if (!isRemembered && card) {
          // Do NOT push it back to newQueue. The session is single-pass.
          setNotRememberedIds(prev => {
            if (!prev.includes(card.id)) return [...prev, card.id];
            return prev;
          });
        } else {
          setMasteredCount(m => m + 1);
        }
        
        if (newQueue.length === 0) {
          setIsFinished(true);
        }
        
        setIsProcessing(false);
        return newQueue;
      });
    }, 200);"""

new_handle = """    setTimeout(() => {
      const card = queue[0];
      
      if (!isRemembered && card) {
        setNotRememberedIds(prev => {
          if (!prev.includes(card.id)) return [...prev, card.id];
          return prev;
        });
      } else {
        setMasteredCount(m => m + 1);
      }
      
      const newQueue = queue.slice(1);
      if (newQueue.length === 0) {
        setIsFinished(true);
      }
      
      setQueue(newQueue);
      setIsProcessing(false);
    }, 200);"""

content = content.replace(old_handle, new_handle)

with open('src/pages/ReviewFlashcard.tsx', 'w') as f:
    f.write(content)
