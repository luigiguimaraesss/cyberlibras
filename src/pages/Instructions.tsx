import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Hand,
  ListChecks,
  Lightbulb,
} from "lucide-react";
import { LibrasButton } from "../components/LibrasButton";
import { LibrasModal } from "../components/LibrasModal";

interface InstructionsProps {
  hasProgress: boolean;
  onBegin: () => void;
  onBack: () => void;
}

const STEPS = [
  {
    icon: ListChecks,
    text: "Leia a situação e escolha uma das três respostas.",
    video: "videos/regras/passo-01.mp4",
  },
  {
    icon: Hand,
    text: "Use o botão “Libras” para ver a tradução da pergunta ou de cada resposta.",
    video: "videos/regras/passo-02.mp4",
  },
  {
    icon: Lightbulb,
    text: "Depois de responder, veja se acertou e leia o motivo.",
    video: "videos/regras/passo-03.mp4",
  },
];

export function Instructions({
  hasProgress,
  onBegin,
  onBack,
}: InstructionsProps) {
  const [librasContent, setLibrasContent] = useState<{
    text: string;
    src: string;
  } | null>(null);

  return (
    <section
      aria-labelledby="screen-title"
      className="card animate-screen mx-auto max-w-2xl p-6 sm:p-10"
    >
      <h1 id="screen-title" tabIndex={-1} className="text-3xl font-extrabold">
        Como jogar
      </h1>
      <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <p className="text-lg text-ink-soft">
          Leia a situação apresentada e escolha uma das três respostas. Você
          poderá consultar a tradução em Libras usando o botão correspondente.
          Após responder, o sistema mostrará se você acertou e explicará o
          motivo.
        </p>
        <LibrasButton
          prominent
          context="regras de como jogar"
          onClick={() =>
            setLibrasContent({
              text: "Leia a situação apresentada e escolha uma das três respostas. Você poderá consultar a tradução em Libras usando o botão correspondente. Após responder, o sistema mostrará se você acertou e explicará o motivo.",
              src: "videos/regras/introducao.mp4",
            })
          }
        />
      </div>

      <ol className="mt-6 space-y-3">
        {STEPS.map(({ icon: Icon, text, video }, index) => (
          <li
            key={text}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-surface-raised p-4"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
              {index + 1}
            </span>
            <Icon
              className="h-6 w-6 shrink-0 text-brand-light"
              aria-hidden="true"
            />
            <span className="flex-1 text-base sm:text-lg">{text}</span>
            <LibrasButton
              context={`regra: ${text}`}
              onClick={() => setLibrasContent({ text, src: video })}
            />
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <p className="text-ink-soft">
          Para passar de nível, você precisa acertar mais da metade das
          perguntas. Se não conseguir, pode tentar de novo quantas vezes quiser.
        </p>
        <LibrasButton
          context="regra para passar de nível"
          onClick={() =>
            setLibrasContent({
              text: "Para passar de nível, você precisa acertar mais da metade das perguntas. Se não conseguir, pode tentar de novo quantas vezes quiser.",
              src: "videos/regras/aprovacao.mp4",
            })
          }
        />
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Voltar
        </button>
        <button type="button" onClick={onBegin} className="btn-primary">
          {hasProgress ? "Escolher nível" : "Começar nível 1"}{" "}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {librasContent && (
        <LibrasModal
          text={librasContent.text}
          src={librasContent.src}
          onClose={() => setLibrasContent(null)}
        />
      )}
    </section>
  );
}
