import { LayoutGrid, RotateCcw } from 'lucide-react';
import type { Screen } from '../types/quiz';
import { Logo } from './Logo';

interface HeaderProps {
  screen: Screen;
  hasProgress: boolean;
  onHome: () => void;
  onLevels: () => void;
  onReset: () => void;
}

export function Header({ screen, hasProgress, onHome, onLevels, onReset }: HeaderProps) {
  const showLevels = screen !== 'home' && screen !== 'levels';
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-night/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onHome}
          className="flex min-h-[44px] items-center gap-2.5 rounded-xl pr-2 text-left"
          aria-label="CyberLibras — ir para a página inicial"
        >
          <Logo size={36} />
          <span className="text-lg font-extrabold tracking-tight">
            Cyber<span className="text-brand-light">Libras</span>
          </span>
        </button>

        <nav aria-label="Ações do site" className="flex items-center gap-2">
          {showLevels && (
            <button type="button" onClick={onLevels} className="btn-secondary !min-h-[44px] !px-4 !py-2 text-sm">
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              Níveis
            </button>
          )}
          {hasProgress && (
            <button
              type="button"
              onClick={onReset}
              className="btn-secondary !min-h-[44px] !px-4 !py-2 text-sm"
              aria-label="Apagar progresso e reiniciar"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reiniciar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
