import re

with open('src/data/index.ts', 'r') as f:
    content = f.read()

imports = """import jft_a2 from './jft_a2_1_50.json';
import { hiraganaData, katakanaData, hiraganaAdvancedData, katakanaAdvancedData } from './kana';
import { kataKerja, kataSifatI, kataSifatNa, kataBenda } from './newMaterials';
"""

content = content.replace("import jft_a2 from './jft_a2_1_50.json';\nimport { hiraganaData, katakanaData, hiraganaAdvancedData, katakanaAdvancedData } from './kana';", imports)

new_materials = """
const newMats = [
  ...kataKerja.map((item, idx) => ({ ...item, category: 'Kata Kerja' })),
  ...kataSifatI.map((item, idx) => ({ ...item, category: 'Kata Sifat I' })),
  ...kataSifatNa.map((item, idx) => ({ ...item, category: 'Kata Sifat Na' })),
  ...kataBenda.map((item, idx) => ({ ...item, category: 'Kata Benda' }))
];
"""

content = content.replace("const kana = [...hiraganaData, ...katakanaData, ...hiraganaAdvancedData, ...katakanaAdvancedData];", "const kana = [...hiraganaData, ...katakanaData, ...hiraganaAdvancedData, ...katakanaAdvancedData];\n" + new_materials)

vocab_update = """  ...allJson.map((item: any, idx: number) => ({
    id: `${item.category}_${idx}`,
    jp: item.jp,
    romaji: item.romaji || "",
    id_translation: item.id_translation || "",
    category: item.category,
  })),
  ...newMats.map((item, idx) => ({
    id: `${item.category}_${idx}`,
    jp: item.jp,
    romaji: item.romaji || "",
    id_translation: item.id_translation || "",
    category: item.category,
  })),
  ...kana.map((item, idx) => ({"""

content = content.replace("  ...allJson.map((item: any, idx: number) => ({\n    id: `${item.category}_${idx}`,\n    jp: item.jp,\n    romaji: item.romaji || \"\",\n    id_translation: item.id_translation || \"\",\n    category: item.category,\n  })),\n  ...kana.map((item, idx) => ({", vocab_update)


with open('src/data/index.ts', 'w') as f:
    f.write(content)
