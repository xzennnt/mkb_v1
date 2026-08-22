const fs = require('fs');
let code = fs.readFileSync('src/pages/Flashcard.tsx', 'utf-8');

code = code.replace(
  `        const dueQueue: Vocabulary[] = [];
        fetchedVocabs.forEach(v => {
          const prog = pData[v.id];
          if (prog && (prog.srsLevel === 'good' || prog.srsLevel === 'easy')) {
            mCount++;
          }
          // In a real SRS we'd check if nextReviewTime < Date.now(), 
          // but let's just let the user study all in the category for now, 
          // just placing them in queue
          dueQueue.push(v); 
        });`,
  `        const dueQueue: Vocabulary[] = [];
        const now = Date.now();
        fetchedVocabs.forEach(v => {
          const prog = pData[v.id];
          
          if (!prog || prog.nextReviewTime <= now) {
            dueQueue.push(v);
          }
          
          if (prog && (prog.srsLevel === 'good' || prog.srsLevel === 'easy') && prog.nextReviewTime > now) {
            mCount++;
          }
        });`
);

code = code.replace(
  `  if (initialVocabs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] p-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Tidak ada kartu</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Kembali</button>
      </div>
    );
  }`,
  `  if (initialVocabs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] p-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Tidak ada kartu</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Kembali</button>
      </div>
    );
  }

  if (queue.length === 0 && masteredCount > 0 && !isFinished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] p-4">
        <div className="text-center">
          <h2 className="text-3xl font-black text-[#1a1f36] mb-4">Hebat! 🎉</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-md">
            Kamu sudah mengingat semua kartu dalam kategori ini. Tidak ada kartu yang perlu diulang saat ini. Silakan kembali lagi nanti untuk mereview.
          </p>
          <button 
            onClick={() => navigate(\`/deck/\${encodeURIComponent(category!)}\`)} 
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }`
);

fs.writeFileSync('src/pages/Flashcard.tsx', code);
console.log("Updated due logic");
