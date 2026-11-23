import { useState } from "react";
import { Link } from "react-router";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cvQuestions } from "./cv-questions";
import "./prototype-two.css";

const examples = [
  {
    name: "Projekt samodzielny",
    cv: "Lena — analityczka procesów. Projekt: automatyzacja klasyfikacji zgłoszeń z AI. Samodzielna konfiguracja i testy. Wynik: 85% zgodnych kategorii w próbie testowej.",
  },
  {
    name: "Projekt zespołowy",
    cv: "Marta — business analyst. Projekt: wdrożenie asystenta AI do obsługi zgłoszeń. Udział w analizie wymagań i testach. Zespół skrócił czas obsługi o 30%.",
  },
  {
    name: "Projekt kursowy",
    cv: "Ewa — specjalistka operacyjna. Kurs AI w procesach. Projekt: demonstracja asystenta klasyfikującego zgłoszenia. Wynik ćwiczenia: 75% zgodnych kategorii.",
  },
];
const key = "doroboty.prototype-two.v1";
const schema = z.object({
  cv: z.string().max(8000),
  answers: z.record(z.string(), z.string().max(700)),
  approved: z.boolean(),
});
function restore() {
  try {
    return schema.parse(JSON.parse(localStorage.getItem(key) ?? "null"));
  } catch {
    return { cv: examples[1].cv, answers: {}, approved: false };
  }
}

export default function PrototypeTwo() {
  const [data, setData] = useState(restore);
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [reviewer, setReviewer] = useState(false);
  const [view, setView] = useState("card");
  const [message, setMessage] = useState("");
  const questions = cvQuestions(data.cv);
  const question = questions[step];
  function save(next: typeof data) {
    setData(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setMessage("Zapisano w tej przeglądarce.");
    } catch {
      setMessage("Nie udało się zapisać. Pobierz kopię przed zamknięciem strony.");
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "doroboty-prototyp-2.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main className="prototype-two">
      <p className="prototype-two-kicker">Prototyp 2 · pytania do CV i karta odpowiedzialności</p>
      <h1>Od deklaracji do konkretu</h1>
      <section className="prototype-two-panel" aria-labelledby="p2-purpose">
        <h2 id="p2-purpose">Dlaczego powstała druga wersja?</h2>
        <p>
          W pierwszej wersji kandydat odpowiadał na przygotowane pytania o swój projekt, a rekruter
          otrzymywał pełny opis odpowiedzi. Sprawdziliśmy ten przebieg na trzech fikcyjnych
          historiach, odgrywanych przez AI.
        </p>
        <p>
          W jednej historii Marta, fikcyjna analityczka biznesowa, napisała w CV, że jej zespół
          wdrożył asystenta AI i skrócił czas obsługi zgłoszeń klientów o 30%. Pierwszy prototyp
          zapytał ogólnie o jej pracę, ale nie zapytał, jak zmierzono te 30%, kto wykonał pomiar ani
          jaki był osobisty udział Marty. Zastrzeżenie, że Marta nie zna metody pomiaru, podało
          dopiero AI odgrywające kandydatkę — nie wydobył go mechanizm pytań.
        </p>
        <p>
          Rekruter otrzymywał też odpowiedzi w długim opisie. Symulacja pokazała potrzebę
          sprawdzenia czytelniejszego układu, ale nie zmierzyła czasu pracy prawdziwego rekrutera.
        </p>
        <p>
          Prototyp 2 rozwija tę samą rozmowę: dopytuje o konkretne deklaracje z CV i porządkuje
          odpowiedzi w karcie odpowiedzialności. Sprawdzamy osobno jakość pytań oraz sposób
          prezentacji. Oszczędność czasu pozostaje do zbadania.
        </p>
      </section>
      <p>
        Pracuj wyłącznie na fikcyjnym CV. Pytania powstają lokalnie według reguł; nie wysyłamy
        treści do modelu AI. Odpowiedzi są deklaracją kandydata, nie potwierdzeniem kompetencji.
      </p>
      <div className="prototype-two-actions">
        <Link to="/aplikuj/ai-product-manager">Otwórz prototyp 1</Link>
        <Button variant="outline" onClick={download}>
          Pobierz kopię
        </Button>
        {data.approved && (
          <Button onClick={() => setReviewer(!reviewer)}>
            {reviewer ? "Wróć do odpowiedzi" : "Otwórz widok rekrutera"}
          </Button>
        )}
      </div>
      <p role="status">{message}</p>
      {!reviewer ? (
        <>
          {!started && !data.approved && (
            <section className="prototype-two-panel">
              <h2>1. Wybierz lub wklej fikcyjne CV</h2>
              <div className="prototype-two-actions">
                {examples.map((example) => (
                  <Button
                    key={example.name}
                    variant="outline"
                    onClick={() => save({ cv: example.cv, answers: {}, approved: false })}
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
              <label>
                Treść fikcyjnego CV
                <Textarea
                  rows={5}
                  maxLength={8000}
                  value={data.cv}
                  onChange={(event) =>
                    save({ cv: event.target.value, answers: {}, approved: false })
                  }
                />
              </label>
              <p>
                Wykrywane są fragmenty projektu i do trzech deklaracji procentowych. Pozostałe
                twierdzenia nie są automatycznie analizowane.
              </p>
              <Button
                disabled={!data.cv.trim()}
                onClick={() => {
                  setStep(0);
                  setStarted(true);
                }}
              >
                Rozpocznij pytania do CV
              </Button>
            </section>
          )}
          {started && !data.approved && (
            <section className="prototype-two-panel" aria-labelledby="p2-question">
              <p>
                Pytanie {step + 1} z {questions.length}
              </p>
              <h2 id="p2-question">{question.label}</h2>
              <label>
                {question.question}
                <Textarea
                  rows={5}
                  maxLength={700}
                  value={data.answers[question.id] ?? ""}
                  onChange={(event) =>
                    save({
                      ...data,
                      answers: { ...data.answers, [question.id]: event.target.value },
                    })
                  }
                />
              </label>
              <p>Nie zgaduj. „Nie wiem” jest poprawną odpowiedzią. Maksymalnie 700 znaków.</p>
              <div className="prototype-two-actions">
                <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
                  Poprzednie pytanie
                </Button>
                <Button
                  disabled={!data.answers[question.id]?.trim()}
                  onClick={() =>
                    step < questions.length - 1 ? setStep(step + 1) : setStarted(false)
                  }
                >
                  {step < questions.length - 1 ? "Następne pytanie" : "Sprawdź odpowiedzi"}
                </Button>
              </div>
            </section>
          )}
          {!started && questions.every((item) => data.answers[item.id]?.trim()) && (
            <section className="prototype-two-panel">
              <h2>Sprawdź treść dla rekrutera</h2>
              <p>
                Te same odpowiedzi zobaczysz na karcie i w pełnym opisie. Możesz poprawić każdą
                deklarację.
              </p>
              {questions.map((item) => (
                <label key={item.id}>
                  {item.label}
                  <Textarea
                    rows={3}
                    maxLength={700}
                    value={data.answers[item.id] ?? ""}
                    onChange={(event) =>
                      save({
                        ...data,
                        approved: false,
                        answers: { ...data.answers, [item.id]: event.target.value },
                      })
                    }
                  />
                </label>
              ))}
              <Button
                onClick={() => {
                  save({ ...data, approved: true });
                  setReviewer(true);
                }}
              >
                Zatwierdź treść i pokaż rekruterowi
              </Button>
            </section>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setStarted(false);
              setStep(0);
              save({ ...data, answers: {}, approved: false });
            }}
          >
            Rozpocznij nową wersję odpowiedzi
          </Button>
        </>
      ) : (
        <section className="prototype-two-panel">
          <h2>Materiały do pierwszej oceny</h2>
          <p>
            Trzy widoki poniżej służą do porównania materiałów jednej osoby. Nie są trzema ocenami
            kandydata ani trzema różnymi prototypami.
          </p>
          <ol className="prototype-two-view-guide">
            <li>
              <strong>Samo CV — punkt odniesienia.</strong> Zobacz, co rekruter może ustalić przed
              rozmową z asystentem i czego brakuje.
            </li>
            <li>
              <strong>CV i pełny opis — dodatkowe informacje.</strong> Przeczytaj zatwierdzone
              odpowiedzi z prototypu 2 w ciągłej liście. Porównanie z samym CV pokazuje, jakie
              informacje wniosły pytania. To nie jest zapis rozmowy z prototypu 1.
            </li>
            <li>
              <strong>CV i karta odpowiedzialności — inna prezentacja.</strong> Znajdź te same
              odpowiedzi w osobnych blokach. Porównanie z pełnym opisem służy sprawdzeniu, czy układ
              ułatwia poprawną i szybką ocenę. Nie dodaje nowych faktów ani nie skraca automatycznie
              tekstu.
            </li>
          </ol>
          <p>
            Brak oceny procentowej wkładu. Karta porządkuje słowa kandydata i nie potwierdza ich
            prawdziwości.
          </p>
          <div
            className="prototype-two-actions"
            role="group"
            aria-label="Sposób prezentacji materiałów"
          >
            {[
              ["cv", "Samo CV"],
              ["full", "CV i pełny opis"],
              ["card", "CV i karta odpowiedzialności"],
            ].map(([id, label]) => (
              <Button
                key={id}
                variant={view === id ? "default" : "outline"}
                aria-pressed={view === id}
                onClick={() => setView(id)}
              >
                {label}
              </Button>
            ))}
          </div>
          <p role="status">
            {view === "cv"
              ? "Teraz: samo CV, bez odpowiedzi na dodatkowe pytania."
              : view === "full"
                ? "Teraz: CV i wszystkie zatwierdzone odpowiedzi w pełnym opisie. CV otworzysz poniżej."
                : "Teraz: CV i te same odpowiedzi w karcie odpowiedzialności. CV otworzysz poniżej, a pytanie źródłowe przy każdej odpowiedzi."}
          </p>
          <details open={view === "cv"}>
            <summary>CV źródłowe</summary>
            <p className="prototype-two-source">{data.cv}</p>
          </details>
          {view === "full" && (
            <div>
              <h3>Pełny opis · odpowiedzi zatwierdzone</h3>
              {questions.map((item) => (
                <p key={item.id}>
                  <strong>{item.label}: </strong>
                  {data.answers[item.id] || "Brak informacji"}
                </p>
              ))}
            </div>
          )}
          {view === "card" && (
            <div className="prototype-two-grid">
              {questions.map((item, index) => (
                <article key={item.id}>
                  <h3>{item.label}</h3>
                  <p>{data.answers[item.id] || "Brak informacji — wymaga dopytania"}</p>
                  <small>Źródło: odpowiedź {index + 1} · deklaracja kandydata</small>
                  <details>
                    <summary>Pokaż pytanie źródłowe</summary>
                    <p>{item.question}</p>
                  </details>
                </article>
              ))}
            </div>
          )}
          <p>
            W badaniu mierzymy poprawność interpretacji i aktywny czas pracy człowieka. Samo
            przełączenie widoku nie jest wynikiem eksperymentu.
          </p>
        </section>
      )}
    </main>
  );
}
