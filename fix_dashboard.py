import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

admin_bar = """      {userData?.role === 'admin' && (
        <div className="bg-slate-800 text-white p-3 rounded-xl mb-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm uppercase tracking-widest text-slate-300">Admin Mode</span>
          </div>
          <button onClick={() => navigate('/admin')} className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">
            Ke Admin Panel
          </button>
        </div>
      )}"""

content = content.replace("      <header className=", admin_bar + "\n      <header className=")

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Fixed Dashboard.tsx!")
