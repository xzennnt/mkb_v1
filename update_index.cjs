const fs = require('fs');
let code = fs.readFileSync('src/data/index.ts', 'utf-8');

if (!code.includes('mnn2_bab36_40.json')) {
  code = code.replace(
    "import mnn2_bab31_35 from './mnn2_bab31_35.json';",
    "import mnn2_bab31_35 from './mnn2_bab31_35.json';\nimport mnn2_bab36_40 from './mnn2_bab36_40.json';"
  );
  
  code = code.replace(
    "...mnn2_bab31_35",
    "...mnn2_bab31_35,\n  ...mnn2_bab36_40"
  );
  
  fs.writeFileSync('src/data/index.ts', code);
  console.log("Updated index.ts");
} else {
  console.log("Already updated");
}
