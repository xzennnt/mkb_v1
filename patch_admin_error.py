import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

old_error = """        console.error('Gagal reset progress', err);
        alert('Gagal reset progress');"""

new_error = """        console.error('Gagal reset progress', err);
        alert('Gagal reset progress: ' + (err.message || err));"""

content = content.replace(old_error, new_error)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)
