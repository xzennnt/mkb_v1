import re

with open('src/pages/ReviewFlashcardSRS.tsx', 'r') as f:
    content = f.read()

target_back = """                {/* Belakang */}
                <div 
                  className="absolute inset-0 bg-[#003399] rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 [backface-visibility:hidden] [transform:rotateY(180deg)] text-white"
                >
                  {currentCard?.romaji && (
                    <p className="text-blue-200 text-2xl font-medium mb-4 text-center">{currentCard.romaji}</p>
                  )}
                  <h3 className="text-4xl md:text-5xl font-black text-center leading-tight mb-8">
                    {currentCard?.id_translation}
                  </h3>
                  <p className="text-blue-300 font-bold tracking-widest uppercase text-sm mt-auto">Pilih level hafalan</p>
                </div>"""

replacement_back = """                {/* Belakang */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-100 flex flex-col items-center justify-center p-8 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                >
                  <h2 className="text-4xl md:text-5xl font-black text-[#1a1f36] text-center mb-4">{currentCard?.id_translation}</h2>
                  {currentCard?.romaji && <p className="text-slate-500 text-xl font-medium text-center">{currentCard?.romaji}</p>}
                </div>"""

content = content.replace(target_back, replacement_back)

with open('src/pages/ReviewFlashcardSRS.tsx', 'w') as f:
    f.write(content)
print("Updated SRS card styling to match main flashcard")
