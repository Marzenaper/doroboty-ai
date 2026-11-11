import { EditProjectImages, ProjectImages } from "./project-images";
import type { ProjectImage } from "./project-image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProjectRecordings } from "./record-answer";
import type { ProjectRecording } from "./project-recording";

const generalPrompts = [
  {
    question: "Wybierz jedno zadanie z projektu i opisz dokładnie, jaki był Twój wkład.",
    label: "Mój wkład i wsparcie zespołu",
  },
  {
    question: "Gdzie powstał projekt, jak używałaś AI i jakie umiejętności wykorzystałaś?",
    label: "Kontekst, użycie AI i umiejętności",
  },
  {
    question: "Jaki problem rozwiązałaś i jaką decyzję podjęłaś?",
    label: "Problem i decyzja",
  },
];

const annaPrompts = [
  {
    question:
      "W CV piszesz o wdrożeniu asystenta do obsługi zgłoszeń. Wybierz jedno zadanie z tego wdrożenia i opisz dokładnie, jaki był Twój wkład.",
    label: "Mój wkład i wsparcie zespołu",
  },
  {
    question:
      "Jak korzystałaś z AI w tym projekcie? Podaj przykład zadania, które sama wykonałaś, i opowiedz, jak sprawdziłaś wynik.",
    label: "Kontekst, użycie AI i umiejętności",
  },
  {
    question:
      "Jaki problem pojawił się podczas wdrożenia i jaką decyzję podjęłaś? W CV podajesz skrócenie czasu obsługi o 30%. Jak to zmierzyliście?",
    label: "Problem, decyzja i pomiar",
  },
];

// The prototype checks a small set of Polish cues; it does not assess the candidate.
function needsContributionFollowUp(answer: string) {
  const words = answer.toLocaleLowerCase("pl").match(/\p{L}+/gu) ?? [];
  const collective =
    words.some((word) => /(?:liśmy|łyśmy)$/.test(word)) ||
    /(?:wspólnie|razem z zespołem|zespół)/i.test(answer);
  const personalAction = words.some((word) =>
    /^(?:zrobi|przygotowa|prowadzi|przeprowadzi|zaprojektowa|odpowiada|wdroży|zbudowa|testowa|przetestowa|wybra|ustali|zdecydowa|analizowa|sprawdzi|napisa|opracowa|wykona|zbiera|zebra|skonfigurowa|porówna)(?:łam|łem)$/.test(
      word,
    ),
  );
  return collective && !personalAction;
}

export function YourProject({
  candidateId,
  cv,
  approved,
  approvedRecordings,
  approvedImages,
  onApprove,
  disabled,
}: {
  candidateId: string;
  cv: string;
  approved: string;
  approvedRecordings: readonly ProjectRecording[];
  approvedImages: ProjectImage[];
  onApprove: (value: string, images: ProjectImage[]) => void;
  disabled: boolean;
}) {
  const [images, setImages] = useState<ProjectImage[]>(approvedImages);
  const [imagesBusy, setImagesBusy] = useState(false);
  const [started, setStarted] = useState(false);
  const [pendingContribution, setPendingContribution] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [proposal, setProposal] = useState<string | null>(null);
  const annaScenario =
    candidateId === "candidate-anna" && cv.includes("asystenta do zgłoszeń") && cv.includes("30%");
  const prompts = annaScenario ? annaPrompts : generalPrompts;
  const prompt = prompts[answers.length];

  function saveAnswer(answer: string) {
    const next = [...answers, answer];
    setAnswers(next);
    setInput("");
    setPendingContribution(null);
    if (next.length === prompts.length)
      setProposal(next.map((value, index) => prompts[index].label + ": " + value).join("\n\n"));
  }

  function advance() {
    const answer = input.trim();
    if (!prompt || !answer) return;
    if (pendingContribution !== null) {
      saveAnswer(pendingContribution + "\nDoprecyzowanie wkładu: " + answer);
    } else if (answers.length === 0 && needsContributionFollowUp(answer)) {
      setPendingContribution(answer);
      setInput("");
    } else {
      saveAnswer(answer);
    }
  }

  return (
    <section
      className="application-form-section grid gap-4 border-s-2 border-primary px-5"
      aria-labelledby="your-project-title"
    >
      <header>
        <h3 id="your-project-title">Twój projekt</h3>
        <p className="application-help">
          Chcemy lepiej poznać Twoje doświadczenie zawodowe. Przygotowaliśmy trzy dodatkowe
          pytania. Po zatwierdzeniu odpowiedzi przejdziesz do dalszej części zgłoszenia.
        </p>
      </header>
      {approved && proposal === null ? (
        <>
          <p className="font-semibold text-[var(--gui-link)]">Opis zatwierdzony</p>
          <p className="whitespace-pre-wrap wrap-anywhere">{approved}</p>
          <ProjectRecordings recordings={approvedRecordings} />
          <ProjectImages images={approvedImages} />
          <Button
            type="button"
            className="justify-self-start"
            variant="outline"
            disabled={disabled}
            onClick={() => {
              setImages(approvedImages);
              setProposal(approved);
            }}
          >
            Edytuj opis projektu
          </Button>
        </>
      ) : proposal !== null ? (
        <>
          <label className="grid gap-2">
            Podgląd opisu dla rekrutera. Sprawdź i popraw tekst.
            <Textarea
              rows={8}
              value={proposal}
              maxLength={4000}
              onChange={(e) => setProposal(e.target.value)}
            />
          </label>
          <ProjectRecordings recordings={approvedRecordings} />
          <EditProjectImages images={images} onChange={setImages} onBusy={setImagesBusy} />
          <div className="application-actions">
            <Button
              type="button"
              disabled={disabled || imagesBusy || !proposal.trim()}
              onClick={() => {
                onApprove(proposal.trim(), images);
                setProposal(null);
              }}
            >
              Zatwierdź opis projektu
            </Button>
            {approved && (
              <Button
                type="button"
                variant="outline"
                disabled={imagesBusy}
                onClick={() => setProposal(null)}
              >
                Anuluj edycję
              </Button>
            )}
          </div>
        </>
      ) : started && prompt ? (
        <>
          {answers.map((answer, index) => (
            <p key={prompts[index].label} className="wrap-anywhere">
              <strong>{prompts[index].label}</strong>
              <br />
              {answer}
            </p>
          ))}
          <p className="text-sm text-[var(--gui-link)]">
            {pendingContribution === null
              ? `Pytanie ${answers.length + 1} z ${prompts.length}`
              : "Dopytanie o Twój wkład"}{" "}
            · symulacja
          </p>
          {pendingContribution !== null && (
            <p className="wrap-anywhere">
              <strong>Twoja pierwsza odpowiedź</strong>
              <br />
              {pendingContribution}
            </p>
          )}
          <label className="grid gap-2">
            {pendingContribution === null
              ? prompt.question
              : "Za które zadanie odpowiadałaś osobiście? Podaj jeden przykład."}
            <Textarea
              key={pendingContribution === null ? prompt.label : "contribution-follow-up"}
              rows={3}
              aria-describedby={
                answers.length === 0 && pendingContribution === null
                  ? "contribution-guide"
                  : undefined
              }
              maxLength={pendingContribution === null ? 1000 : 600}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </label>
          {answers.length === 0 && pendingContribution === null && (
            <div
              id="contribution-guide"
              className="application-help grid gap-2 rounded-sm border border-[var(--gui-edge)]/45 bg-[var(--gui-control)]/35 px-4 py-3"
            >
              <p className="font-semibold text-foreground">W odpowiedzi uwzględnij trzy rzeczy:</p>
              <ol className="list-decimal ps-5">
                <li>
                  <strong>Zadanie:</strong> co trzeba było zrobić?
                </li>
                <li>
                  <strong>Twój wkład:</strong> co zrobiłaś lub za co odpowiadałaś osobiście? Podaj
                  konkretny przykład.
                </li>
                <li>
                  <strong>Rola zespołu:</strong> co zrobili inni lub w czym Ci pomogli? Jeśli
                  pracowałaś samodzielnie, napisz to.
                </li>
              </ol>
            </div>
          )}
          <div className="application-actions">
            <Button type="button" disabled={!input.trim()} onClick={advance}>
              {pendingContribution !== null
                ? "Dodaj i przejdź dalej"
                : answers.length === prompts.length - 1
                  ? "Pokaż opis projektu"
                  : "Następne pytanie"}
            </Button>
            {pendingContribution !== null && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setInput(pendingContribution);
                  setPendingContribution(null);
                }}
              >
                Cofnij
              </Button>
            )}
            {pendingContribution !== null && (
              <Button
                type="button"
                variant="outline"
                onClick={() => saveAnswer(pendingContribution)}
              >
                Pomiń dopytanie
              </Button>
            )}
          </div>
        </>
      ) : (
        <Button
          type="button"
          className="justify-self-start"
          disabled={disabled}
          onClick={() => setStarted(true)}
        >
          Rozpocznij rozmowę
        </Button>
      )}
      <p className="application-help">
        Symulacja asystenta. Przy pierwszej odpowiedzi może pojawić się jedno dopytanie o Twój
        wkład. Do zgłoszenia trafi zatwierdzony opis.
      </p>
    </section>
  );
}
