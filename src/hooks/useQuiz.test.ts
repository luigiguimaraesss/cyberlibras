import { describe, expect, it } from 'vitest';
import { levels } from '../data/questions';
import type { QuizState } from './useQuiz';
import { createInitialState, quizReducer } from './useQuiz';
import { emptyProgress, sanitizeProgress } from '../utils/storage';
import { isJourneyComplete, isLevelUnlocked, journeyTotals, percentage } from '../utils/scoring';

/** Joga um nível inteiro acertando `right` questões (as primeiras) e errando as demais. */
function playLevel(start: QuizState, levelId: number, right: number): QuizState {
  let state = quizReducer(start, { type: 'START_LEVEL', levelId });
  const level = levels.find((l) => l.id === levelId)!;
  level.questions.forEach((question, index) => {
    const answer = index < right ? question.answers.find((a) => a.isCorrect)! : question.answers.find((a) => !a.isCorrect)!;
    state = quizReducer(state, { type: 'SELECT', answerId: answer.id });
    state = quizReducer(state, { type: 'CONFIRM' });
    state = quizReducer(state, { type: 'NEXT' });
  });
  return state;
}

const unlocked = (state: QuizState, id: number) => isLevelUnlocked(levels, state.progress, id);

describe('estado inicial e níveis', () => {
  it('começa na tela inicial com o nível 1 liberado e os demais bloqueados', () => {
    const state = createInitialState();
    expect(state.screen).toBe('home');
    expect(unlocked(state, 1)).toBe(true);
    expect(unlocked(state, 2)).toBe(false);
    expect(unlocked(state, 3)).toBe(false);
  });

  it('não permite iniciar um nível bloqueado', () => {
    const state = createInitialState();
    expect(quizReducer(state, { type: 'START_LEVEL', levelId: 2 })).toBe(state);
    expect(quizReducer(state, { type: 'START_LEVEL', levelId: 3 })).toBe(state);
    expect(quizReducer(state, { type: 'START_LEVEL', levelId: 99 })).toBe(state);
  });

  it('não permite abrir a conclusão antes de terminar a jornada', () => {
    const state = createInitialState();
    expect(quizReducer(state, { type: 'GO', screen: 'completion' })).toBe(state);
  });
});

describe('resposta e pontuação', () => {
  const started = () => quizReducer(createInitialState(), { type: 'START_LEVEL', levelId: 1 });

  it('não confirma sem alternativa selecionada', () => {
    const state = started();
    expect(quizReducer(state, { type: 'CONFIRM' })).toBe(state);
  });

  it('pontua 1 para acerto e 0 para erro, e revela a resposta', () => {
    const q = levels[0].questions[0];
    const right = q.answers.find((a) => a.isCorrect)!;
    const wrong = q.answers.find((a) => !a.isCorrect)!;

    let hit = quizReducer(started(), { type: 'SELECT', answerId: right.id });
    hit = quizReducer(hit, { type: 'CONFIRM' });
    expect(hit.confirmed).toBe(true);
    expect(hit.score).toBe(1);

    let miss = quizReducer(started(), { type: 'SELECT', answerId: wrong.id });
    miss = quizReducer(miss, { type: 'CONFIRM' });
    expect(miss.confirmed).toBe(true);
    expect(miss.score).toBe(0);
  });

  it('não pontua duas vezes nem permite trocar a resposta depois de confirmar', () => {
    const q = levels[0].questions[0];
    const right = q.answers.find((a) => a.isCorrect)!;
    const wrong = q.answers.find((a) => !a.isCorrect)!;
    let state = quizReducer(started(), { type: 'SELECT', answerId: right.id });
    state = quizReducer(state, { type: 'CONFIRM' });
    const again = quizReducer(state, { type: 'CONFIRM' });
    expect(again.score).toBe(1);
    const changed = quizReducer(state, { type: 'SELECT', answerId: wrong.id });
    expect(changed.selectedAnswerId).toBe(right.id);
  });

  it('ignora alternativas inexistentes e avançar sem confirmar', () => {
    let state = started();
    expect(quizReducer(state, { type: 'SELECT', answerId: 'z' })).toBe(state);
    expect(quizReducer(state, { type: 'NEXT' })).toBe(state);
    state = quizReducer(state, { type: 'SELECT', answerId: 'a' });
    expect(quizReducer(state, { type: 'NEXT' })).toBe(state);
  });

  it('avança uma pergunta por vez e limpa a seleção', () => {
    let state = quizReducer(started(), { type: 'SELECT', answerId: 'a' });
    state = quizReducer(state, { type: 'CONFIRM' });
    state = quizReducer(state, { type: 'NEXT' });
    expect(state.questionIndex).toBe(1);
    expect(state.selectedAnswerId).toBeNull();
    expect(state.confirmed).toBe(false);
  });
});

describe('aprovação, reprovação e desbloqueio', () => {
  it('nível 1: 4/7 aprova e libera o nível 2', () => {
    const state = playLevel(createInitialState(), 1, 4);
    expect(state.screen).toBe('levelResult');
    expect(state.result).toMatchObject({ score: 4, total: 7, minimumScore: 4, passed: true });
    expect(state.newlyUnlocked).toBe(2);
    expect(unlocked(state, 2)).toBe(true);
    expect(unlocked(state, 3)).toBe(false);
  });

  it('nível 1: 3/7 reprova e mantém o nível 2 bloqueado', () => {
    const state = playLevel(createInitialState(), 1, 3);
    expect(state.result).toMatchObject({ score: 3, passed: false });
    expect(state.newlyUnlocked).toBeNull();
    expect(unlocked(state, 2)).toBe(false);
    expect(quizReducer(state, { type: 'CONTINUE' })).toBe(state);
  });

  it('nível 2: 3/5 libera o nível 3; 2/5 não libera', () => {
    const pass1 = playLevel(createInitialState(), 1, 7);
    expect(unlocked(playLevel(pass1, 2, 3), 3)).toBe(true);
    expect(unlocked(playLevel(pass1, 2, 2), 3)).toBe(false);
  });

  it('nível 3: 3/5 conclui a jornada e CONTINUE leva à tela final', () => {
    let state = playLevel(createInitialState(), 1, 4);
    state = playLevel(state, 2, 3);
    state = playLevel(state, 3, 3);
    expect(state.result?.passed).toBe(true);
    expect(isJourneyComplete(levels, state.progress)).toBe(true);
    state = quizReducer(state, { type: 'CONTINUE' });
    expect(state.screen).toBe('completion');
    expect(journeyTotals(levels, state.progress)).toEqual({ score: 10, total: 17 });
  });

  it('nível 3 com 2/5 não conclui a jornada', () => {
    let state = playLevel(createInitialState(), 1, 7);
    state = playLevel(state, 2, 5);
    state = playLevel(state, 3, 2);
    expect(state.result?.passed).toBe(false);
    expect(isJourneyComplete(levels, state.progress)).toBe(false);
  });

  it('CONTINUE em nível aprovado inicia o próximo nível', () => {
    let state = playLevel(createInitialState(), 1, 5);
    state = quizReducer(state, { type: 'CONTINUE' });
    expect(state.screen).toBe('quiz');
    expect(state.levelId).toBe(2);
    expect(state.score).toBe(0);
  });

  it('refazer um nível zera a pontuação da tentativa e preserva melhor resultado e desbloqueios', () => {
    let state = playLevel(createInitialState(), 1, 7);
    expect(unlocked(state, 2)).toBe(true);
    state = playLevel(state, 1, 0);
    expect(state.result).toMatchObject({ score: 0, passed: false });
    expect(state.progress.levels[1]).toEqual({ bestScore: 7, attempts: 2 });
    expect(unlocked(state, 2)).toBe(true);
    expect(state.newlyUnlocked).toBeNull();
    state = quizReducer(state, { type: 'START_LEVEL', levelId: 1 });
    expect(state.score).toBe(0);
    expect(state.answers).toEqual({});
  });

  it('sair do quiz descarta a tentativa mas mantém o progresso salvo', () => {
    let state = playLevel(createInitialState(), 1, 5);
    state = quizReducer(state, { type: 'START_LEVEL', levelId: 2 });
    state = quizReducer(state, { type: 'SELECT', answerId: 'a' });
    state = quizReducer(state, { type: 'GO', screen: 'levels' });
    expect(state.screen).toBe('levels');
    expect(state.levelId).toBeNull();
    expect(unlocked(state, 2)).toBe(true);
  });
});

describe('reiniciar', () => {
  it('RESET apaga o progresso e volta ao início', () => {
    const state = quizReducer(playLevel(createInitialState(), 1, 7), { type: 'RESET' });
    expect(state.screen).toBe('home');
    expect(state.progress).toEqual(emptyProgress());
    expect(unlocked(state, 2)).toBe(false);
  });
});

describe('persistência: validação de dados salvos', () => {
  const valid = { version: 1, levels: { 1: { bestScore: 5, attempts: 2 }, 2: { bestScore: 3, attempts: 1 } } };

  it('restaura progresso válido', () => {
    const progress = sanitizeProgress(JSON.parse(JSON.stringify(valid)), levels);
    expect(progress.levels[1]).toEqual({ bestScore: 5, attempts: 2 });
    expect(isLevelUnlocked(levels, progress, 3)).toBe(true);
  });

  it('descarta dados inválidos, de outra versão ou adulterados', () => {
    expect(sanitizeProgress(null, levels)).toEqual(emptyProgress());
    expect(sanitizeProgress('x', levels)).toEqual(emptyProgress());
    expect(sanitizeProgress({ version: 2, levels: valid.levels }, levels)).toEqual(emptyProgress());
    expect(sanitizeProgress({ version: 1, levels: { 1: { bestScore: 99, attempts: 1 } } }, levels)).toEqual(emptyProgress());
    expect(sanitizeProgress({ version: 1, levels: { 1: { bestScore: -1, attempts: 1 } } }, levels)).toEqual(emptyProgress());
    expect(sanitizeProgress({ version: 1, levels: { 1: { bestScore: 2.5, attempts: 1 } } }, levels)).toEqual(emptyProgress());
  });

  it('não deixa um nível ter resultado se o anterior não foi aprovado (sem avanço indevido)', () => {
    const tampered = {
      version: 1,
      levels: { 1: { bestScore: 3, attempts: 1 }, 2: { bestScore: 5, attempts: 1 }, 3: { bestScore: 5, attempts: 1 } },
    };
    const progress = sanitizeProgress(tampered, levels);
    expect(Object.keys(progress.levels)).toEqual(['1']);
    expect(isLevelUnlocked(levels, progress, 2)).toBe(false);
  });
});

describe('percentual', () => {
  it('arredonda e protege divisão por zero', () => {
    expect(percentage(5, 7)).toBe(71);
    expect(percentage(17, 17)).toBe(100);
    expect(percentage(0, 0)).toBe(0);
  });
});
