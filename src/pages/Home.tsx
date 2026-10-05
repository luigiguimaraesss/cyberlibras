import { useState } from "react";
import {
  ArrowRight,
  Hand,
  Lightbulb,
  ListChecks,
  ShieldCheck,
} from "lucide-react";
import { levels } from "../data/questions";
import { Logo } from "../components/Logo";
import { LibrasButton } from "../components/LibrasButton";
import { LibrasModal } from "../components/LibrasModal";

interface HomeProps {
  hasProgress: boolean;
  onStart: () => void;
  onContinue: () => void;
}

const STEPS = [
  {
    icon: Hand,
    title: "Veja em Libras",
    text: "Cada pergunta e cada resposta tem um botão de tradução em Libras.",
    video: "videos/inicio/como-funciona-01.mp4",
  },
  {
    icon: ListChecks,
    title: "Escolha uma resposta",
    text: "Leia a situação e escolha uma das três opções.",
    video: "videos/inicio/como-funciona-02.mp4",
  },
  {
    icon: Lightbulb,
    title: "Aprenda na hora",
    text: "Veja se acertou e entenda o motivo, sem pressão.",
    video: "videos/inicio/como-funciona-03.mp4",
  },
];

export function Home({ hasProgress, onStart, onContinue }: HomeProps) {
  const [librasContent, setLibrasContent] = useState<{
    text: string;
    src: string;
  } | null>(null);

  return (
    <div className="animate-screen space-y-10">
      <section
        aria-labelledby="screen-title"
        className="card overflow-hidden p-6 text-center sm:p-12"
      >
        <div className="mx-auto mb-5 flex justify-center">
          <Logo size={88} />
        </div>
        <h1
          id="screen-title"
          tabIndex={-1}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl"
        >
          Cyber<span className="text-brand-light">Libras</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft sm:text-xl">
          Aprenda a se proteger na internet com situações do dia a dia,
          respostas explicadas e traduções em Libras.
        </p>
        <div className="mt-3 flex justify-center">
          <LibrasButton
            prominent
            context="apresentação do CyberLibras"
            onClick={() =>
              setLibrasContent({
                text: "Aprenda a se proteger na internet com situações do dia a dia, respostas explicadas e traduções em Libras.",
                src: "videos/inicio/apresentacao.mp4",
              })
            }
          />
        </div>

        <p className="chip mx-auto mt-5 !border-brand-light/60 !text-brand-light">
          <Hand className="h-4 w-4" aria-hidden="true" /> Acessível em Libras
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onStart}
            className="btn-primary !px-8 text-lg"
          >
            Começar jornada{" "}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
          {hasProgress && (
            <button
              type="button"
              onClick={onContinue}
              className="btn-secondary !px-8 text-lg"
            >
              Continuar de onde parei
            </button>
          )}
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          Sem cadastro e sem login. Seu progresso fica salvo só neste aparelho.
        </p>
      </section>

      <section aria-labelledby="how-title">
        <h2 id="how-title" className="mb-4 text-2xl font-bold">
          Como funciona
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text, video }, index) => (
            <li key={title} className="card flex flex-col gap-3 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/20 text-brand-light">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-bold">
                {index + 1}. {title}
              </h3>
              <p className="text-ink-soft">{text}</p>
              <LibrasButton
                context={`regra: ${text}`}
                onClick={() => setLibrasContent({ text, src: video })}
              />
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="levels-title">
        <h2
          id="levels-title"
          className="mb-4 flex items-center gap-2 text-2xl font-bold"
        >
          <ShieldCheck
            className="h-6 w-6 text-brand-light"
            aria-hidden="true"
          />{" "}
          Três níveis
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {levels.map((level) => (
            <li key={level.id} className="card p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-light">
                Nível {level.id}
              </p>
              <p className="mt-1 text-xl font-bold">{level.difficulty}</p>
              <p className="mt-2 text-ink-soft">{level.objective}</p>
              <p className="mt-2 text-ink-soft">
                {level.questions.length} perguntas
              </p>
              <LibrasButton
                context={`nível ${level.id}: ${level.objective}`}
                onClick={() =>
                  setLibrasContent({
                    text: `Nível ${level.id}: ${level.difficulty}. ${level.objective}`,
                    src: `videos/niveis/nivel-${level.id}.mp4`,
                  })
                }
              />
            </li>
          ))}
        </ul>
      </section>
      {librasContent && (
        <LibrasModal
          text={librasContent.text}
          src={librasContent.src}
          onClose={() => setLibrasContent(null)}
        />
      )}
    </div>
  );
}
