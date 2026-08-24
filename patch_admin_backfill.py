import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

backfill_fn = """
  const handleDynamicBackfill = async () => {
    try {
      setLoading(true);
      setStatus('Menambal data kategori yang hilang (Backfill)...');
      
      const progSnap = await getDocs(collection(db, 'user_progress'));
      let count = 0;
      
      const batch = writeBatch(db);
      
      progSnap.docs.forEach((d) => {
        const data = d.data();
        if (!data.category) {
          let cat = null;
          const v = allVocabularies.find(voc => voc.id === data.vocabId);
          if (v) cat = v.category;
          else if (data.vocabId && data.vocabId.includes('_')) {
             const parts = data.vocabId.split('_');
             parts.pop();
             cat = parts.join('_');
          }
          
          if (cat) {
            batch.update(doc(db, 'user_progress', d.id), { category: cat });
            count++;
          }
        }
      });
      
      if (count > 0) {
        await batch.commit();
        setStatus(`Berhasil menambal ${count} riwayat belajar!`);
      } else {
        setStatus('Semua riwayat belajar sudah memiliki kategori (Tidak ada yang ditambal).');
      }
    } catch (err: any) {
      console.error(err);
      setStatus('Gagal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
"""

content = content.replace("  const handleSeedBab1to10 = async () => {", backfill_fn + "\n  const handleSeedBab1to10 = async () => {")

new_btns = """            <button 
              onClick={handleDynamicBackfill}
              disabled={loading}
              className="px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Backfill Kategori (Perbaikan Bug)
            </button>"""

content = content.replace("            <button \n              onClick={handleSeedKana}", new_btns + "\n            <button \n              onClick={handleSeedKana}")

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)
