import { forwardRef } from "react";
import { CircleCheck, CircleX, Lightbulb } from "lucide-react";
import { LibrasButton } from "./LibrasButton";

interface FeedbackCardProps {
  isCorrect: boolean;
  message: string;
  correctLetter: string;
  correctText: string;
  explanation: string;
  onOpenLibras: () => void;
}

/** Recebe o foco ao aparecer, para que leitores de tela anunciem o resultado e a explicação. */
export const FeedbackCard = forwardRef<HTMLDivElement, FeedbackCardProps>(
  function FeedbackCard(
    {
      isCorrect,
      message,
      correctLetter,
      correctText,
      explanation,
      onOpenLibras,
    },
    ref,
  ) {
    const Icon = isCorrect ? CircleCheck : CircleX;
    return (
      <div
        ref={ref}
        tabIndex={-1}
        className={`animate-feedback mt-5 rounded-3xl border-2 p-5 sm:p-6 ${
          isCorrect ? "border-ok-light bg-ok/15" : "border-bad-light bg-bad/15"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon
            className={`h-8 w-8 shrink-0 ${isCorrect ? "text-ok-light" : "text-bad-light"}`}
            aria-hidden="true"
          />
          <p className="text-xl font-extrabold">{message}</p>
        </div>

        {!isCorrect && (
          <p className="mt-3 text-base sm:text-lg">
            A resposta correta é a alternativa <strong>{correctLetter}</strong>:{" "}
            {correctText}
          </p>
        )}

        <div className="mt-4 flex gap-3 rounded-2xl bg-night/50 p-4">
          <Lightbulb
            className="mt-0.5 h-6 w-6 shrink-0 text-brand-light"
            aria-hidden="true"
          />
          <div>
            <p className="font-bold">Por quê?</p>
            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="text-ink-soft sm:text-lg">{explanation}</p>
              <LibrasButton
                context={`explicação: ${explanation}`}
                onClick={onOpenLibras}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);
