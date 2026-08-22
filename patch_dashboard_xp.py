import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add import
if "import { getXpForLevel }" not in content:
    content = content.replace("import StreakCalendar from '../components/StreakCalendar';", "import StreakCalendar from '../components/StreakCalendar';\nimport { getXpForLevel } from '../utils/levelUtils';")

target = """          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Points</p>
            <p className="font-bold text-indigo-600">{(userData.points || 0).toLocaleString()} XP</p>
          </div>"""

# calculate current and next level xp logic
# In Dashboard component body we could just calculate it inline, but wait, Dashboard doesn't have it as variable.
# We can do it inline in JSX:

replace = """          <div className="text-right hidden sm:block min-w-[120px]">
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Points</p>
            <p className="font-bold text-indigo-600">{(userData.points || 0).toLocaleString()} XP</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, ((userData.points || 0) - getXpForLevel(userData.level || 1)) / (getXpForLevel((userData.level || 1) + 1) - getXpForLevel(userData.level || 1)) * 100))}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">{getXpForLevel((userData.level || 1) + 1) - (userData.points || 0)} XP ke Lv {(userData.level || 1) + 1}</p>
          </div>"""

content = content.replace(target, replace)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Dashboard patched with XP progress")
