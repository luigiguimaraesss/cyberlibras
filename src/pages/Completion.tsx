import { LayoutGrid, RotateCcw } from 'lucide-react';
import { levels } from '../data/questions';
import type { Progress } from '../types/quiz';
import { journeyTotals, percentage } from '../utils/scoring';
import { ResultScreen } from '../components/ResultScreen';

interface CompletionProps {
  progress: Progress;
  onRestart: () => void;
  onLevels: () => void;
}

export function Completion({ progress, onRestart, onLevels }: CompletionProps) {
  const { score, total } = journeyTotals(levels, progress);
  const percent = percentage(score, total);

  return (
    <ResultScreen
      variant="journey"
      title="Parabéns! Você concluiu sua jornada no CyberLibras!"
      subtitle="Agora você sabe reconhecer golpes comuns e proteger suas contas e seus dados."
      percent={percent}
      stats={[
        { label: 'Total de acertos', value: `${score}` },
        { label: 'Questões respondidas', value: `${total}` },
        { label: 'Aproveitamento geral', value: `${percent}%` },
      ]}
      actions={
        <>
          <button type="button" onClick={onLevels} className="btn-secondary">
            <LayoutGrid className="h-5 w-5" aria-hidden="true" /> Rever os níveis
          </button>
          <button type="button" onClick={onRestart} className="btn-primary">
            <RotateCcw className="h-5 w-5" aria-hidden="true" /> Reiniciar jornada
          </button>
        </>
      }
    >
      <div className="rounded-2xl border border-white/10 bg-surface-raised p-5">
        <h2 className="text-xl font-bold">Lembre-se sempre</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-soft sm:text-lg">
          <li>Use senhas longas e únicas e ative a verificação em dois fatores.</li>
          <li>Desconfie de links, QR Codes e mensagens com pressa ou prêmios.</li>
          <li>Nunca compartilhe senhas ou códigos de verificação.</li>
          <li>Na dúvida, confirme por um canal oficial antes de agir.</li>
        </ul>
      </div>
      <p className="mt-4 text-sm text-ink-soft">O total considera a sua melhor pontuação em cada nível.</p>
    </ResultScreen>
  );
}
