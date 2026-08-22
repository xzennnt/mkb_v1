import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# 1. Add state for recentUsers
state_target = """  const [dueReviewCount, setDueReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);"""
state_replace = """  const [dueReviewCount, setDueReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);"""

if state_target in content:
    content = content.replace(state_target, state_replace)
else:
    print("State target not found")

# 2. Add fetch logic
fetch_target = """        setDueReviewCount(progSnap.size);
      } catch (err) {"""
fetch_replace = """        setDueReviewCount(progSnap.size);
        
        const usersSnap = await getDocs(query(collection(db, 'users'), limit(50)));
        let usersData = usersSnap.docs.map(d => d.data());
        usersData = usersData.filter(u => u.uid !== currentUser.uid && u.lastActiveDate);
        usersData.sort((a, b) => new Date(b.lastActiveDate).getTime() - new Date(a.lastActiveDate).getTime());
        setRecentUsers(usersData.slice(0, 4));
      } catch (err) {"""

if fetch_target in content:
    content = content.replace(fetch_target, fetch_replace)
else:
    print("Fetch target not found")

# 3. Add to UI
ui_target = """        <div className="lg:col-span-1 h-fit self-start">
          <StreakCalendar history={userData.loginHistory || []} />
        </div>"""
ui_replace = """        <div className="lg:col-span-1 h-fit self-start flex flex-col gap-6">
          <StreakCalendar history={userData.loginHistory || []} />
          
          {recentUsers.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Pelajar Aktif
              </h3>
              <div className="space-y-3">
                {recentUsers.map((u, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {(u.displayName || u.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{u.displayName || u.email?.split('@')[0] || 'User'}</p>
                        <p className="text-[10px] text-slate-500">{u.masteredVocabCount || 0} Vocab Hafal</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      {new Date(u.lastActiveDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>"""

if ui_target in content:
    content = content.replace(ui_target, ui_replace)
else:
    print("UI target not found")

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Dashboard patched successfully")
