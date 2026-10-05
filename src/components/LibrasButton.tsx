import { Hand } from 'lucide-react';

interface LibrasButtonProps {
  /** Descrição do conteúdo traduzido, usada no rótulo para leitores de tela. */
  context: string;
  onClick: () => void;
  prominent?: boolean;
}

export function LibrasButton({ context, onClick, prominent = false }: LibrasButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ver tradução em Libras: ${context}`}
      className={
        prominent
          ? 'btn-secondary shrink-0 self-start !border-brand-light/60 !text-brand-light'
          : 'btn-secondary shrink-0 !min-h-[48px] !gap-1.5 !border-brand-light/60 !px-3 !py-2 text-sm !text-brand-light'
      }
    >
      <Hand className={prominent ? 'h-5 w-5' : 'h-4 w-4'} aria-hidden="true" />
      {prominent ? 'Ver em Libras' : 'Libras'}
    </button>
  );
}
