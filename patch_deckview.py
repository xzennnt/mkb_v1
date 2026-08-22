import re

with open('src/pages/DeckView.tsx', 'r') as f:
    content = f.read()

old_wrapper = """<div className="flex flex-col items-center gap-3 h-full w-full">"""
new_wrapper = """<div className="flex flex-col items-center gap-3 w-full sticky top-4">"""

old_btn = """className="flex items-center justify-center gap-3 bg-[#003399] border border-[#002277] hover:bg-[#002277] text-white font-black text-3xl py-6 px-8 rounded-2xl transition-all shadow-md hover:shadow-lg group w-full max-w-sm mx-auto flex-1 min-h-[120px]\""""
new_btn = """className="flex items-center justify-center gap-3 bg-[#003399] border border-[#002277] hover:bg-[#002277] text-white font-black text-3xl py-12 px-8 rounded-2xl transition-all shadow-md hover:shadow-lg group w-full max-w-sm mx-auto min-h-[200px]\""""

content = content.replace(old_wrapper, new_wrapper)
content = content.replace(old_btn, new_btn)

with open('src/pages/DeckView.tsx', 'w') as f:
    f.write(content)
