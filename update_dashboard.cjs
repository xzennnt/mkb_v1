const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

// Add state for lastActivity
code = code.replace(
  '  const [showMnn2, setShowMnn2] = useState(false);',
  '  const [showMnn2, setShowMnn2] = useState(false);\n  const [lastActivity, setLastActivity] = useState<{title: string, type: string, link: string} | null>(null);'
);

// Add useEffect to load lastActivity
code = code.replace(
  '  useEffect(() => {\n    if (!currentUser) return;',
  `  useEffect(() => {
    if (!currentUser) return;
    
    const activity = localStorage.getItem('last_activity');
    if (activity) {
      try {
        setLastActivity(JSON.parse(activity));
      } catch (e) {}
    }
`
);

// Render widget below header
const widgetCode = `
      {lastActivity && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-indigo-200 font-bold mb-1 text-xs uppercase tracking-widest">Terakhir Dipelajari</h3>
            <p className="text-2xl font-black text-white">{lastActivity.title}</p>
          </div>
          <button onClick={() => navigate(lastActivity.link)} className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-50 transition">
            Lanjutkan
          </button>
        </div>
      )}
`;

code = code.replace(
  '      </header>\n      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">',
  '      </header>\n' + widgetCode + '      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
console.log('Dashboard updated');
