import { useEffect, useMemo, useReducer } from 'react';
import { getLevel, getNextLevel, levels } from '../data/questions';
import type { LevelResult, Progress, Screen } from '../types/quiz';
import { hasProgress, isJourneyComplete, isLevelUnlocked, isPassed } from '../utils/scoring';
import { clearProgress, emptyProgress, loadProgress, saveProgress } from '../utils/storage';

export interface QuizState {
  screen: Screen;
  /** Persistido no navegador. */
  progress: Progress;
  levelId: number | null;
  questionIndex: number;
  selectedAnswerId: string | null;
  confirmed: boolean;
  /** questionId -> alternativa confirmada nesta tentativa. */
  answers: Record<number, string>;
  score: number;
  result: LevelResult | null;
  /** Nível recém-desbloqueado na última tentativa (para o indicador de desbloqueio). */
  newlyUnlocked: number | null;
}

export type QuizAction =
  | { type: 'GO'; screen: 'home' | 'instructions' | 'levels' | 'completion' }
  | { type: 'START_LEVEL'; levelId: number }
  | { type: 'SELECT'; answerId: string }
  | { type: 'CONFIRM' }
  | { type: 'NEXT' }
  | { type: 'CONTINUE' }
  | { type: 'RESET' };

type QuizFields = Pick<QuizState, 'levelId' | 'questionIndex' | 'selectedAnswerId' | 'confirmed' | 'answers' | 'score' | 'result'>;

function idleQuiz(): QuizFields {
  return { levelId: null, questionIndex: 0, selectedAnswerId: null, confirmed: false, answers: {}, score: 0, result: null };
}

export function createInitialState(progress: Progress = emptyProgress()): QuizState {
  return { screen: 'home', progress, ...idleQuiz(), newlyUnlocked: null };
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'GO': {
      if (action.screen === 'completion' && !isJourneyComplete(levels, state.progress)) return state;
      // Sair do quiz descarta apenas a tentativa em andamento; o progresso salvo é mantido.
      return { ...state, ...idleQuiz(), screen: action.screen };
    }

    case 'START_LEVEL': {
      const level = getLevel(action.levelId);
      if (!level || !isLevelUnlocked(levels, state.progress, level.id)) return state;
      return { ...state, ...idleQuiz(), screen: 'quiz', levelId: level.id, newlyUnlocked: null };
    }

    case 'SELECT': {
      const question = getLevel(state.levelId)?.questions[state.questionIndex];
      if (state.screen !== 'quiz' || !question || state.confirmed) return state;
      if (!question.answers.some((answer) => answer.id === action.answerId)) return state;
      return { ...state, selectedAnswerId: action.answerId };
    }

    case 'CONFIRM': {
      const question = getLevel(state.levelId)?.questions[state.questionIndex];
      if (state.screen !== 'quiz' || !question || state.confirmed || state.selectedAnswerId === null) return state;
      if (question.id in state.answers) return state; // nunca pontua a mesma questão duas vezes
      const chosen = question.answers.find((answer) => answer.id === state.selectedAnswerId);
      if (!chosen) return state;
      return {
        ...state,
        confirmed: true,
        answers: { ...state.answers, [question.id]: chosen.id },
        score: state.score + (chosen.isCorrect ? 1 : 0),
      };
    }

    case 'NEXT': {
      const level = getLevel(state.levelId);
      if (state.screen !== 'quiz' || !level || !state.confirmed) return state;

      if (state.questionIndex < level.questions.length - 1) {
        return { ...state, questionIndex: state.questionIndex + 1, selectedAnswerId: null, confirmed: false };
      }

      // Fim do nível: calcula o resultado e atualiza o progresso.
      const total = level.questions.length;
      const passed = isPassed(state.score, level.minimumScore);
      const previous = state.progress.levels[level.id];
      const progress: Progress = {
        levels: {
          ...state.progress.levels,
          [level.id]: {
            bestScore: Math.max(previous?.bestScore ?? 0, state.score),
            attempts: (previous?.attempts ?? 0) + 1,
          },
        },
      };
      const next = getNextLevel(level.id);
      const newlyUnlocked =
        next && !isLevelUnlocked(levels, state.progress, next.id) && isLevelUnlocked(levels, progress, next.id)
          ? next.id
          : null;
      const result: LevelResult = {
        levelId: level.id,
        score: state.score,
        total,
        minimumScore: level.minimumScore,
        passed,
        answers: state.answers,
      };
      return { ...state, progress, result, newlyUnlocked, screen: 'levelResult' };
    }

    case 'CONTINUE': {
      if (state.screen !== 'levelResult' || !state.result?.passed) return state;
      const next = getNextLevel(state.result.levelId);
      if (next) return quizReducer(state, { type: 'START_LEVEL', levelId: next.id });
      return quizReducer(state, { type: 'GO', screen: 'completion' });
    }

    case 'RESET':
      return createInitialState(emptyProgress());

    default:
      return state;
  }
}

export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, undefined, () => createInitialState(loadProgress(levels)));

  useEffect(() => {
    saveProgress(state.progress);
  }, [state.progress]);

  const level = getLevel(state.levelId);
  const question = level?.questions[state.questionIndex];

  const actions = useMemo(
    () => ({
      goTo: (screen: 'home' | 'instructions' | 'levels' | 'completion') => dispatch({ type: 'GO', screen }),
      startLevel: (levelId: number) => dispatch({ type: 'START_LEVEL', levelId }),
      select: (answerId: string) => dispatch({ type: 'SELECT', answerId }),
      confirm: () => dispatch({ type: 'CONFIRM' }),
      next: () => dispatch({ type: 'NEXT' }),
      continueAfterResult: () => dispatch({ type: 'CONTINUE' }),
      reset: () => {
        clearProgress();
        dispatch({ type: 'RESET' });
      },
    }),
    [],
  );

  return {
    state,
    level,
    question,
    actions,
    savedProgress: hasProgress(state.progress),
    journeyComplete: isJourneyComplete(levels, state.progress),
  };
}
