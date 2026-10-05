import type { Level, Progress } from '../types/quiz';
import { isLevelPassed } from './scoring';

const STORAGE_KEY = 'cyberlibras:progress:v1';
const STORAGE_VERSION = 1;

export function emptyProgress(): Progress {
  return { levels: {} };
}

/**
 * Valida dados lidos do navegador. Qualquer valor inválido ou adulterado é descartado:
 * registros fora do intervalo são ignorados e níveis cujo anterior não foi aprovado
 * perdem o registro (impede "avanço indevido de nível").
 */
export function sanitizeProgress(raw: unknown, allLevels: Level[]): Progress {
  const progress = emptyProgress();
  if (typeof raw !== 'object' || raw === null) return progress;
  const data = raw as { version?: unknown; levels?: unknown };
  if (data.version !== STORAGE_VERSION) return progress;
  if (typeof data.levels !== 'object' || data.levels === null) return progress;
  const saved = data.levels as Record<string, unknown>;

  for (const level of allLevels) {
    const entry = saved[String(level.id)];
    if (typeof entry !== 'object' || entry === null) break;
    const { bestScore, attempts } = entry as { bestScore?: unknown; attempts?: unknown };
    const valid =
      typeof bestScore === 'number' &&
      Number.isInteger(bestScore) &&
      bestScore >= 0 &&
      bestScore <= level.questions.length &&
      typeof attempts === 'number' &&
      Number.isInteger(attempts) &&
      attempts >= 1;
    if (!valid) break;
    progress.levels[level.id] = { bestScore, attempts };
    // Um nível só pode ter registro se o anterior foi aprovado; sem aprovação aqui, os seguintes são ignorados.
    if (!isLevelPassed(progress, level)) break;
  }
  return progress;
}

export function loadProgress(allLevels: Level[]): Progress {
  try {
    const text = window.localStorage.getItem(STORAGE_KEY);
    if (!text) return emptyProgress();
    return sanitizeProgress(JSON.parse(text), allLevels);
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: Progress): void {
  try {
    if (Object.keys(progress.levels).length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, levels: progress.levels }));
  } catch {
    // Armazenamento indisponível (modo privado, bloqueado ou cheio): o quiz continua funcionando sem persistência.
  }
}

export function clearProgress(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignorado
  }
}
