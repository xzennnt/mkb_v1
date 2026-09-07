const j = require('./src/data/jft_a2_1_50.json'); 
const seen = new Set(); 
const dups = j.filter(v => { if (seen.has(v.jp)) return true; seen.add(v.jp); return false; }); 
console.log(dups.length, dups.slice(0, 5));
