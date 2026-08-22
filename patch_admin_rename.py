import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

# Add Edit2 to lucide-react imports
content = content.replace("Trash2 } from 'lucide-react';", "Trash2, Edit2 } from 'lucide-react';")

# Add handleRenameUser
target_handle = "  const handleDeleteUser = async (uid: string) => {"
rename_handle = """  const handleRenameUser = async (uid: string, currentName: string) => {
    const newName = window.prompt('Masukkan nama baru untuk pengguna ini:', currentName || '');
    if (newName !== null && newName.trim() !== '') {
      try {
        await updateDoc(doc(db, 'users', uid), { displayName: newName.trim() });
        setUsers(users.map(u => u.uid === uid ? { ...u, displayName: newName.trim() } : u));
      } catch (err) {
        console.error('Gagal mengganti nama', err);
        alert('Gagal mengganti nama');
      }
    }
  };

  const handleDeleteUser = async (uid: string) => {"""

if "const handleRenameUser" not in content:
    content = content.replace(target_handle, rename_handle)

# Add the UI button
target_button = """                          <button onClick={() => handleDeleteUser(u.uid)} className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition-colors" title="Hapus Akun">
                            <Trash2 size={16} />
                          </button>"""
                          
replace_button = """                          <button onClick={() => handleRenameUser(u.uid, u.displayName || u.email || '')} className="p-1.5 text-blue-500 hover:text-white hover:bg-blue-500 rounded-lg transition-colors" title="Ganti Nama">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteUser(u.uid)} className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition-colors" title="Hapus Akun">
                            <Trash2 size={16} />
                          </button>"""

if "handleRenameUser(u.uid" not in content:
    content = content.replace(target_button, replace_button)


with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)

print("Admin.tsx patched with rename functionality")
