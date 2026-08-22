import re

with open('src/pages/Leaderboard.tsx', 'r') as f:
    content = f.read()

target_render = """                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user.displayName || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {user.masteredVocabCount || 0} Vocab Hafal
                    </p>
                  </div>"""

replacement_render = """                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                      {user.displayName || user.email?.split('@')[0] || 'User'}
                      {user.lastActiveDate && (
                        <span className="text-[9px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                          Aktif {new Date(user.lastActiveDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {user.masteredVocabCount || 0} Vocab Hafal
                    </p>
                  </div>"""

content = content.replace(target_render, replacement_render)

with open('src/pages/Leaderboard.tsx', 'w') as f:
    f.write(content)

print("Leaderboard updated")
