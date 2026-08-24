import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

# Add imports
imports = """import mnnBab1_5 from '../data/mnn1_bab1_5.json';
import mnnBab6_8 from '../data/mnn1_bab6_8.json';
import mnnBab9_10 from '../data/mnn1_bab9_10.json';
import { kataKerja, kataSifatI, kataSifatNa, kataBenda } from '../data/newMaterials';
"""
content = content.replace("import mnnBab1_5 from '../data/mnn1_bab1_5.json';\nimport mnnBab6_8 from '../data/mnn1_bab6_8.json';\nimport mnnBab9_10 from '../data/mnn1_bab9_10.json';", imports)

new_fn = """
  const handleSeedNewMaterials = async () => {
    try {
      setLoading(true);
      setStatus('Menambahkan materi baru (Kata Kerja, Sifat, Benda)...');
      
      let count = 0;
      const categories = [
        { items: kataKerja, cat: 'Kata Kerja' },
        { items: kataSifatI, cat: 'Kata Sifat I' },
        { items: kataSifatNa, cat: 'Kata Sifat Na' },
        { items: kataBenda, cat: 'Kata Benda' }
      ];

      for (const group of categories) {
        for (const item of group.items) {
          const safeId = `${group.cat}_${item.jp}`.replace(/[^a-zA-Z0-9_]/g, '_');
          const docRef = doc(db, 'vocabularies', safeId);
          await setDoc(docRef, {
            jp: item.jp,
            romaji: "", // None provided in new material
            id_translation: item.id_translation || "",
            category: group.cat,
            createdAt: Date.now()
          });
          count++;
        }
      }
      
      setStatus(`Berhasil menambahkan ${count} kosakata baru!`);
    } catch (err: any) {
      console.error(err);
      setStatus('Gagal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
"""

content = content.replace("  const handleSeedBab1to10 = async () => {", new_fn + "\n  const handleSeedBab1to10 = async () => {")

old_btns = """            <button 
              onClick={handleSeedKana}
              disabled={loading}
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Seed Hiragana & Katakana
            </button>
            <button 
              onClick={handleSeedBab1to10}
              disabled={loading}
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Seed MNN Bab 1-10
            </button>"""

new_btns = """            <button 
              onClick={handleSeedKana}
              disabled={loading}
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Seed Hiragana & Katakana
            </button>
            <button 
              onClick={handleSeedBab1to10}
              disabled={loading}
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Seed MNN Bab 1-10
            </button>
            <button 
              onClick={handleSeedNewMaterials}
              disabled={loading}
              className="px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Seed Materi Baru (Kata Kerja, Sifat, Benda)
            </button>"""

content = content.replace(old_btns, new_btns)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)
