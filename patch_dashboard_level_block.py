import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

target = """          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Level Saat Ini</p>
            <p className="text-3xl font-black text-slate-800">{userData.level}</p>
          </div>"""

replace = """          <div className="flex-1 w-full min-w-0">
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Level Saat Ini</p>
            <div className="flex items-end gap-2 mb-1.5">
              <p className="text-3xl font-black text-slate-800 leading-none">{userData.level}</p>
              <p className="text-xs font-bold text-slate-400 mb-0.5 truncate">{userData.points || 0} / {getXpForLevel((userData.level || 1) + 1)} XP</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, ((userData.points || 0) - getXpForLevel(userData.level || 1)) / (getXpForLevel((userData.level || 1) + 1) - getXpForLevel(userData.level || 1)) * 100))}%` }}
              ></div>
            </div>
          </div>"""

content = content.replace(target, replace)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Dashboard patched level block")
