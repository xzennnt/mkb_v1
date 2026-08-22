import { UserProgress } from '../types';

export interface AnkiResult {
  nextInterval: number; // in minutes
  easeFactor: number;
  status: 'learning' | 'review' | 'relearning';
  step: number;
}

const STEPS = [1, 10, 1440]; // 1m, 10m, 1d (in minutes)

export function calculateAnkiProgress(
  rating: 'again' | 'hard' | 'good' | 'easy',
  currentProg?: Partial<UserProgress>
): AnkiResult {
  const currentStatus = currentProg?.status || 'learning';
  let currentStep = currentProg?.step || 0;
  let currentIvl = currentProg?.interval || 0;
  let currentEF = currentProg?.easeFactor || 2.5;

  let nextInterval = currentIvl;
  let nextEF = currentEF;
  let nextStatus = currentStatus;
  let nextStep = currentStep;

  if (currentStatus === 'learning' || currentStatus === 'relearning') {
    if (rating === 'again') {
      nextStep = 0;
      nextInterval = STEPS[0]; // 1m
    } else if (rating === 'hard') {
      // In Anki v2, Hard in learning shows average of current step and next step? 
      // Based on screenshot, let's just stick to standard step logic:
      // Hard: repeats current step but with some delay, or moves to step 2 if on step 1.
      // Screenshot says: "Hard -> step 2 (due 12h)". 12h = 720m.
      // Let's use simplified:
      if (currentStep === 0) {
        nextInterval = 10; // 10m
        nextStep = 0; // remain in learning early
      } else {
        nextInterval = 720; // 12h
        nextStep = currentStep;
      }
    } else if (rating === 'good') {
      if (currentStep + 1 < STEPS.length) {
        // Move to next step
        nextStep = currentStep + 1;
        nextInterval = STEPS[nextStep];
      } else {
        // Graduate
        nextStatus = 'review';
        nextInterval = STEPS[STEPS.length - 1]; // 1d
        nextStep = STEPS.length;
      }
    } else if (rating === 'easy') {
      // Graduate immediately
      nextStatus = 'review';
      nextInterval = 4 * 1440; // 4d
      nextStep = STEPS.length;
    }
  } else {
    // Review Phase
    if (rating === 'again') {
      nextStatus = 'relearning';
      nextStep = 0;
      nextInterval = STEPS[0];
      nextEF = Math.max(1.3, currentEF - 0.20);
    } else if (rating === 'hard') {
      nextInterval = Math.round(currentIvl * 1.2);
      nextEF = Math.max(1.3, currentEF - 0.15);
    } else if (rating === 'good') {
      nextInterval = Math.round(currentIvl * currentEF);
    } else if (rating === 'easy') {
      nextInterval = Math.round(currentIvl * currentEF * 1.3);
      nextEF = currentEF + 0.15;
    }
  }

  return {
    nextInterval,
    easeFactor: nextEF,
    status: nextStatus,
    step: nextStep
  };
}

export function formatInterval(minutes: number): string {
  if (minutes < 60) return `${minutes} mnt`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} hr`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} bln`;
  const years = Math.round(months / 12);
  return `${years} thn`;
}

export function generateOptions(
  correctVocab: Vocabulary,
  allVocabs: Vocabulary[],
  direction: 'jp-to-id' | 'id-to-jp'
): string[] {
  const options = new Set<string>();
  const correctAns = direction === 'jp-to-id' ? correctVocab.id_translation : correctVocab.jp;
  options.add(correctAns);
  
  // Try to find distractors in the same category first if possible, otherwise anywhere
  let distractors = allVocabs.filter(v => v.id !== correctVocab.id);
  
  // Shuffle distractors
  distractors = distractors.sort(() => 0.5 - Math.random());
  
  for (const v of distractors) {
    if (options.size >= 4) break;
    const opt = direction === 'jp-to-id' ? v.id_translation : v.jp;
    options.add(opt);
  }
  
  return Array.from(options).sort(() => 0.5 - Math.random());
}

export function calculateNextReview(
  timeSpentSec: number,
  isCorrect: boolean,
  currentIntervalMinutes: number
): { nextInterval: number, nextReviewTime: number, srsLevel: 'again' | 'hard' | 'good' | 'easy' | 'new' } {
  let nextInterval = currentIntervalMinutes || 0;
  let srsLevel: 'again' | 'hard' | 'good' | 'easy' = 'again';
  
  if (!isCorrect) {
    nextInterval = 1;
    srsLevel = 'again';
  } else {
    // If correct, check how fast they answered
    if (timeSpentSec < 3) {
      nextInterval = Math.max(1440, nextInterval * 2.5); // at least 1 day, or scale up
      srsLevel = 'easy';
    } else if (timeSpentSec < 10) {
      nextInterval = Math.max(60, nextInterval * 1.5); // at least 1 hour, or scale up
      srsLevel = 'good';
    } else {
      nextInterval = Math.max(10, nextInterval * 1.2); // at least 10 minutes
      srsLevel = 'hard';
    }
  }
  
  return {
    nextInterval: Math.round(nextInterval),
    nextReviewTime: Date.now() + Math.round(nextInterval * 60 * 1000),
    srsLevel
  };
}
