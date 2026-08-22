const fs = require('fs');
let content = fs.readFileSync('src/data/index.ts', 'utf-8');
content = content.replace("...allJson.map((item: any) => ({", "...allJson.map((item: any, idx: number) => ({");
content = content.replace("id: `${item.category}_${item.jp}`.replace(/[^a-zA-Z0-9_]/g, '_'),", "id: `${item.category}_${idx}`,");
content = content.replace("...kana.map(item => ({", "...kana.map((item, idx) => ({");
content = content.replace("id: `${item.category}_${item.jp}`.replace(/[^a-zA-Z0-9_]/g, '_'),", "id: `${item.category}_${idx}`,");
fs.writeFileSync('src/data/index.ts', content);
console.log('Fixed index');
