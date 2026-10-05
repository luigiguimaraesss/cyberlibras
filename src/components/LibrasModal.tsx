import { useState } from 'react';
import { VideoOff } from 'lucide-react';
import { resolveAsset } from '../utils/assets';
import { Modal } from './Modal';

interface LibrasModalProps {
  /** Texto que está sendo traduzido (enunciado ou alternativa). */
  text: string;
  /** Caminho do vídeo relativo à pasta `public`. */
  src?: string;
  onClose: () => void;
}

/** Modal com o vídeo em Libras. Sem vídeo disponível, mostra uma mensagem e o quiz segue normalmente. */
export function LibrasModal({ text, src, onClose }: LibrasModalProps) {
  const url = resolveAsset(src);
  const [failed, setFailed] = useState(url === null);

  return (
    <Modal title="Tradução em Libras" onClose={onClose} wide>
      <p className="mb-4 rounded-xl border border-white/10 bg-surface-raised p-3 text-ink-soft">{text}</p>

      {failed || !url ? (
        <div
          role="status"
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-500/70 bg-surface-raised p-8 text-center"
        >
          <VideoOff className="h-10 w-10 text-brand-light" aria-hidden="true" />
          <p className="text-lg font-semibold">O vídeo em Libras ainda não está disponível.</p>
          <p className="max-w-md text-ink-soft">
            Você pode continuar respondendo normalmente. A tradução será adicionada em breve.
          </p>
        </div>
      ) : (
        <video
          key={url}
          src={url}
          controls
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          aria-label={`Vídeo em Libras: ${text}`}
          className="aspect-video w-full rounded-2xl bg-black"
        >
          Seu navegador não consegue reproduzir este vídeo.
        </video>
      )}
    </Modal>
  );
}
