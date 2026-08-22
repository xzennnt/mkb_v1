export const getXpForLevel = (level: number) => {
  if (level <= 1) return 0;
  if (level <= 20) {
    // Sangat sedikit untuk level 1-20
    return (level - 1) * 50;
  }
  
  // Makin sulit setelah level 20
  const baseFor20 = 19 * 50; // 950
  const extra = level - 20;
  return baseFor20 + (extra * 200) + (Math.pow(extra, 2) * 50);
};

export const calculateLevel = (xp: number) => {
  let level = 1;
  while (true) {
    const nextXp = getXpForLevel(level + 1);
    if (xp >= nextXp) {
      level++;
    } else {
      break;
    }
  }
  return level;
};

export const calculatePoints = (basePoints: number, streak: number) => {
  if (basePoints <= 0) return 0;
  if (!streak || streak <= 1) return basePoints;
  // Multiple exp berdasarkan streak hari. (Max 3x multiplier)
  // Misal streak 2 hari = 1.1x, streak 5 hari = 1.4x, streak 10 = 1.9x
  const multiplier = Math.min(3.0, 1 + ((streak - 1) * 0.1));
  return Math.round(basePoints * multiplier);
};
