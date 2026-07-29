import { fingerprint } from 'app/level/fingerprint';

import type { Level, World } from 'app/level/catalogue';
import type { KeyValueStore } from 'app/storage';

export interface Progress {
  best: Record<string, number>;
  // The shape each level had the last time it was played, won or lost.
  played: Record<string, string>;
}

// Whether what is on the menu is what was played, for a catalogue still being
// written under the player's feet.
export type Freshness = "untested" | "changed" | "tested";

const KEY = "chessrace.progress";

export const noProgress: Progress = { best: {}, played: {} };

export function loadProgress(storage: KeyValueStore): Progress {

  const stored = storage.getItem(KEY);

  if (!stored) return noProgress;

  try {

    const parsed = JSON.parse(stored) as Partial<Progress> | null;

    if (!parsed?.best || typeof parsed.best !== "object") return noProgress;

    return {
      best: onlyValues(parsed.best, "number"),
      played: onlyValues(parsed.played ?? {}, "string")
    };

  } catch {

    return noProgress;
  }
}

const onlyValues = <T>(entries: Record<string, unknown>, kind: string) =>
  Object.fromEntries(Object
    .entries(entries)
    .filter(([, value]) => typeof value === kind)) as Record<string, T>;

export function saveProgress(storage: KeyValueStore, progress: Progress): void {

  storage.setItem(KEY, JSON.stringify(progress));
}

export function recordRun(progress: Progress, slug: string, moves: number): Progress {

  const previous = progress.best[slug];

  if (previous !== undefined && previous <= moves) return progress;

  return { ...progress, best: { ...progress.best, [slug]: moves } };
}

export function recordPlay(progress: Progress, level: Level): Progress {

  return {
    ...progress,
    played: { ...progress.played, [level.slug]: fingerprint(level) }
  };
}

export function freshnessOf(progress: Progress, level: Level): Freshness {

  const seen = progress.played[level.slug];

  if (seen === undefined) return "untested";

  return seen === fingerprint(level) ? "tested" : "changed";
}

export function isCompleted(progress: Progress, slug: string): boolean {

  return progress.best[slug] !== undefined;
}

export function isWorldUnlocked(
  progress: Progress,
  worlds: World[],
  slug: string
): boolean {

  const index = worlds.findIndex(world => world.slug === slug);

  if (index <= 0) return index === 0;

  return isWorldCleared(progress, worlds[index - 1] as World);
}

export function isWorldCleared(progress: Progress, world: World): boolean {

  return world.levels.every(({ slug }) => isCompleted(progress, slug));
}

export function clearedCount(progress: Progress, world: World): number {

  return world.levels.filter(({ slug }) => isCompleted(progress, slug)).length;
}

// A level opens once the one before it in its world is done, and the world
// itself opens once the world before it is cleared.
export function isUnlocked(
  progress: Progress,
  worlds: World[],
  slug: string
): boolean {

  const world = worlds.find(w => w.levels.some(level => level.slug === slug));

  if (!world || !isWorldUnlocked(progress, worlds, world.slug)) return false;

  const index = world.levels.findIndex(level => level.slug === slug);

  if (index === 0) return true;

  return isCompleted(progress, world.levels[index - 1]?.slug ?? "");
}

export function nextLevel(levels: Level[], slug: string): Level | undefined {

  return levels[levels.findIndex(level => level.slug === slug) + 1];
}
