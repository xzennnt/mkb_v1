export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'sub_admin' | 'user';
  level: number;
  points: number;
  totalStudyTime: number; // in seconds
  masteredVocabCount: number;
  lastActiveDate: string;
  lastLoginDate: string;
  loginStreak: number;
  loginHistory?: string[];
  isProfileComplete?: boolean;
  isBanned?: boolean;
}

export interface Vocabulary {
  id: string;
  jp: string; // Japanese word
  id_translation: string; // Indonesian translation
  category: string; // e.g., 'MNN1', 'Irodori_A1'
  romaji?: string;
  failCount?: number;
  hardCount?: number;
}

export interface UserProgress {
  id: string; // Document ID
  userId: string;
  vocabId: string;
  category?: string; // e.g. MNN1, for easy grouping
  nextReviewTime: number; // timestamp in ms
  interval: number; // in minutes (1, 10, 1440, 5760)
  reps: number;
  srsLevel: 'again' | 'hard' | 'good' | 'easy' | 'new';
  failCount?: number;
  easyCount?: number;
  
  // SRS Anki fields
  easeFactor?: number;
  step?: number;
  status?: 'learning' | 'review' | 'relearning';
}

export interface StudySession {
  id: string;
  userId: string;
  startTime: number;
  endTime: number;
  totalDuration: number; // in seconds
  cardsReviewed: number;
  correctCount?: number;
  incorrectCount?: number;
  type?: string;
  category?: string;
  failedVocabs?: { jp: string, id_translation: string }[];
}

export interface StudyReport {
  vocabId: string;
  jp: string;
  id_translation: string;
  timeSpentMs: number;
  status: 'Hafal' | 'Belum otomatis' | 'Belum hafal';
  isCorrect: boolean;
}
