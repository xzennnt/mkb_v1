const jft = require('./src/data/jft_a2_1_50.json');
const allJson = [...jft];
const temp = allJson.map((item, idx) => ({
    id: `${item.category}_${idx}`,
    jp: item.jp,
    romaji: item.romaji || "",
    id_translation: item.id_translation || "",
    category: item.category,
}));

const seen = new Set();
const dedup = temp.filter(v => {
    const key = `${v.category}_${v.jp}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
});
console.log("Raw count:", temp.length);
console.log("Dedup count:", dedup.length);
