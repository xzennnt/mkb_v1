import { Vocabulary, UserProgress } from '../types';

export const calculateNextReview = (
  timeSpentSec: number,
  isCorrect: boolean,
  currentIntervalMinutes: number
): { srsLevel: UserProgress['srsLevel']; nextInterval: number; nextReviewTime: number; reps: number } => {
  const now = Date.now();
  
  if (!isCorrect) {
    return {
      srsLevel: 'again',
      nextInterval: 1, // 1 minute
      nextReviewTime: now + 60 * 1000,
      reps: 0
    };
  }

  // Correct answer SRS logic based on time
  if (timeSpentSec <= 5) {
    // Hafal -> Mudah
    const nextInterval = Math.max(4 * 24 * 60, currentIntervalMinutes * 2.5);
    return {
      srsLevel: 'easy',
      nextInterval,
      nextReviewTime: now + (nextInterval * 60 * 1000),
      reps: 1
    };
  } else if (timeSpentSec <= 15) {
    // Belum otomatis -> Baik
    const nextInterval = Math.max(24 * 60, currentIntervalMinutes * 1.5);
    return {
      srsLevel: 'good',
      nextInterval,
      nextReviewTime: now + (nextInterval * 60 * 1000),
      reps: 1
    };
  } else {
    // Belum hafal -> Susah (10 minutes minimum)
    const nextInterval = Math.max(10, currentIntervalMinutes * 1.2);
    return {
      srsLevel: 'hard',
      nextInterval,
      nextReviewTime: now + (nextInterval * 60 * 1000),
      reps: 1
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
