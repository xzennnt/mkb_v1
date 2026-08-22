import re

with open('src/pages/DeckView.tsx', 'r') as f:
    content = f.read()

target = """          <button 
            onClick={() => navigate(`/flashcard/${category}`)}
            className="flex items-center justify-center gap-3 bg-white border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-700 font-bold py-4 px-6 rounded-xl transition-all shadow-sm group h-auto min-h-[64px]"
          >
            <BookOpen size={24} className="group-hover:scale-110 transition-transform" />
            Flashcard
          </button>"""

replacement = """          <button 
            onClick={() => navigate(`/flashcard/${category}`)}
            className="flex flex-col items-center justify-center p-6 bg-white border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm group h-full min-h-[160px]"
          >
            <img 
              src="/flashcard-btn.png" 
              alt="Flashcard" 
              className="w-full max-w-[220px] h-auto object-contain group-hover:scale-110 transition-transform drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector('span')) {
                  const span = document.createElement('span');
                  span.className = 'text-indigo-700 font-bold text-2xl';
                  span.innerText = 'Flashcard';
                  parent.appendChild(span);
                }
              }}
            />
          </button>"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/DeckView.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Not found")
