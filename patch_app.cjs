const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace("import Admin from './pages/Admin';", "import Admin from './pages/Admin';\nimport Banned from './pages/Banned';");

const targetPrivate = `  if (!currentUser) return <Navigate to="/login" />;
  if (!userData?.isProfileComplete) return <Navigate to="/setup-profile" />;`;

const replacePrivate = `  if (!currentUser) return <Navigate to="/login" />;
  if (userData?.isBanned) return <Navigate to="/banned" />;
  if (!userData?.isProfileComplete) return <Navigate to="/setup-profile" />;`;

content = content.replace(targetPrivate, replacePrivate);

const targetAdmin = `  if (!currentUser) return <Navigate to="/login" />;
  if (!userData?.isProfileComplete) return <Navigate to="/setup-profile" />;`;

const replaceAdmin = `  if (!currentUser) return <Navigate to="/login" />;
  if (userData?.isBanned) return <Navigate to="/banned" />;
  if (!userData?.isProfileComplete) return <Navigate to="/setup-profile" />;`;

content = content.replace(targetAdmin, replaceAdmin);

const targetSetup = `  if (!currentUser) return <Navigate to="/login" />;
  if (userData?.isProfileComplete) return <Navigate to="/" />;`;

const replaceSetup = `  if (!currentUser) return <Navigate to="/login" />;
  if (userData?.isBanned) return <Navigate to="/banned" />;
  if (userData?.isProfileComplete) return <Navigate to="/" />;`;

content = content.replace(targetSetup, replaceSetup);

content = content.replace('<Routes>', '<Routes>\n            <Route path="/banned" element={<Banned />} />');

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx patched');
