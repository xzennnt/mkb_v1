import re

with open('src/pages/DeckView.tsx', 'r') as f:
    content = f.read()

# 1. Update lucide-react imports to include Zap
target_import = "import { ArrowLeft, Play, BookOpen, ArrowUp } from 'lucide-react';"
replacement_import = "import { ArrowLeft, Play, BookOpen, ArrowUp, Zap } from 'lucide-react';"

if target_import in content:
    content = content.replace(target_import, replacement_import)
else:
    # Just in case it's formatted differently
    content = re.sub(r"from 'lucide-react';", r", Zap } from 'lucide-react';".replace('} ,', ','), content)
    content = content.replace('}, Zap', ', Zap')

# 2. Update the button
target_btn = """          <button 
            onClick={() => navigate(`/flashcard/${category}`)}
            className="flex flex-col items-center justify-center p-2 rounded-3xl transition-all group w-fit mx-auto md:mx-0"
          >
            <img 
              src="/flashcard-btn.png" 
              alt="Flashcard" 
              className="w-full max-w-[160px] h-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md rounded-2xl"
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

replacement_btn = """          <button 
            onClick={() => navigate(`/flashcard/${category}`)}
            className="flex items-center justify-center gap-3 bg-[#003399] border border-[#002277] hover:bg-[#002277] text-white font-black text-3xl py-6 px-8 rounded-2xl transition-all shadow-md hover:shadow-lg group w-full h-full min-h-[140px]"
          >
            <div className="flex flex-col items-center justify-center gap-1 group-hover:scale-105 transition-transform">
              <div className="flex items-center gap-1">
                FLASH<Zap size={32} className="fill-white text-white" />
              </div>
              <div className="tracking-widest uppercase">CARD</div>
            </div>
          </button>"""

if target_btn in content:
    content = content.replace(target_btn, replacement_btn)
    with open('src/pages/DeckView.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Target btn not found")
