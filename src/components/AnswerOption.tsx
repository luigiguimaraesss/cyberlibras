import { CircleCheck, CircleX } from 'lucide-react';
import type { Answer } from '../types/quiz';
import { LibrasButton } from './LibrasButton';

type Status = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed';

interface AnswerOptionProps {
  name: string;
  letter: string;
  answer: Answer;
  selected: boolean;
  confirmed: boolean;
  onSelect: () => void;
  onOpenLibras: () => void;
}

const BOX: Record<Status, string> = {
  idle: 'border-white/15 bg-surface-raised hover:border-brand-light/70 hover:bg-slate-700/50',
  selected: 'animate-pop border-brand-light bg-brand/20 ring-2 ring-brand-light/40',
  correct: 'border-ok-light bg-ok/15',
  wrong: 'border-bad-light bg-bad/15',
  dimmed: 'border-white/10 bg-surface-raised opacity-70',
};

const BADGE: Record<Status, string> = {
  idle: 'bg-slate-700 text-ink',
  selected: 'bg-brand text-white',
  correct: 'bg-ok-light text-slate-900',
  wrong: 'bg-bad-light text-slate-900',
  dimmed: 'bg-slate-700 text-ink-soft',
};

export function AnswerOption({ name, letter, answer, selected, confirmed, onSelect, onOpenLibras }: AnswerOptionProps) {
  const status: Status = confirmed
    ? answer.isCorrect
      ? 'correct'
      : selected
        ? 'wrong'
        : 'dimmed'
    : selected
      ? 'selected'
      : 'idle';

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
      <label
        className={`flex min-h-[56px] flex-1 items-center gap-3 rounded-2xl border-2 p-3 transition duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-light sm:p-4 ${BOX[status]} ${confirmed ? 'cursor-default' : 'cursor-pointer'}`}
      >
        <input
          type="radio"
          name={name}
          value={answer.id}
          checked={selected}
          onChange={() => {
            if (!confirmed) onSelect();
          }}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold ${BADGE[status]}`}
        >
          {letter}
        </span>
        <span className="flex-1 text-base leading-snug sm:text-lg">
          <span className="sr-only">Alternativa {letter}: </span>
          {answer.text}
        </span>
        {status === 'correct' && (
          <span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-ok-light">
            <CircleCheck className="h-6 w-6" aria-hidden="true" />
            <span>Resposta correta</span>
          </span>
        )}
        {status === 'wrong' && (
          <span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-bad-light">
            <CircleX className="h-6 w-6" aria-hidden="true" />
            <span>Sua resposta (incorreta)</span>
          </span>
        )}
      </label>
      <LibrasButton context={`alternativa ${letter}: ${answer.text}`} onClick={onOpenLibras} />
    </div>
  );
}
