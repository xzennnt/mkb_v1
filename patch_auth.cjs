const fs = require('fs');
let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf-8');

const target1 = `                    if (user.email === 'edwinageng113@gmail.com' && data.role !== 'admin') {
            data.role = 'admin';
            shouldUpdate = true;
          }`;

const replace1 = `                    if (user.email === 'edwinageng113@gmail.com' && data.role !== 'admin') {
            data.role = 'admin';
            shouldUpdate = true;
          } else if (user.email !== 'edwinageng113@gmail.com' && data.role === 'admin') {
            data.role = 'user';
            shouldUpdate = true;
          }`;

content = content.replace(target1, replace1);

const target2 = `            if (data.role === 'admin') {
              updates.role = 'admin';
            }`;

const replace2 = `            if (updates.role === undefined && data.role) {
              updates.role = data.role;
            }`;

content = content.replace(target2, replace2);

fs.writeFileSync('src/contexts/AuthContext.tsx', content);
console.log('AuthContext patched');
