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

const hAdvRaw = [
  'が:ga', 'ぎ:gi', 'ぐ:gu', 'げ:ge', 'ご:go',
  'ざ:za', 'じ:ji', 'ず:zu', 'ぜ:ze', 'ぞ:zo',
  'だ:da', 'ぢ:ji', 'づ:zu', 'で:de', 'ど:do',
  'ば:ba', 'び:bi', 'ぶ:bu', 'べ:be', 'ぼ:bo',
  'ぱ:pa', 'ぴ:pi', 'ぷ:pu', 'ぺ:pe', 'ぽ:po',
  'きゃ:kya', 'きゅ:kyu', 'きょ:kyo', 'empty:', 'empty:',
  'しゃ:sha', 'しゅ:shu', 'しょ:sho', 'empty:', 'empty:',
  'ちゃ:cha', 'ちゅ:chu', 'ちょ:cho', 'empty:', 'empty:',
  'にゃ:nya', 'にゅ:nyu', 'にょ:nyo', 'empty:', 'empty:',
  'ひゃ:hya', 'ひゅ:hyu', 'ひょ:hyo', 'empty:', 'empty:',
  'みゃ:mya', 'みゅ:myu', 'みょ:myo', 'empty:', 'empty:',
  'りゃ:rya', 'りゅ:ryu', 'りょ:ryo', 'empty:', 'empty:',
  'ぎゃ:gya', 'ぎゅ:gyu', 'ぎょ:gyo', 'empty:', 'empty:',
  'じゃ:ja', 'じゅ:ju', 'じょ:jo', 'empty:', 'empty:',
  'びゃ:bya', 'びゅ:byu', 'びょ:byo', 'empty:', 'empty:',
  'ぴゃ:pya', 'ぴゅ:pyu', 'ぴょ:pyo', 'empty:', 'empty:',
  'っ:sokuon', 'empty:', 'empty:', 'empty:', 'empty:'
];

export const hiraganaAdvancedGrid: KanaItem[] = hAdvRaw.map(str => {
  const [jp, romaji] = str.split(':');
  if (jp === 'empty') return { jp: '', romaji: '', empty: true };
  return { jp, romaji, empty: false };
});

const kAdvRaw = [
  'ガ:ga', 'ギ:gi', 'グ:gu', 'ゲ:ge', 'ゴ:go',
  'ザ:za', 'ジ:ji', 'ズ:zu', 'ゼ:ze', 'ゾ:zo',
  'ダ:da', 'ヂ:ji', 'ヅ:zu', 'デ:de', 'ド:do',
  'バ:ba', 'ビ:bi', 'ブ:bu', 'ベ:be', 'ボ:bo',
  'パ:pa', 'ピ:pi', 'プ:pu', 'ペ:pe', 'ポ:po',
  'キャ:kya', 'キュ:kyu', 'キョ:kyo', 'empty:', 'empty:',
  'シャ:sha', 'シュ:shu', 'ショ:sho', 'empty:', 'empty:',
  'チャ:cha', 'チュ:chu', 'チョ:cho', 'empty:', 'empty:',
  'ニャ:nya', 'ニュ:nyu', 'ニョ:nyo', 'empty:', 'empty:',
  'ヒャ:hya', 'ヒュ:hyu', 'ヒョ:hyo', 'empty:', 'empty:',
  'ミャ:mya', 'ミュ:myu', 'ミョ:myo', 'empty:', 'empty:',
  'リャ:rya', 'リュ:ryu', 'リョ:ryo', 'empty:', 'empty:',
  'ギャ:gya', 'ギュ:gyu', 'ギョ:gyo', 'empty:', 'empty:',
  'ジャ:ja', 'ジュ:ju', 'ジョ:jo', 'empty:', 'empty:',
  'ビャ:bya', 'ビュ:byu', 'ビョ:byo', 'empty:', 'empty:',
  'ピャ:pya', 'ピュ:pyu', 'ピョ:pyo', 'empty:', 'empty:',
  'ッ:sokuon', 'empty:', 'empty:', 'empty:', 'empty:'
];

export const katakanaAdvancedGrid: KanaItem[] = kAdvRaw.map(str => {
  const [jp, romaji] = str.split(':');
  if (jp === 'empty') return { jp: '', romaji: '', empty: true };
  return { jp, romaji, empty: false };
});

export const hiraganaAdvancedData = hiraganaAdvancedGrid.filter(k => !k.empty).map(k => ({
  id: `ha_${k.romaji}`,
  jp: k.jp,
  id_translation: k.romaji,
  category: 'Hiragana Lanjutan',
  romaji: k.romaji
}));

export const katakanaAdvancedData = katakanaAdvancedGrid.filter(k => !k.empty).map(k => ({
  id: `ka_${k.romaji}`,
  jp: k.jp,
  id_translation: k.romaji,
  category: 'Katakana Lanjutan',
  romaji: k.romaji
}));
