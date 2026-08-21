import { Vocabulary, UserProgress } from '../types';

export const calculateNextReview = (
  timeSpentSec: number,
  isCorrect: boolean,
  currentIntervalMinutes: number
): { srsLevel: UserProgress['srsLevel']; nextInterval: number; nextReviewTime: number } => {
  const now = Date.now();
  
  if (!isCorrect) {
    return {
      srsLevel: 'again',
      nextInterval: 1, // 1 minute
      nextReviewTime: now + 60 * 1000
    };
  }

  // Correct answer SRS logic based on time
  if (timeSpentSec < 8) {
    // Hafal -> Mudah (4 days)
    return {
      srsLevel: 'easy',
      nextInterval: 4 * 24 * 60, // 4 days in minutes
      nextReviewTime: now + (4 * 24 * 60 * 60 * 1000)
    };
  } else if (timeSpentSec <= 15) {
    // Belum otomatis -> Baik (1 day)
    return {
      srsLevel: 'good',
      nextInterval: 24 * 60, // 1 day in minutes
      nextReviewTime: now + (24 * 60 * 60 * 1000)
    };
  } else {
    // Belum hafal -> Susah (10 minutes)
    return {
      srsLevel: 'hard',
      nextInterval: 10,
      nextReviewTime: now + (10 * 60 * 1000)
    };
  }
};

export const generateOptions = (
  correctVocab: Vocabulary,
  allVocabs: Vocabulary[],
  direction: 'jp-to-id' | 'id-to-jp'
) => {
  const options = new Set<string>();
  const correctOption = direction === 'jp-to-id' ? correctVocab.id_translation : correctVocab.jp;
  options.add(correctOption);

  const pool = allVocabs.filter(v => v.id !== correctVocab.id);
  
  // Shuffle pool and take 3
  const shuffled = pool.sort(() => 0.5 - Math.random());
  for (const v of shuffled) {
    if (options.size >= 4) break;
    options.add(direction === 'jp-to-id' ? v.id_translation : v.jp);
  }

  return Array.from(options).sort(() => 0.5 - Math.random());
};
