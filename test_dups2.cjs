const j = require('./src/data/jft_a2_1_50.json'); 
const seen = new Map(); 
const diffTrans = [];
j.forEach(v => { 
  if (seen.has(v.jp)) {
    if (seen.get(v.jp).id_translation !== v.id_translation) {
      diffTrans.push({ jp: v.jp, t1: seen.get(v.jp).id_translation, t2: v.id_translation });
    }
  } else {
    seen.set(v.jp, v);
  }
}); 
console.log(diffTrans);
