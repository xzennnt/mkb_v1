const fs = require('fs');
let code = fs.readFileSync('src/data/index.ts', 'utf-8');
code = code.replace("import mnn1_bab21_25 from './mnn1_bab21_25.json';", "import mnn1_bab21_25 from './mnn1_bab21_25.json';\nimport mnn2_bab26_30 from './mnn2_bab26_30.json';\nimport mnn2_bab31_35 from './mnn2_bab31_35.json';");
code = code.replace("...mnn1_bab21_25", "...mnn1_bab21_25,\n  ...mnn2_bab26_30,\n  ...mnn2_bab31_35");
code = code.replace("return cat.replace('MNN1_Bab', 'Minna no Nihongo Bab ');", "return cat.replace('MNN1_Bab', 'Minna no Nihongo 1 Bab ');\n  }\n  if (cat.startsWith('MNN2_Bab')) {\n    return cat.replace('MNN2_Bab', 'Minna no Nihongo 2 Bab ');");
fs.writeFileSync('src/data/index.ts', code);
