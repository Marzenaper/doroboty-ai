export const evidenceFields = [
  {
    id: "own",
    label: "Samodzielnie",
    question: "Które zadania wykonano osobiście? Podaj konkretną czynność i przykład.",
  },
  {
    id: "team",
    label: "Zespół i wsparcie",
    question:
      "Co wykonali inni, w czym pomogli i za co nie odpowiadasz? Jeśli pracowano samodzielnie, napisz to.",
  },
  {
    id: "context",
    label: "Kontekst i użytkownicy",
    question:
      "Czy to kurs, demo, pilotaż czy użycie w pracy? Kto korzystał z wyniku i przez jaki czas?",
  },
  {
    id: "ai",
    label: "Użycie i sprawdzenie AI",
    question:
      "Do czego osobiście użyto AI? Jak sprawdzono odpowiedź i jakie ograniczenia pozostały?",
  },
  {
    id: "unknown",
    label: "Niewiadome i ograniczenia",
    question:
      "Czego nie potrafisz potwierdzić? Jakie informacje lub materiały pozostają niedostępne?",
  },
] as const;

// Bounded local extraction, never a competency assessment or verification of a claim.
export function cvClaims(cv: string): string[] {
  return [
    ...new Set(
      cv
        .split(/(?<=[.!?])\s+|\n/u)
        .filter((line) => /\d+(?:[.,]\d+)?\s*%/u.test(line))
        .map((claim) => claim.trim())
        .filter(Boolean),
    ),
  ].slice(0, 3);
}

export function cvQuestions(cv: string) {
  const project = cv
    .split(/\n|(?<=[.!?])\s+/u)
    .find((line) => /projekt|wdroż|automat|asystent/iu.test(line))
    ?.trim();
  return [
    ...evidenceFields.map((field, index) => ({
      ...field,
      question: index === 0 && project ? `W CV: „${project}”. ${field.question}` : field.question,
    })),
    ...cvClaims(cv).map((claim, index) => ({
      id: `claim-${index}`,
      label: `Pomiar ${index + 1}`,
      question: `W CV: „${claim}”. Co dokładnie porównano, w jakim okresie i na jakiej próbie? Kto mierzył wynik i jaki był Twój udział? Możesz odpowiedzieć „nie wiem / nie mierzyłam”.`,
    })),
  ];
}
