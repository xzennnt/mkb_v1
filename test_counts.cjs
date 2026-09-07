const jft = require('./src/data/jft_a2_1_50.json');
const counts = {};
jft.forEach(v => {
  counts[v.category] = (counts[v.category] || 0) + 1;
});
console.log(counts);
