import { describe, it, expect } from "vitest";
import { cvClaims, cvQuestions } from "./cv-questions";
describe("local CV claim questions", () => {
  it("asks about a percentage from an arbitrary CV, not a specific persona", () => {
    const questions = cvQuestions("Marta. Projekt: klasyfikacja zgłoszeń. Czas skrócony o 30%.");
    expect(questions.at(-1)?.question).toContain("30%");
    expect(questions.at(-1)?.question).toContain("Kto mierzył");
  });
  it("does not invent a measurement when no number was supplied", () => {
    expect(cvQuestions("Projekt kursowy: demonstracja klasyfikacji.")).toHaveLength(5);
    expect(cvClaims("Brak wyniku pomiaru")).toEqual([]);
  });
  it("retains decimal percentages and caps the number of claims", () => {
    expect(cvClaims("Wynik 12,5%. Inny 10%. Kolejny 20%. Ostatni 40%.")).toHaveLength(3);
    expect(cvClaims("Wynik 12,5%.")[0]).toContain("12,5%");
  });
});
