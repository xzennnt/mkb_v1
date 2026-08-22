import { Vocabulary } from '../types';
import mnn1_bab1_5 from './mnn1_bab1_5.json';
import mnn1_bab6_8 from './mnn1_bab6_8.json';
import mnn1_bab9_10 from './mnn1_bab9_10.json';
import mnn1_bab11_15 from './mnn1_bab11_15.json';
import mnn1_bab16_20 from './mnn1_bab16_20.json';
import mnn1_bab21_25 from './mnn1_bab21_25.json';
import { hiraganaData, katakanaData, hiraganaAdvancedData, katakanaAdvancedData } from './kana';

// Combine all JSON
const allJson = [
  ...mnn1_bab1_5,
  ...mnn1_bab6_8,
  ...mnn1_bab9_10,
  ...mnn1_bab11_15,
  ...mnn1_bab16_20,
  ...mnn1_bab21_25
];

const kana = [...hiraganaData, ...katakanaData, ...hiraganaAdvancedData, ...katakanaAdvancedData];

// Combine JSON and Kana, then map to Vocabulary format with deterministic ID
export const allVocabularies: Vocabulary[] = [
  ...allJson.map((item: any) => ({
    id: `${item.category}_${item.jp}`.replace(/[^a-zA-Z0-9_]/g, '_'),
    jp: item.jp,
    romaji: item.romaji || "",
    id_translation: item.id_translation || "",
    category: item.category,
  })),
  ...kana.map(item => ({
    id: `${item.category}_${item.jp}`.replace(/[^a-zA-Z0-9_]/g, '_'),
    jp: item.jp,
    romaji: item.romaji || "",
    id_translation: item.id_translation || "",
    category: item.category,
  }))
];

export const getVocabulariesByCategory = (category: string): Vocabulary[] => {
  return allVocabularies.filter(v => v.category === category);
};

export const formatCategoryName = (cat: string) => {
  if (cat.startsWith('MNN1_Bab')) {
    return cat.replace('MNN1_Bab', 'Minna no Nihongo Bab ');
  }
  return cat;
};

export const getCategoriesCount = (): { name: string, count: number, formattedName: string }[] => {
  const counts: Record<string, number> = {};
  allVocabularies.forEach(v => {
    counts[v.category] = (counts[v.category] || 0) + 1;
  });

  const extractNumber = (str: string) => {
    const match = str.match(/\d+/g);
    return match ? parseInt(match[match.length - 1], 10) : 0;
  };

  return Object.keys(counts)
    .filter(k => k !== 'Hiragana' && k !== 'Katakana')
    .map(k => ({ name: k, count: counts[k], formattedName: formatCategoryName(k) }))
    .sort((a, b) => {
      const numA = extractNumber(a.name);
      const numB = extractNumber(b.name);
      if (numA !== numB) return numA - numB;
      return a.name.localeCompare(b.name);
    });
};
