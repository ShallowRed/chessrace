import { beforeEach, describe, expect, it } from "vitest";

import { levels } from "app/level/levels";

import {
  isCompleted,
  isUnlocked,
  loadProgress,
  nextLevel,
  noProgress,
  recordRun,
  saveProgress
} from "app/progress";

import type { KeyValueStore } from "app/storage";

const fakeStorage = (): KeyValueStore & { store: Map<string, string> } => {

  const store = new Map<string, string>();

  return {
    store,
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => void store.set(key, value)
  };
};

describe("recording a run", () => {

  it("marks a level as completed", () => {
    const progress = recordRun(noProgress, "climb", 4);

    expect(isCompleted(progress, "climb")).toBe(true);
    expect(isCompleted(progress, "leap")).toBe(false);
  });

  it("keeps the best move count", () => {
    let progress = recordRun(noProgress, "climb", 4);
    progress = recordRun(progress, "climb", 2);
    progress = recordRun(progress, "climb", 7);

    expect(progress.best["climb"]).toBe(2);
  });

  it("leaves the previous progress untouched", () => {
    const before = recordRun(noProgress, "climb", 4);
    const after = recordRun(before, "leap", 6);

    expect(before.best["leap"]).toBeUndefined();
    expect(after.best["climb"]).toBe(4);
  });
});

describe("unlocking", () => {

  it("opens the first level to everyone", () => {
    expect(isUnlocked(noProgress, levels, levels[0]!.slug)).toBe(true);
  });

  it("keeps the second level shut until the first is done", () => {
    const second = levels[1]!.slug;

    expect(isUnlocked(noProgress, levels, second)).toBe(false);
    expect(isUnlocked(recordRun(noProgress, levels[0]!.slug, 3), levels, second))
      .toBe(true);
  });

  it("does not unlock a level whose slug is unknown", () => {
    expect(isUnlocked(noProgress, levels, "nope")).toBe(false);
  });
});

describe("chaining", () => {

  it("gives the level after this one", () => {
    expect(nextLevel(levels, levels[0]!.slug)).toBe(levels[1]);
  });

  it("gives nothing after the last one", () => {
    expect(nextLevel(levels, levels[levels.length - 1]!.slug)).toBeUndefined();
  });
});

describe("persistence", () => {

  let storage: ReturnType<typeof fakeStorage>;

  beforeEach(() => {
    storage = fakeStorage();
  });

  it("round trips through storage", () => {
    saveProgress(storage, recordRun(noProgress, "climb", 2));

    expect(loadProgress(storage).best["climb"]).toBe(2);
  });

  it("starts empty when nothing was stored", () => {
    expect(loadProgress(storage)).toEqual(noProgress);
  });

  it("starts empty rather than throwing on damaged storage", () => {
    storage.store.set("chessrace.progress", "{not json");

    expect(loadProgress(storage)).toEqual(noProgress);
  });

  it("drops entries that are not move counts", () => {
    storage.store.set("chessrace.progress", '{"best":{"climb":2,"leap":"nope"}}');

    expect(loadProgress(storage).best).toEqual({ climb: 2 });
  });
});
