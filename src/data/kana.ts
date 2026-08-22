export type KanaItem = {
  jp: string;
  romaji: string;
  empty: boolean;
};

const hRaw = [
  'あ:a', 'い:i', 'う:u', 'え:e', 'お:o',
  'か:ka', 'き:ki', 'く:ku', 'け:ke', 'こ:ko',
  'さ:sa', 'し:shi', 'す:su', 'せ:se', 'そ:so',
  'た:ta', 'ち:chi', 'つ:tsu', 'て:te', 'と:to',
  'な:na', 'に:ni', 'ぬ:nu', 'ね:ne', 'の:no',
  'は:ha', 'ひ:hi', 'ふ:fu', 'へ:he', 'ほ:ho',
  'ま:ma', 'み:mi', 'む:mu', 'め:me', 'も:mo',
  'や:ya', 'empty:yi', 'ゆ:yu', 'empty:ye', 'よ:yo',
  'ら:ra', 'り:ri', 'る:ru', 'れ:re', 'ろ:ro',
  'わ:wa', 'empty:wi', 'empty:wu', 'empty:we', 'を:wo',
  'ん:n', 'empty:', 'empty:', 'empty:', 'empty:'
];

export const hiraganaGrid: KanaItem[] = hRaw.map(str => {
  const [jp, romaji] = str.split(':');
  if (jp === 'empty') return { jp: '', romaji: '', empty: true };
  return { jp, romaji, empty: false };
});

const kRaw = [
  'ア:a', 'イ:i', 'ウ:u', 'エ:e', 'オ:o',
  'カ:ka', 'キ:ki', 'ク:ku', 'ケ:ke', 'コ:ko',
  'サ:sa', 'シ:shi', 'ス:su', 'セ:se', 'ソ:so',
  'タ:ta', 'チ:chi', 'ツ:tsu', 'テ:te', 'ト:to',
  'ナ:na', 'ニ:ni', 'ヌ:nu', 'ネ:ne', 'ノ:no',
  'ハ:ha', 'ヒ:hi', 'フ:fu', 'ヘ:he', 'ホ:ho',
  'マ:ma', 'ミ:mi', 'ム:mu', 'メ:me', 'モ:mo',
  'ヤ:ya', 'empty:yi', 'ユ:yu', 'empty:ye', 'ヨ:yo',
  'ラ:ra', 'リ:ri', 'ル:ru', 'レ:re', 'ロ:ro',
  'ワ:wa', 'empty:wi', 'empty:wu', 'empty:we', 'ヲ:wo',
  'ン:n', 'empty:', 'empty:', 'empty:', 'empty:'
];

export const katakanaGrid: KanaItem[] = kRaw.map(str => {
  const [jp, romaji] = str.split(':');
  if (jp === 'empty') return { jp: '', romaji: '', empty: true };
  return { jp, romaji, empty: false };
});

export const hiraganaData = hiraganaGrid.filter(k => !k.empty).map(k => ({
  id: `h_${k.romaji}`,
  jp: k.jp,
  id_translation: k.romaji,
  category: 'Hiragana',
  romaji: k.romaji
}));

export const katakanaData = katakanaGrid.filter(k => !k.empty).map(k => ({
  id: `k_${k.romaji}`,
  jp: k.jp,
  id_translation: k.romaji,
  category: 'Katakana',
  romaji: k.romaji
}));
