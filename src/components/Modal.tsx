import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

/**
 * Janela modal baseada no elemento nativo <dialog>, que já oferece:
 * foco preso dentro da janela, fechamento com ESC e conteúdo de fundo inerte.
 * Além disso: fecha ao clicar fora, bloqueia a rolagem do fundo e devolve o foco a quem abriu.
 */
export function Modal({ title, onClose, children, wide = false }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const pressStartedOnBackdrop = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();

    const handleClose = () => onCloseRef.current();
    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("close", handleClose);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={`modal ${wide ? "modal-lg" : ""}`}
      onMouseDown={(event) => {
        pressStartedOnBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        // Só fecha se o clique começou e terminou no fundo (evita fechar ao arrastar a barra do vídeo).
        if (
          event.target === event.currentTarget &&
          pressStartedOnBackdrop.current
        )
          ref.current?.close();
      }}
    >
      <div className="card max-h-[calc(100dvh-1.5rem)] overflow-y-auto bg-surface p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-bold leading-snug">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="btn-secondary !min-h-[44px] !min-w-[44px] shrink-0 !px-3 !py-2"
            aria-label="Fechar janela"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
