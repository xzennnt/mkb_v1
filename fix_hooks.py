import re

with open('src/pages/DeckView.tsx', 'r') as f:
    content = f.read()

# The block to move
state_block = """  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };\n"""

# Remove the block from its current location
content = content.replace(state_block, "")

# Insert it before `useEffect(() => { ... fetchVocabs() ... }, [category, currentUser]);`
# Wait, let's insert it right after `const { currentUser } = useAuth();`

target = "const { currentUser } = useAuth();\n"
if target in content:
    content = content.replace(target, target + "\n" + state_block)
    with open('src/pages/DeckView.tsx', 'w') as f:
        f.write(content)
    print("Fixed hooks in DeckView.tsx")
else:
    print("Could not find target to insert hooks")

