import re

with open('src/pages/DeckView.tsx', 'r') as f:
    content = f.read()

# Add imports for ArrowUp if it's not there
if 'ArrowUp' not in content:
    content = content.replace("from 'lucide-react';", ", ArrowUp } from 'lucide-react';")
    content = content.replace("ArrowLeft, Play, BookOpen", "ArrowLeft, Play, BookOpen, ArrowUp")

# Add state
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
  };"""

content = content.replace("const totalSessions = Math.ceil(vocabs.length / 10);", f"const totalSessions = Math.ceil(vocabs.length / 10);\n{state_block}")

# Add button
btn_block = """      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 hover:-translate-y-1 transition-all z-50 flex items-center justify-center"
          title="Ke Atas"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>"""

content = content.replace("    </div>\n  );\n}", btn_block + "\n  );\n}")

with open('src/pages/DeckView.tsx', 'w') as f:
    f.write(content)
