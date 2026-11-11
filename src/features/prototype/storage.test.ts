import { describe, expect, it } from "vitest";
import { initialState } from "./model";
import {
  MAX_IMPORT_BYTES,
  parseState,
  readState,
  saveState,
  serializeState,
  STORAGE_KEY,
} from "./storage";
function memory(raw: string | null = null) {
  const values = new Map(raw === null ? [] : [[STORAGE_KEY, raw]]);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}
describe("browser persistence and recovery", () => {
  it("round-trips a complete valid scenario", () => {
    const storage = memory();
    const s = initialState();
    saveState(storage, serializeState(s), null);
    expect(readState(storage).state).toEqual(s);
    expect(parseState(serializeState(s))).toEqual(s);
  });
  it("protects incompatible/corrupt original saves", () => {
    for (const raw of ["{", JSON.stringify({ ...initialState(), version: 2 })]) {
      const storage = memory(raw);
      const loaded = readState(storage);
      expect(loaded.blocked).toBe(true);
      expect(loaded.original).toBe(raw);
      expect(storage.getItem(STORAGE_KEY)).toBe(raw);
    }
  });
  it("does not fail startup when storage access is denied", () => {
    expect(readState(null).state.jobs.length).toBeGreaterThan(0);
    expect(
      readState({
        getItem() {
          throw new Error("Denied");
        },
        setItem() {},
      }).blocked,
    ).toBe(true);
  });
  it("reports quota/write failure without altering the original", () => {
    const old = "old";
    const storage = {
      getItem: () => old,
      setItem() {
        throw new Error("QuotaExceededError");
      },
    };
    expect(() => saveState(storage, serializeState(initialState()), old)).toThrow("Wyeksportuj");
    expect(storage.getItem()).toBe(old);
  });
  it("preserves the first tab's save when a stale tab tries to overwrite it", () => {
    const storage = memory();
    const first = readState(storage);
    const second = readState(storage);
    const saved = serializeState(first.state);
    saveState(storage, saved, first.stored);
    expect(() => saveState(storage, serializeState(second.state), second.stored)).toThrow(
      "w innej karcie",
    );
    expect(storage.getItem(STORAGE_KEY)).toBe(saved);
  });
  it("refuses to produce a scenario file larger than the import limit", () => {
    const state = initialState();
    const base = serializeState(state).length;
    const fixture = { ...state, padding: "ą".repeat(MAX_IMPORT_BYTES - base) };
    expect(() => serializeState(fixture)).toThrow("limit 2 MB");
  });
  it("rejects invalid references and oversized files", () => {
    const s = initialState();
    s.saved = [{ candidateId: "missing", jobId: s.jobs[0].id }];
    expect(() => parseState(JSON.stringify(s))).toThrow("Dotychczasowy stan");
    expect(() => parseState(" ".repeat(MAX_IMPORT_BYTES + 1))).toThrow("za duży");
  });
  it("reopens an older, pretty-printed export at the exact byte limit", () => {
    const state = initialState();
    const legacy = JSON.stringify({ ...state, theme: "dark" }, null, 2);
    const raw = legacy.padEnd(MAX_IMPORT_BYTES - Buffer.byteLength(legacy) + legacy.length);
    expect(Buffer.byteLength(raw)).toBe(MAX_IMPORT_BYTES);
    expect(parseState(serializeState(parseState(raw)))).toEqual(state);
    expect(() => parseState(raw + " ")).toThrow("za duży");
  });
  it("accepts legacy appearance preferences without changing scenario data", () => {
    const state = initialState();
    for (const theme of ["dark", "system", "light"]) {
      expect(parseState(JSON.stringify({ ...state, theme }))).toEqual(state);
    }
  });
});
