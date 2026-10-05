import type { Level, Progress } from '../types/quiz';

/** Mais da metade das respostas corretas (7 → 4, 5 → 3). */
export function minimumToPass(total: number): number {
  return Math.floor(total / 2) + 1;
}

export function percentage(score: number, total: number): number {
  return total === 0 ? 0 : Math.round((score / total) * 100);
}

export function isPassed(score: number, minimumScore: number): boolean {
  return score >= minimumScore;
}

export function isLevelPassed(progress: Progress, level: Level): boolean {
  const record = progress.levels[level.id];
  return !!record && isPassed(record.bestScore, level.minimumScore);
}

/** O nível 1 está sempre liberado; cada nível seguinte exige aprovação em todos os anteriores. */
export function isLevelUnlocked(allLevels: Level[], progress: Progress, levelId: number): boolean {
  const index = allLevels.findIndex((level) => level.id === levelId);
  if (index < 0) return false;
  for (let i = 0; i < index; i += 1) {
    if (!isLevelPassed(progress, allLevels[i])) return false;
  }
  return true;
}

export function isJourneyComplete(allLevels: Level[], progress: Progress): boolean {
  return allLevels.every((level) => isLevelPassed(progress, level));
}

export function hasProgress(progress: Progress): boolean {
  return Object.keys(progress.levels).length > 0;
}

/** Soma das melhores pontuações de cada nível e total de questões. */
export function journeyTotals(allLevels: Level[], progress: Progress): { score: number; total: number } {
  let score = 0;
  let total = 0;
  for (const level of allLevels) {
    total += level.questions.length;
    score += Math.min(progress.levels[level.id]?.bestScore ?? 0, level.questions.length);
  }
  return { score, total };
}
