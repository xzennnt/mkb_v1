import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

content = content.replace("alert('Gagal menghapus user');", "alert('Gagal menghapus user: ' + (err.message || err));")

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)
