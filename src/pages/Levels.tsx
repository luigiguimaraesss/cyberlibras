import { useState } from "react";
import { Trophy } from "lucide-react";
import { levels } from "../data/questions";
import type { Progress } from "../types/quiz";
import { isLevelPassed, isLevelUnlocked } from "../utils/scoring";
import { LevelCard } from "../components/LevelCard";
import type { LevelStatus } from "../components/LevelCard";
import { LibrasModal } from "../components/LibrasModal";

interface LevelsProps {
  progress: Progress;
  journeyComplete: boolean;
  newlyUnlocked: number | null;
  onStartLevel: (levelId: number) => void;
  onShowCompletion: () => void;
}

export function Levels({
  progress,
  journeyComplete,
  newlyUnlocked,
  onStartLevel,
  onShowCompletion,
}: LevelsProps) {
  const [librasContent, setLibrasContent] = useState<{
    text: string;
    src: string;
  } | null>(null);

  return (
    <section aria-labelledby="screen-title" className="animate-screen">
      <h1 id="screen-title" tabIndex={-1} className="text-3xl font-extrabold">
        Escolha um nível
      </h1>
      <p className="mt-2 text-lg text-ink-soft">
        Passe de nível acertando mais da metade das perguntas. Você pode jogar
        de novo quando quiser.
      </p>

      {journeyComplete && (
        <div className="card mt-6 flex flex-col items-start gap-4 border-ok-light/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3 text-lg font-bold">
            <Trophy className="h-7 w-7 text-ok-light" aria-hidden="true" /> Você
            concluiu a jornada!
          </p>
          <button
            type="button"
            onClick={onShowCompletion}
            className="btn-primary"
          >
            Ver conclusão
          </button>
        </div>
      )}

      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {levels.map((level, index) => {
          const status: LevelStatus = isLevelPassed(progress, level)
            ? "passed"
            : isLevelUnlocked(levels, progress, level.id)
              ? "available"
              : "locked";
          return (
            <LevelCard
              key={level.id}
              level={level}
              status={status}
              bestScore={progress.levels[level.id]?.bestScore}
              previousTitle={
                index > 0 ? `nível ${levels[index - 1].id}` : undefined
              }
              justUnlocked={newlyUnlocked === level.id}
              onStart={() => onStartLevel(level.id)}
              onOpenLibras={(text, src) => setLibrasContent({ text, src })}
            />
          );
        })}
      </ul>
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
