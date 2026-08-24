import re

def replace_in_file(filename, old_str, new_str):
    with open(filename, 'r') as f:
        content = f.read()
    if old_str not in content:
        print(f"Failed to find old string in {filename}")
        return
    content = content.replace(old_str, new_str)
    with open(filename, 'w') as f:
        f.write(content)

old_str = """          // Kuiz 2-arah is the ultimate test. If they pass, they graduate.
          await updateDoc(progressRef, { isWeak: false, weakFlashcard: false, weakQuiz: false }).catch(console.error);"""

new_str = """          try {
            const progSnap = await getDoc(progressRef);
            if (progSnap.exists()) {
              const pData = progSnap.data();
              if (pData.weakFlashcard === false) {
                 await updateDoc(progressRef, { isWeak: false, weakQuiz: false });
              } else {
                 await updateDoc(progressRef, { weakQuiz: false });
              }
            }
          } catch(e) { console.error(e); }"""

replace_in_file('src/pages/WeakQuiz.tsx', old_str, new_str)

