import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const [name, result] of [
  ["Projekt samodzielny", "85%"],
  ["Projekt zespołowy", "30%"],
  ["Projekt kursowy", "75%"],
]) {
  test(`prototype 2 retains approved evidence: ${name}`, async ({ page }) => {
    await page.goto("/#/prototyp-2");
    await page.getByRole("button", { name, exact: true }).click();
    await page.getByRole("button", { name: "Rozpocznij pytania do CV", exact: true }).click();
    const answers =
      name === "Projekt kursowy"
        ? [
            "Samodzielnie zmieniłam instrukcję modelu i zrobiłam prezentację.",
            "Prowadzący dostarczył gotowy przepływ. Nie budowałam integracji.",
            "Ćwiczenie na kursie, bez prawdziwych użytkowników i wdrożenia w firmie.",
            "Sprawdziłam 12 fikcyjnych zgłoszeń z własnym kluczem: 9 zgodnych.",
            "Nie testowałam na nowej próbie. Nie mierzyłam oszczędności czasu.",
            "75% to 9/12 przykładów kursowych, mój pomiar. Brak testu na nowych danych.",
          ]
        : name === "Projekt zespołowy"
          ? [
              "Osobiście zebrałam wymagania i przygotowałam klucz do 50 zgłoszeń.",
              "Inżynier zrobił integrację, data scientist prompty. Nie programowałam.",
              "Pilotaż w pracy. Nie znam liczby użytkowników ani okresu obserwacji.",
              "Użyłam AI do szkiców kryteriów i ręcznie sprawdziłam 50 wyników.",
              "Nie potrafię potwierdzić wyniku 30%. Brak metodologii.",
              "Nie wiem. 30% podał lider; nie znam próby, okresu ani porównania.",
            ]
          : [
              "Samodzielnie przygotowałam instrukcję modelu, kategorie i połączenie skrzynki z arkuszem.",
              "Kierownik zatwierdził dostęp. Nie miałam zespołu wdrożeniowego.",
              "Pilotaż w pracy, 4 osoby przez 2 tygodnie.",
              "Porównałam 80 fikcyjnych przykładów z kluczem: 68 zgodnych.",
              "Brak pomiaru czasu obsługi i niezależnej oceny jakości.",
              "85% to 68/80 fikcyjnych przykładów. Sama porównałam je z kluczem; nie jest to wynik produkcyjny.",
            ];
    for (let index = 0; index < answers.length; index++) {
      if (index === 5) {
        await expect(page.getByRole("textbox")).toHaveAccessibleName(new RegExp(result));
        if (name === "Projekt zespołowy")
          await page.screenshot({
            path: "../prototypes/prototype-two/question-30-desktop.png",
            fullPage: true,
          });
      }
      await expect(
        page.getByRole("button", {
          name: index === 5 ? "Sprawdź odpowiedzi" : "Następne pytanie",
          exact: true,
        }),
      ).toBeDisabled();
      await page.getByRole("textbox").fill(answers[index]);
      await page
        .getByRole("button", {
          name: index === 5 ? "Sprawdź odpowiedzi" : "Następne pytanie",
          exact: true,
        })
        .click();
    }
    await page
      .getByRole("button", { name: "Zatwierdź treść i pokaż rekruterowi", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Materiały do pierwszej oceny", exact: true }),
    ).toBeVisible();
    await expect(page.getByText(answers[5], { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "CV i pełny opis", exact: true }).click();
    await expect(page.getByText(answers[5], { exact: false })).toBeVisible();
    await page.reload();
    await page.getByRole("button", { name: "Otwórz widok rekrutera", exact: true }).click();
    await expect(page.getByText(answers[5], { exact: true })).toBeVisible();
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(audit.violations).toEqual([]);
    if (name === "Projekt zespołowy") {
      await page.screenshot({
        path: "../prototypes/prototype-two/recruiter-desktop.png",
        fullPage: true,
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({
        path: "../prototypes/prototype-two/recruiter-mobile.png",
        fullPage: true,
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      expect(
        (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations,
      ).toEqual([]);
    }
  });
}
