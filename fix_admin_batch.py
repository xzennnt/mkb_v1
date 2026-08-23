import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

# Replace limit(500) with limit(250) and add a delay
old_batch_all = """            const batch = writeBatch(db);
            snap.docs.forEach(d => batch.delete(d.ref));
            await batch.commit();"""

new_batch_all = """            const batch = writeBatch(db);
            snap.docs.forEach(d => batch.delete(d.ref));
            await batch.commit();
            await new Promise(r => setTimeout(r, 1000)); // 1s delay to prevent resource exhaustion"""

content = content.replace(old_batch_all, new_batch_all)
content = content.replace("limit(500)", "limit(250)")

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)
