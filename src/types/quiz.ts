export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  /** Caminho do vídeo em Libras, relativo à pasta `public`. Opcional. */
  librasVideo?: string;
}

export interface Question {
  id: number;
  level: number;
  /** Tema abordado (ex.: "Phishing"). */
  category: string;
  statement: string;
  /** Caminho do vídeo em Libras do enunciado, relativo à pasta `public`. Opcional. */
  statementVideo?: string;
  answers: Answer[];
  explanation: string;
  /** Caminho do vídeo em Libras da explicação, relativo à pasta `public`. Opcional. */
  explanationVideo?: string;
  successMessage: string;
  errorMessage: string;
}

export interface Level {
  id: number;
  title: string;
  difficulty: string;
  objective: string;
  questions: Question[];
  minimumScore: number;
}

/** Resultado salvo de um nível (melhor pontuação e número de tentativas). */
export interface LevelRecord {
  bestScore: number;
  attempts: number;
}

/**
 * Progresso persistido. Guarda apenas resultados: níveis desbloqueados e
 * conclusão da jornada são sempre DERIVADOS destes dados (ver utils/scoring.ts).
 */
export interface Progress {
  levels: Record<number, LevelRecord>;
}

/** Resultado de uma tentativa de nível, mantido apenas na sessão. */
export interface LevelResult {
  levelId: number;
  score: number;
  total: number;
  minimumScore: number;
  passed: boolean;
  /** questionId -> id da alternativa escolhida. */
  answers: Record<number, string>;
}

export type Screen =
  | "home"
  | "instructions"
  | "levels"
  | "quiz"
  | "levelResult"
  | "completion";
