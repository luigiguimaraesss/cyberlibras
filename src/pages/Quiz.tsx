import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Star } from "lucide-react";
import type { Level, Question } from "../types/quiz";
import { prefersReducedMotion } from "../utils/assets";
import { FeedbackCard } from "../components/FeedbackCard";
import { LibrasModal } from "../components/LibrasModal";
import { ProgressBar } from "../components/ProgressBar";
import { QuestionCard } from "../components/QuestionCard";

interface QuizProps {
  level: Level;
  question: Question;
  questionIndex: number;
  selectedAnswerId: string | null;
  confirmed: boolean;
  score: number;
  onSelect: (answerId: string) => void;
  onConfirm: () => void;
  onNext: () => void;
}

export function Quiz({
  level,
  question,
  questionIndex,
  selectedAnswerId,
  confirmed,
  score,
  onSelect,
  onConfirm,
  onNext,
}: QuizProps) {
  // O modal de Libras é estado local da tela: abrir ou fechar não altera a resposta selecionada.
  const [libras, setLibras] = useState<{ text: string; src?: string } | null>(
    null,
  );
  const feedbackRef = useRef<HTMLDivElement>(null);

  const total = level.questions.length;
  const isLast = questionIndex === total - 1;
  const chosen = question.answers.find(
    (answer) => answer.id === selectedAnswerId,
  );
  const correctIndex = question.answers.findIndex((answer) => answer.isCorrect);
  const correct = question.answers[correctIndex];

  useEffect(() => {
    if (!confirmed) return;
    const el = feedbackRef.current;
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [confirmed]);

  return (
    <section
      aria-label={`Nível ${level.id}: ${level.difficulty}`}
      className="mx-auto w-full max-w-3xl"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="chip !text-brand-light">
          Nível {level.id} · {level.difficulty}
        </span>
        <span className="chip" aria-label={`Acertos até agora: ${score}`}>
          <Star className="h-4 w-4 text-yellow-300" aria-hidden="true" />{" "}
          Acertos: {score}
        </span>
      </div>

      <ProgressBar
        current={questionIndex + 1}
        total={total}
        completed={questionIndex + (confirmed ? 1 : 0)}
      />

      <QuestionCard
        key={question.id}
        question={question}
        index={questionIndex}
        total={total}
        selectedAnswerId={selectedAnswerId}
        confirmed={confirmed}
        onSelect={onSelect}
        onOpenLibras={(text, src) => setLibras({ text, src })}
      />

      {confirmed && chosen && (
        <FeedbackCard
          ref={feedbackRef}
          isCorrect={chosen.isCorrect}
          message={
            chosen.isCorrect ? question.successMessage : question.errorMessage
          }
          correctLetter={String.fromCharCode(65 + correctIndex)}
          correctText={correct.text}
          explanation={question.explanation}
          onOpenLibras={() =>
            setLibras({
              text: question.explanation,
              src: question.explanationVideo,
            })
          }
        />
      )}

      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        {!confirmed ? (
          <>
            {selectedAnswerId === null && (
              <p className="text-center text-sm text-ink-soft sm:mr-auto sm:text-left">
                Escolha uma resposta para confirmar.
              </p>
            )}
            <button
              type="button"
              onClick={onConfirm}
              disabled={selectedAnswerId === null}
              className="btn-primary"
            >
              <Check className="h-5 w-5" aria-hidden="true" /> Confirmar
              resposta
            </button>
          </>
        ) : (
          <button type="button" onClick={onNext} className="btn-primary">
            {isLast ? "Ver resultado" : "Próxima pergunta"}{" "}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {libras && (
        <LibrasModal
          text={libras.text}
          src={libras.src}
          onClose={() => setLibras(null)}
        />
      )}
    </section>
  );
}
