import type { Level, World } from 'app/level/catalogue';
import type { KeyValueStore } from 'app/storage';

export interface Progress {
  best: Record<string, number>;
}

const KEY = "chessrace.progress";

export const noProgress: Progress = { best: {} };

export function loadProgress(storage: KeyValueStore): Progress {

  const stored = storage.getItem(KEY);

  if (!stored) return noProgress;

  try {

    const parsed: unknown = JSON.parse(stored);

    const best = (parsed as Progress | null)?.best;

    if (!best || typeof best !== "object") return noProgress;

    return {
      best: Object.fromEntries(Object
        .entries(best)
        .filter(([, moves]) => typeof moves === "number"))
    };

  } catch {

    return noProgress;
  }
}

export function saveProgress(storage: KeyValueStore, progress: Progress): void {

  storage.setItem(KEY, JSON.stringify(progress));
}

export function recordRun(progress: Progress, slug: string, moves: number): Progress {

  const previous = progress.best[slug];

  if (previous !== undefined && previous <= moves) return progress;

  return { best: { ...progress.best, [slug]: moves } };
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
