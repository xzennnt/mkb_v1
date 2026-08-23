def add_timeout(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find the end of handleAnswer
    # We look for "finishSession = async" and insert the timeout before it, 
    # but handleAnswer ends right before finishSession.
    
    # In Quiz.tsx
    if filepath == 'src/pages/Quiz.tsx':
        if "setTimeout(() => {" not in content:
            # We know it ends with } catch ... or just closing brace.
            # Actually, let's just replace:
            content = content.replace("  };\n\n  const finishSession = async () => {", """
    setTimeout(() => {
      if (currentIndex + 1 < sessionCards.length) {
        setCurrentIndex(prev => prev + 1);
        setupCard(sessionCards[currentIndex + 1], allVocabs, directions[currentIndex + 1]);
      } else {
        finishSession();
      }
    }, 1500);
  };

  const finishSession = async () => {""")
            
    if filepath == 'src/pages/WeakQuiz.tsx':
        if "setTimeout(() => {" not in content:
            content = content.replace("  };\n\n  const finishSession = async () => {", """
    setTimeout(() => {
      if (currentIndex + 1 < sessionCards.length) {
        setCurrentIndex(prev => prev + 1);
        setupCard(sessionCards[currentIndex + 1], allVocabs, directions[currentIndex + 1]);
      } else {
        finishSession();
      }
    }, 1500);
  };

  const finishSession = async () => {""")

    if filepath == 'src/pages/Review.tsx':
        if "setTimeout(() => {" not in content:
            content = content.replace("  };\n\n  const finishSession = async () => {", """
    setTimeout(() => {
      if (currentIndex + 1 < sessionCards.length) {
        setCurrentIndex(prev => prev + 1);
        setupCard(sessionCards[currentIndex + 1], allVocabs, directions[currentIndex + 1]);
      } else {
        finishSession();
      }
    }, 1500);
  };

  const finishSession = async () => {""")
            
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Added timeout to {filepath}")

add_timeout('src/pages/Quiz.tsx')
add_timeout('src/pages/WeakQuiz.tsx')
add_timeout('src/pages/Review.tsx')
