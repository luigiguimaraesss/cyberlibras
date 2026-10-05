import type { Question } from '../types/quiz';
import { AnswerOption } from './AnswerOption';
import { LibrasButton } from './LibrasButton';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selectedAnswerId: string | null;
  confirmed: boolean;
  onSelect: (answerId: string) => void;
  onOpenLibras: (text: string, src?: string) => void;
}

export function QuestionCard({
  question,
  index,
  total,
  selectedAnswerId,
  confirmed,
  onSelect,
  onOpenLibras,
}: QuestionCardProps) {
  const statementId = `statement-${question.id}`;

  return (
    <article className="card animate-screen p-5 sm:p-8">
      <h1 id="screen-title" tabIndex={-1} className="text-sm font-semibold uppercase tracking-wide text-brand-light">
        Questão {index + 1} de {total}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">Tema: {question.category}</p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h2 id={statementId} className="text-xl font-bold leading-snug sm:text-2xl">
          {question.statement}
        </h2>
        <LibrasButton
          prominent
          context={`pergunta: ${question.statement}`}
          onClick={() => onOpenLibras(question.statement, question.statementVideo)}
        />
      </div>

      <div role="radiogroup" aria-labelledby={statementId} className="mt-6 space-y-3">
        {question.answers.map((answer, i) => (
          <AnswerOption
            key={answer.id}
            name={`question-${question.id}`}
            letter={String.fromCharCode(65 + i)}
            answer={answer}
            selected={selectedAnswerId === answer.id}
            confirmed={confirmed}
            onSelect={() => onSelect(answer.id)}
            onOpenLibras={() => onOpenLibras(answer.text, answer.librasVideo)}
          />
        ))}
      </div>
    </article>
  );
}
