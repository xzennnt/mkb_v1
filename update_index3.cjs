const fs = require('fs');
let code = fs.readFileSync('src/data/index.ts', 'utf-8');

if (!code.includes('mnn2_bab46_50.json')) {
  code = code.replace(
    "import mnn2_bab41_45 from './mnn2_bab41_45.json';",
    "import mnn2_bab41_45 from './mnn2_bab41_45.json';\nimport mnn2_bab46_50 from './mnn2_bab46_50.json';"
  );
  
  code = code.replace(
    "...mnn2_bab41_45",
    "...mnn2_bab41_45,\n  ...mnn2_bab46_50"
  );
  
  fs.writeFileSync('src/data/index.ts', code);
  console.log("Updated index.ts");
} else {
  console.log("Already updated");
}
