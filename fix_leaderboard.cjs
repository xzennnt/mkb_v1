const fs = require('fs');
let code = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf-8');

code = code.replace(
  "import { Link } from 'react-router-dom';",
  "import { Link } from 'react-router-dom';\nimport { useAuth } from '../contexts/AuthContext';"
);

code = code.replace(
  "export default function Leaderboard() {",
  "export default function Leaderboard() {\n  const { currentUser } = useAuth();"
);

code = code.replace(
  "  useEffect(() => {\n    const fetchLeaders = async () => {",
  "  useEffect(() => {\n    if (!currentUser) return;\n    const fetchLeaders = async () => {"
);

code = code.replace(
  "    fetchLeaders();\n  }, []);",
  "    fetchLeaders();\n  }, [currentUser]);"
);

fs.writeFileSync('src/pages/Leaderboard.tsx', code);
console.log('Leaderboard updated');
