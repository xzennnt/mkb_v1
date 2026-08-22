import re

# 1. Update Flashcard.tsx
with open('src/pages/Flashcard.tsx', 'r') as f:
    content = f.read()
content = content.replace("onClick={() => navigate('/')}", "onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)}")
with open('src/pages/Flashcard.tsx', 'w') as f:
    f.write(content)

# 2. Update ReviewFlashcard.tsx
with open('src/pages/ReviewFlashcard.tsx', 'r') as f:
    content = f.read()
content = content.replace("onClick={() => navigate('/')}", "onClick={() => navigate(`/deck/${encodeURIComponent('Review')}`)}")
with open('src/pages/ReviewFlashcard.tsx', 'w') as f:
    f.write(content)

# 3. Update ReviewFlashcardSRS.tsx
with open('src/pages/ReviewFlashcardSRS.tsx', 'r') as f:
    content = f.read()
content = content.replace("onClick={() => navigate('/')}", "onClick={() => navigate(`/deck/${encodeURIComponent(category!)}`)}")
with open('src/pages/ReviewFlashcardSRS.tsx', 'w') as f:
    f.write(content)

# 4. Update DeckView.tsx button widths
with open('src/pages/DeckView.tsx', 'r') as f:
    content = f.read()

old_btn_1 = """            <button 
              onClick={() => navigate(`/flashcard/${category}`)}
              className="flex items-center justify-center gap-3 bg-[#003399] border border-[#002277] hover:bg-[#002277] text-white font-black text-3xl py-6 px-8 rounded-2xl transition-all shadow-md hover:shadow-lg group w-full flex-1 min-h-[120px]"
            >"""
new_btn_1 = """            <button 
              onClick={() => navigate(`/flashcard/${category}`)}
              className="flex items-center justify-center gap-3 bg-[#003399] border border-[#002277] hover:bg-[#002277] text-white font-black text-3xl py-6 px-8 rounded-2xl transition-all shadow-md hover:shadow-lg group w-full max-w-sm mx-auto flex-1 min-h-[120px]"
            >"""

old_btn_2 = """              <button 
                onClick={() => navigate(`/srs/${category}`)}
                className="flex items-center justify-center gap-2 bg-rose-500 border border-rose-600 hover:bg-rose-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-md group w-full"
              >"""
new_btn_2 = """              <button 
                onClick={() => navigate(`/srs/${category}`)}
                className="flex items-center justify-center gap-2 bg-rose-500 border border-rose-600 hover:bg-rose-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-md group w-full max-w-sm mx-auto"
              >"""

content = content.replace(old_btn_1, new_btn_1)
content = content.replace(old_btn_2, new_btn_2)

# Also make the wrapper flex-col items-center if it's not
old_wrapper = """          <div className="flex flex-col gap-3 h-full">"""
new_wrapper = """          <div className="flex flex-col items-center gap-3 h-full w-full">"""
content = content.replace(old_wrapper, new_wrapper)

with open('src/pages/DeckView.tsx', 'w') as f:
    f.write(content)
