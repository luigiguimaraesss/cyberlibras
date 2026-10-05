import { useState } from 'react';
import { ArrowRight, CircleCheck, CircleX, LockOpen, RotateCcw, ChevronDown, LayoutGrid } from 'lucide-react';
import { getLevel, getNextLevel } from '../data/questions';
import type { LevelResult as LevelResultData } from '../types/quiz';
import { percentage } from '../utils/scoring';
import { ResultScreen } from '../components/ResultScreen';

interface LevelResultProps {
  result: LevelResultData;
  newlyUnlocked: number | null;
  onContinue: () => void;
  onRetry: () => void;
  onLevels: () => void;
}

function Review({ result }: { result: LevelResultData }) {
  const level = getLevel(result.levelId);
  if (!level) return null;
  return (
    <ol className="space-y-4" aria-label="Revisão das respostas">
      {level.questions.map((question, index) => {
        const chosen = question.answers.find((answer) => answer.id === result.answers[question.id]);
        const correct = question.answers.find((answer) => answer.isCorrect);
        const hit = !!chosen?.isCorrect;
        return (
          <li key={question.id} className="rounded-2xl border border-white/10 bg-surface-raised p-4">
            <p className="font-bold">
              {index + 1}. {question.statement}
            </p>
            <p className={`mt-2 flex items-start gap-2 font-semibold ${hit ? 'text-ok-light' : 'text-bad-light'}`}>
              {hit ? (
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              ) : (
                <CircleX className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              )}
              <span>
                {hit ? 'Você acertou: ' : 'Sua resposta: '}
                {chosen?.text}
              </span>
            </p>
            {!hit && correct && (
              <p className="mt-1 flex items-start gap-2 font-semibold text-ok-light">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <span>Resposta correta: {correct.text}</span>
              </p>
            )}
            <p className="mt-2 text-ink-soft">{question.explanation}</p>
          </li>
        );
      })}
    </ol>
  );
}

export function LevelResult({ result, newlyUnlocked, onContinue, onRetry, onLevels }: LevelResultProps) {
  const [showReview, setShowReview] = useState(false);
  const level = getLevel(result.levelId);
  const next = getNextLevel(result.levelId);
  const percent = percentage(result.score, result.total);

  const stats = [
    { label: 'Acertos', value: `${result.score} de ${result.total}` },
    { label: 'Aproveitamento', value: `${percent}%` },
    { label: 'Mínimo para passar', value: `${result.minimumScore} acertos` },
  ];

  const unlockedLevel = newlyUnlocked !== null ? getLevel(newlyUnlocked) : undefined;

  const actions = (
    <>
      {result.passed ? (
        <button type="button" onClick={onContinue} className="btn-primary">
          {next ? `Continuar para o nível ${next.id}` : 'Ver conclusão da jornada'}{' '}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : (
        <button type="button" onClick={onRetry} className="btn-primary">
          <RotateCcw className="h-5 w-5" aria-hidden="true" /> Tentar novamente
        </button>
      )}
      <button
        type="button"
        onClick={() => setShowReview((value) => !value)}
        aria-expanded={showReview}
        aria-controls="review-panel"
        className="btn-secondary"
      >
        Revisar explicações{' '}
        <ChevronDown className={`h-5 w-5 transition-transform ${showReview ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {result.passed && (
        <button type="button" onClick={onRetry} className="btn-secondary">
          <RotateCcw className="h-5 w-5" aria-hidden="true" /> Refazer este nível
        </button>
      )}
      <button type="button" onClick={onLevels} className="btn-secondary">
        <LayoutGrid className="h-5 w-5" aria-hidden="true" /> Ver níveis
      </button>
    </>
  );

  return (
    <ResultScreen
      variant={result.passed ? 'success' : 'retry'}
      title={
        result.passed
          ? `Parabéns! Você concluiu o nível ${result.levelId}!`
          : `Quase lá! Você ainda não passou do nível ${result.levelId}.`
      }
      subtitle={
        result.passed
          ? `Você acertou ${result.score} de ${result.total} perguntas${level ? ` em “${level.title}”` : ''}.`
          : `Você acertou ${result.score} de ${result.total}. Precisa de ${result.minimumScore} acertos para avançar. Leia as explicações e tente de novo, você consegue!`
      }
      percent={percent}
      stats={stats}
      actions={actions}
    >
      {result.passed && unlockedLevel && (
        <div
          role="status"
          className="animate-unlock mb-4 flex items-center gap-3 rounded-2xl border border-brand-light/60 bg-brand/20 p-4"
        >
          <LockOpen className="h-7 w-7 shrink-0 text-brand-light" aria-hidden="true" />
          <p className="text-lg font-bold">Nível {unlockedLevel.id} desbloqueado!</p>
        </div>
      )}
      {showReview && (
        <div id="review-panel">
          <h2 className="mb-3 text-xl font-bold">Revisão das respostas</h2>
          <Review result={result} />
        </div>
      )}
    </ResultScreen>
  );
}
