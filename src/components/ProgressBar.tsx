interface ProgressBarProps {
  /** Número da questão atual (começa em 1). */
  current: number;
  total: number;
  /** Quantidade de questões já respondidas (define o preenchimento da barra). */
  completed: number;
}

export function ProgressBar({ current, total, completed }: ProgressBarProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between text-sm text-ink-soft">
        <span>
          Questão {current} de {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Progresso no nível"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
        aria-valuetext={`Questão ${current} de ${total}`}
        className="h-3 w-full overflow-hidden rounded-full bg-surface-raised"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
