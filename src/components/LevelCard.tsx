import {
  ArrowRight,
  CircleCheck,
  Lock,
  LockOpen,
  RotateCcw,
} from "lucide-react";
import type { Level } from "../types/quiz";
import { LibrasButton } from "./LibrasButton";

export type LevelStatus = "locked" | "available" | "passed";

interface LevelCardProps {
  level: Level;
  status: LevelStatus;
  bestScore?: number;
  previousTitle?: string;
  justUnlocked: boolean;
  onStart: () => void;
  onOpenLibras: (text: string, src: string) => void;
}

export function LevelCard({
  level,
  status,
  bestScore,
  previousTitle,
  justUnlocked,
  onStart,
  onOpenLibras,
}: LevelCardProps) {
  const locked = status === "locked";
  const descriptionId = `level-${level.id}-status`;
  const total = level.questions.length;

  return (
    <li
      className={`card relative flex flex-col gap-4 p-5 sm:p-6 ${locked ? "opacity-80" : ""} ${
        justUnlocked ? "ring-2 ring-brand-light" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-extrabold ${
            locked ? "bg-slate-700 text-ink-soft" : "bg-brand text-white"
          }`}
          aria-hidden="true"
        >
          {level.id}
        </span>
        {status === "locked" && (
          <span className="chip">
            <Lock className="h-4 w-4" aria-hidden="true" /> Bloqueado
          </span>
        )}
        {status === "available" && (
          <span
            className={`chip !border-brand-light/60 !text-brand-light ${justUnlocked ? "animate-unlock" : ""}`}
          >
            <LockOpen className="h-4 w-4" aria-hidden="true" />{" "}
            {justUnlocked ? "Desbloqueado!" : "Liberado"}
          </span>
        )}
        {status === "passed" && (
          <span className="chip !border-ok-light/60 !text-ok-light">
            <CircleCheck className="h-4 w-4" aria-hidden="true" /> Concluído
          </span>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold">
          Nível {level.id}: {level.difficulty}
        </h3>
        <p className="mt-1 text-ink-soft">{level.objective}</p>
        <LibrasButton
          context={`explicação do nível ${level.id}: ${level.objective}`}
          onClick={() =>
            onOpenLibras(
              `Nível ${level.id}: ${level.difficulty}. ${level.objective}`,
              `videos/niveis/nivel-${level.id}.mp4`,
            )
          }
        />
      </div>

      <p className="text-sm text-ink-soft">
        {total} perguntas · mínimo de {level.minimumScore} acertos para avançar
      </p>

      <p id={descriptionId} className="text-sm font-semibold">
        {status === "locked" &&
          `Para liberar, seja aprovado no nível anterior${previousTitle ? ` (${previousTitle})` : ""}.`}
        {status === "available" && "Pronto para começar."}
        {status === "passed" &&
          `Melhor resultado: ${bestScore ?? 0} de ${total} acertos.`}
      </p>

      <button
        type="button"
        onClick={() => {
          if (!locked) onStart();
        }}
        aria-disabled={locked}
        aria-describedby={descriptionId}
        className={`mt-auto ${locked ? "btn-secondary cursor-not-allowed opacity-60" : status === "passed" ? "btn-secondary" : "btn-primary"}`}
      >
        {locked && (
          <>
            <Lock className="h-5 w-5" aria-hidden="true" /> Bloqueado
          </>
        )}
        {status === "available" && (
          <>
            Começar nível {level.id}{" "}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </>
        )}
        {status === "passed" && (
          <>
            <RotateCcw className="h-5 w-5" aria-hidden="true" /> Jogar novamente
          </>
        )}
      </button>
    </li>
  );
}
