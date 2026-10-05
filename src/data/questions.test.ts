import { describe, expect, it } from "vitest";
import { TOTAL_QUESTIONS, getLevel, levels, videoPath } from "./questions";
import { minimumToPass } from "../utils/scoring";

/** Gabarito conforme a especificação (questão -> alternativa correta). */
const ANSWER_KEY: Record<number, string> = {
  1: "c",
  2: "b",
  3: "c",
  4: "b",
  5: "b",
  6: "c",
  7: "a",
  8: "b",
  9: "c",
  10: "b",
  11: "a",
  12: "c",
  13: "b",
  14: "c",
  15: "a",
  16: "b",
  17: "c",
};

describe("banco de questões", () => {
  const all = levels.flatMap((level) => level.questions);

  it("tem 3 níveis com 7, 5 e 5 questões (17 no total)", () => {
    expect(levels.map((level) => level.questions.length)).toEqual([7, 5, 5]);
    expect(TOTAL_QUESTIONS).toBe(17);
    expect(all.map((q) => q.id)).toEqual(
      Array.from({ length: 17 }, (_, i) => i + 1),
    );
  });

  it("usa as notas mínimas de aprovação 4, 3 e 3 (mais da metade)", () => {
    expect(levels.map((level) => level.minimumScore)).toEqual([4, 3, 3]);
    for (const level of levels)
      expect(level.minimumScore).toBe(minimumToPass(level.questions.length));
  });

  it("cada questão tem exatamente 3 alternativas e 1 correta", () => {
    for (const q of all) {
      expect(q.answers).toHaveLength(3);
      expect(q.answers.filter((a) => a.isCorrect)).toHaveLength(1);
      expect(new Set(q.answers.map((a) => a.id)).size).toBe(3);
    }
  });

  it("as respostas corretas correspondem ao gabarito da especificação", () => {
    for (const q of all) {
      expect(q.answers.find((a) => a.isCorrect)?.id, `questão ${q.id}`).toBe(
        ANSWER_KEY[q.id],
      );
    }
  });

  it("toda questão tem enunciado, explicação, tema, mensagens e nível coerente", () => {
    for (const level of levels) {
      for (const q of level.questions) {
        expect(q.level).toBe(level.id);
        expect(q.statement.length).toBeGreaterThan(10);
        expect(q.explanation.length).toBeGreaterThan(10);
        expect(q.category.length).toBeGreaterThan(2);
        expect(q.successMessage).toBe("Parabéns! Resposta correta!");
        expect(q.errorMessage).toBe("Não foi dessa vez! Vamos aprender.");
        expect(q.answers.every((a) => a.text.length > 0)).toBe(true);
      }
    }
  });

  it("todo enunciado e toda alternativa têm caminho de vídeo em Libras (opcional no disco)", () => {
    for (const q of levels.flatMap((level) => level.questions)) {
      expect(q.statementVideo).toBe(videoPath(q.level, q.id, "pergunta"));
      expect(q.explanationVideo).toBe(videoPath(q.level, q.id, "explicacao"));
      for (const a of q.answers)
        expect(a.librasVideo).toBe(
          videoPath(q.level, q.id, a.id as "a" | "b" | "c"),
        );
    }
    expect(videoPath(1, 1, "pergunta")).toBe("videos/nivel-1/q01-pergunta.mp4");
    expect(videoPath(1, 1, "explicacao")).toBe(
      "videos/nivel-1/q01-explicacao.mp4",
    );
    expect(videoPath(3, 17, "c")).toBe("videos/nivel-3/q17-alt-c.mp4");
  });

  it("getLevel encontra níveis existentes e ignora inexistentes", () => {
    expect(getLevel(2)?.difficulty).toBe("Intermediário");
    expect(getLevel(99)).toBeUndefined();
    expect(getLevel(null)).toBeUndefined();
  });
});
