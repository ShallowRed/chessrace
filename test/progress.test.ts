import { beforeEach, describe, expect, it } from "vitest";

import { levels, worlds } from "app/level/catalogue";

import {
  clearedCount,
  freshnessOf,
  isCompleted,
  isUnlocked,
  isWorldCleared,
  isWorldUnlocked,
  loadProgress,
  nextLevel,
  noProgress,
  recordPlay,
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

describe("what has been played, and in what shape", () => {

  const climb = levels[0]!;

  it("calls a level untested until it has been played", () => {
    expect(freshnessOf(noProgress, climb)).toBe("untested");
    expect(freshnessOf(recordPlay(noProgress, climb), climb)).toBe("tested");
  });

  it("calls it changed once the board underneath it moves", () => {
    const played = recordPlay(noProgress, climb);

    const edited = { ...climb, blueprint: `${climb.blueprint}11111111` };

    expect(freshnessOf(played, edited)).toBe("changed");
  });

  it("does not call it changed for a rename", () => {
    const played = recordPlay(noProgress, climb);

    expect(freshnessOf(played, { ...climb, name: "Ascent" })).toBe("tested");
  });

  it("keeps the best score while marking the shape played", () => {
    const progress = recordPlay(recordRun(noProgress, climb.slug, 3), climb);

    expect(progress.best[climb.slug]).toBe(3);
    expect(freshnessOf(progress, climb)).toBe("tested");
  });
});

describe("unlocking", () => {

  const clear = (...slugs: string[]) =>
    slugs.reduce((progress, slug) => recordRun(progress, slug, 3), noProgress);

  it("opens the first level to everyone", () => {
    expect(isUnlocked(noProgress, worlds, levels[0]!.slug)).toBe(true);
  });

  it("keeps the second level shut until the first is done", () => {
    const second = levels[1]!.slug;

    expect(isUnlocked(noProgress, worlds, second)).toBe(false);
    expect(isUnlocked(clear(levels[0]!.slug), worlds, second)).toBe(true);
  });

  it("does not unlock a level whose slug is unknown", () => {
    expect(isUnlocked(noProgress, worlds, "nope")).toBe(false);
  });

  it("keeps the next world shut until this one is cleared", () => {
    const [first, second] = worlds;

    const nearlyThere = clear(...first!.levels.slice(0, -1).map(l => l.slug));

    expect(isWorldUnlocked(nearlyThere, worlds, second!.slug)).toBe(false);
    expect(isUnlocked(nearlyThere, worlds, second!.levels[0]!.slug)).toBe(false);

    const cleared = clear(...first!.levels.map(l => l.slug));

    expect(isWorldUnlocked(cleared, worlds, second!.slug)).toBe(true);
    expect(isUnlocked(cleared, worlds, second!.levels[0]!.slug)).toBe(true);
  });

  it("counts what is cleared in a world", () => {
    const world = worlds[0]!;

    expect(clearedCount(noProgress, world)).toBe(0);
    expect(isWorldCleared(noProgress, world)).toBe(false);

    const cleared = clear(...world.levels.map(l => l.slug));

    expect(clearedCount(cleared, world)).toBe(world.levels.length);
    expect(isWorldCleared(cleared, world)).toBe(true);
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

  it("reads progress written before levels were fingerprinted", () => {
    storage.store.set("chessrace.progress", '{"best":{"climb":2}}');

    expect(loadProgress(storage)).toEqual({ best: { climb: 2 }, played: {} });
  });

  it("round trips what shape each level was played in", () => {
    saveProgress(storage, recordPlay(noProgress, levels[0]!));

    expect(freshnessOf(loadProgress(storage), levels[0]!)).toBe("tested");
  });
});
