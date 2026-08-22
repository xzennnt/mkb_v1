import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

# Update import
content = content.replace("UploadCloud,", "LayoutDashboard,")
content = content.replace("UploadCloud }", "LayoutDashboard }")

# Change initial tab
content = content.replace("useState<'upload' | 'users' | 'sessions' | 'difficult'>('upload')", "useState<'users' | 'sessions' | 'difficult'>('users')")

# Replace upload tab button with Dashboard button
old_btn = """          <button 
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'upload' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <UploadCloud size={16} /> Data Base
          </button>"""

new_btn = """          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all text-slate-500 hover:text-slate-800 hover:bg-slate-200"
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>"""

if old_btn in content:
    content = content.replace(old_btn, new_btn)
else:
    print("Old button not found")

# We also need to add `const navigate = useNavigate();` if it's not there.
if "const navigate =" not in content:
    content = content.replace("export default function Admin() {", "import { useNavigate } from 'react-router-dom';\n\nexport default function Admin() {\n  const navigate = useNavigate();")

# Remove the actual tab content for upload
upload_content = """      {activeTab === 'upload' && (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Manajemen Data Kosakata</h2>
          <div className="text-sm text-slate-500 mb-6">
            Upload kustom via JSON atau Firebase seeding telah dinonaktifkan. Silakan tambahkan file vocabularies secara langsung ke dalam aplikasi.
          </div>
        </div>
      )}"""

if upload_content in content:
    content = content.replace(upload_content, "")
else:
    print("Upload content not found")

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)
print("Fixed Admin.tsx!")

