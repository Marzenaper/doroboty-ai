import { initialState, stateSchema, type State } from "./model";
export const STORAGE_KEY = "doroboty.prototype.v1";
export const MAX_IMPORT_BYTES = 2_000_000;
export const STORAGE_WARNING_BYTES = 1_800_000;
export class StorageConflictError extends Error {}
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export function parseState(raw: string): State {
  if (scenarioSize(raw) > MAX_IMPORT_BYTES)
    throw new Error("Plik jest za duży (maksymalnie 2 MB).");
  try {
    const state = stateSchema.parse(JSON.parse(raw));
    serializeState(state);
    return state;
  } catch {
    throw new Error(
      "Nieprawidłowy plik lub nieobsługiwana wersja danych. Dotychczasowy stan pozostaje bez zmian.",
    );
  }
}
export function serializeState(state: State) {
  const raw = JSON.stringify(state);
  if (scenarioSize(raw) > MAX_IMPORT_BYTES)
    throw new Error(
      "Scenariusz przekroczyłby limit 2 MB. Zmiana nie została zapisana. Usuń zbędny obraz lub wybierz mniejszy plik.",
    );
  return raw;
}
export function scenarioSize(raw: string) {
  return new TextEncoder().encode(raw).length;
}
export function readState(storage: StoragePort | null) {
  if (!storage)
    return {
      state: initialState(),
      issue:
        "Zapis w przeglądarce jest niedostępny. Zmiany zachowasz przez eksport w ustawieniach.",
      blocked: false,
      original: null,
      stored: null,
    };
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
    return {
      state: raw ? parseState(raw) : initialState(),
      issue: "",
      blocked: false,
      original: null,
      stored: raw,
    };
  } catch {
    return {
      state: initialState(),
      issue:
        "Nie udało się odczytać zapisu. Dotychczasowe dane nie zostaną nadpisane. Pobierz je w ustawieniach, a następnie zaimportuj poprawny plik lub zresetuj scenariusz.",
      blocked: true,
      original: raw,
      stored: raw,
    };
  }
}
export function saveState(storage: StoragePort | null, raw: string, expected: string | null) {
  if (!storage)
    throw new Error(
      "Zapis w przeglądarce jest niedostępny. Wyeksportuj zmiany przed zamknięciem strony.",
    );
  let current: string | null;
  try {
    current = storage.getItem(STORAGE_KEY);
  } catch {
    throw new Error(
      "Nie udało się zapisać zmian w przeglądarce. Wyeksportuj dane przed zamknięciem strony.",
    );
  }
  if (current !== expected)
    throw new StorageConflictError(
      "Zapis zmienił się w innej karcie. Zamknij pozostałe karty i odśwież stronę, aby wczytać aktualny scenariusz. Zmiana nie została zapisana.",
    );
  try {
    storage.setItem(STORAGE_KEY, raw);
  } catch {
    throw new Error(
      "Nie udało się zapisać zmian w przeglądarce. Wyeksportuj dane przed zamknięciem strony.",
    );
  }
}
