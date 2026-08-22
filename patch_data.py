import re

with open('src/data/index.ts', 'r') as f:
    content = f.read()

if "import jft_a2" not in content:
    content = content.replace("import mnn2_bab46_50 from './mnn2_bab46_50.json';", "import mnn2_bab46_50 from './mnn2_bab46_50.json';\nimport jft_a2 from './jft_a2_1_50.json';")

if "...mnn2_bab46_50" in content and "...jft_a2" not in content:
    content = content.replace("  ...mnn2_bab46_50\n];", "  ...mnn2_bab46_50,\n  ...jft_a2\n];")

if "JFT_A2" not in content:
    format_cat = """  if (cat.startsWith('MNN2_Bab')) {
    return cat.replace('MNN2_Bab', 'Minna no Nihongo 2 Bab ');
  }"""
    replace_cat = """  if (cat.startsWith('MNN2_Bab')) {
    return cat.replace('MNN2_Bab', 'Minna no Nihongo 2 Bab ');
  }
  if (cat.startsWith('JFT_A2')) {
    return 'Kosakata JFT A2 (1-50)';
  }"""
    content = content.replace(format_cat, replace_cat)

with open('src/data/index.ts', 'w') as f:
    f.write(content)
