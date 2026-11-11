import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { initialState, transition, type Action, type State } from "./model";
import {
  parseState,
  readState,
  saveState,
  scenarioSize,
  serializeState,
  StorageConflictError,
  STORAGE_WARNING_BYTES,
  type StoragePort,
} from "./storage";
function browserStorage(): StoragePort | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
function useStore() {
  const [loaded] = useState(() => readState(browserStorage()));
  const [state, setState] = useState(loaded.state);
  const [issue, setIssue] = useState(loaded.issue);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(loaded.blocked);
  const latest = useRef(state);
  const stored = useRef(loaded.stored);
  const [nearLimit, setNearLimit] = useState(
    () => scenarioSize(serializeState(loaded.state)) >= STORAGE_WARNING_BYTES,
  );
  function commit(next: State, replace = false) {
    const raw = serializeState(next);
    if (!blocked || replace) {
      try {
        saveState(browserStorage(), raw, stored.current);
        stored.current = raw;
        setIssue("");
        if (replace) setBlocked(false);
      } catch (e) {
        if (e instanceof StorageConflictError) throw e;
        setIssue((e as Error).message);
      }
    }
    latest.current = next;
    setState(next);
    setError("");
    setNearLimit(scenarioSize(raw) >= STORAGE_WARNING_BYTES);
  }
  function run(action: Action) {
    try {
      commit(transition(latest.current, action));
      return true;
    } catch (e) {
      setError(
        e instanceof Error && e.name !== "ZodError"
          ? e.message
          : "Sprawdź poprawność i długość wprowadzonych danych.",
      );
      return false;
    }
  }
  function importState(raw: string) {
    try {
      const next = parseState(raw);
      commit(next, true);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  return {
    state,
    issue:
      issue ||
      (nearLimit
        ? "Scenariusz zbliża się do limitu 2 MB. Przed dodaniem kolejnych obrazów usuń niepotrzebne załączniki lub wybierz mniejsze pliki."
        : ""),
    error,
    blocked,
    original: loaded.original,
    run,
    importState,
    clearError: () => setError(""),
    reset: () => {
      try {
        commit(initialState(), true);
        return true;
      } catch (e) {
        setError((e as Error).message);
        return false;
      }
    },
  };
}
type Store = ReturnType<typeof useStore>;
const Context = createContext<Store | null>(null);
export function PrototypeProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function usePrototype() {
  const store = useContext(Context);
  if (!store) throw new Error("PrototypeProvider is required");
  return store;
}
