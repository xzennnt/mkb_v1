const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/data/index.ts', 'utf-8');

const oldStr = `export const allVocabularies: Vocabulary[] = [
  ...allJson.map((item: any, idx: number) => ({
    id: \`\${item.category}_\${idx}\`,
    jp: item.jp,
    romaji: item.romaji || "",
    id_translation: item.id_translation || "",
    category: item.category,
  })),
  ...newMats.map((item: any, idx) => ({
    id: \`\${item.category}_\${idx}\`,
    jp: item.jp,
    romaji: item.romaji || "",
    id_translation: item.id_translation || "",
    category: item.category,
  })),
  ...kana.map((item: any, idx) => ({
    id: \`\${item.category}_\${idx}\`,
    jp: item.jp,
    romaji: item.romaji || "",
    id_translation: item.id_translation || "",
    category: item.category,
  }))
];`;

const newStr = `const rawVocabularies: Vocabulary[] = [
  ...allJson.map((item: any, idx: number) => ({
    id: \`\${item.category}_\${idx}\`,
    jp: item.jp,
    romaji: item.romaji || "",
    id_translation: item.id_translation || "",
    category: item.category,
  })),
  ...newMats.map((item: any, idx) => ({
    id: \`\${item.category}_\${idx}\`,
    jp: item.jp,
    romaji: item.romaji || "",
    id_translation: item.id_translation || "",
    category: item.category,
  })),
  ...kana.map((item: any, idx) => ({
    id: \`\${item.category}_\${idx}\`,
    jp: item.jp,
    romaji: item.romaji || "",
    id_translation: item.id_translation || "",
    category: item.category,
  }))
];

const seenVocabs = new Set<string>();
export const allVocabularies: Vocabulary[] = rawVocabularies.filter(v => {
  const key = \`\${v.category}_\${v.jp}\`;
  if (seenVocabs.has(key)) return false;
  seenVocabs.add(key);
  return true;
});`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('/app/applet/src/data/index.ts', content);
console.log("Updated index.ts");
