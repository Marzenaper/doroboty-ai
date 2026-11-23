# Czytelność całego motywu Plakat + Neon

## Cel

Usunąć jasny tekst na jasnych tłach w całym prototypie, zachowując obecną identyfikację.

## Kryteria akceptacji

- Komunikat wysłania aplikacji ma czytelny tekst, ikonę i obramowanie.
- Wspólne komunikaty, błędy, przyciski i pola korzystają ze spójnych par kolorów.
- Nieaktywny przycisk wysłania aplikacji zachowuje czytelną etykietę.
- Sprawdzone są strony publiczne oraz widoki kandydata i pracodawcy, na komputerze i telefonie.
- Zwykły tekst ma kontrast minimum 4,5:1, duży minimum 3:1.

## Zakres

Wspólny arkusz aktywnego motywu. Bez zmiany procesów produktu; FEATURES.md nie wymaga zmiany.

## Wynik — 2026-11-23

- Naprawiono jasne tło wspólnych komunikatów, kolory błędów, ostrzeżeń i powodzenia oraz etykiety nieaktywnych przycisków i placeholderów.
- Axe color-contrast: 40 kontroli tras i ról (20 na 1440 px, 20 na 390 px), brak zgłoszonych naruszeń. To kontrola widocznych stanów, nie dowód sprawdzenia każdej możliwej interakcji.
- TypeScript, ESLint, 30 testów jednostkowych i build: zaliczone.
- Pełny npm run check zatrzymał się na zastanych problemach formatowania w 116 plikach; nie przeformatowywano niezwiązanych plików.
- Commit a578e0c wysłany na design/poster-neon. Nowe zmienne kolorów i czytelny komunikat potwierdzono w działającej aplikacji Netlify.
- Adres doroboty-plakat-neon.vercel.app jest osobną statyczną prezentacją stylu, a działająca aplikacja jest na jade-maamoul-e2cbc1.netlify.app.
