import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add state
content = content.replace("const navigate = useNavigate();", "const navigate = useNavigate();\n  const [showAdminMenu, setShowAdminMenu] = useState(false);")

# Remove ADMIN MODE bar
content = re.sub(r'\{\(userData\?\.role === \'admin\' \|\| userData\?\.role === \'sub_admin\'\).*?</div>\n      \)}', '', content, flags=re.DOTALL)

# Replace Settings link with a dropdown
old_settings = """            {(userData.role === 'admin' || userData.role === 'sub_admin') && (
              <Link to="/admin" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                <Settings size={20} />
              </Link>
            )}"""

new_settings = """            {(userData.role === 'admin' || userData.role === 'sub_admin') && (
              <div className="relative">
                <button onClick={() => setShowAdminMenu(!showAdminMenu)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                  <Settings size={20} />
                </button>
                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{userData.role === 'admin' ? 'Admin Mode' : 'Sub Admin Mode'}</p>
                    </div>
                    <Link to="/admin" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">
                      Ke Admin Panel
                    </Link>
                    {userData.role === 'admin' && (
                      <button onClick={() => { setShowAdminMenu(false); handleResetMyProgress(); }} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium">
                        Reset Progress Saya
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}"""

content = content.replace(old_settings, new_settings)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
